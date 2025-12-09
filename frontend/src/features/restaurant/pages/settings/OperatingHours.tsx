import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAppStore } from '@/store';

interface DayHours {
  operatingHourId?: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

const DAY_KEYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

type DayKey = typeof DAY_KEYS[number];

const createDefaultHours = (): Record<DayKey, DayHours> => ({
  monday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
  tuesday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
  wednesday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
  thursday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
  friday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
  saturday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
  sunday: { isOpen: true, openTime: '12:00', closeTime: '21:00' },
});

export function OperatingHours() {
  const token = useAppStore((state) => state.token);
  const restaurant = useAppStore((state) => state.user);
  const operatingHours = useAppStore((state) => state.operatingHours);
  const isOperatingHoursLoading = useAppStore((state) => state.isOperatingHoursLoading);
  const isOperatingHoursUpdating = useAppStore((state) => state.isOperatingHoursUpdating);
  const fetchOperatingHours = useAppStore((state) => state.fetchOperatingHours);
  const updateOperatingHours = useAppStore((state) => state.updateOperatingHours);

  const [isEditing, setIsEditing] = useState(false);
  const [hours, setHours] = useState<Record<DayKey, DayHours>>(createDefaultHours());

  useEffect(() => {
    if (!token || !restaurant?.id) return;
    fetchOperatingHours(token, restaurant.id).catch((error) => console.error('Failed to fetch hours', error));
  }, [token, restaurant?.id, fetchOperatingHours]);

  useEffect(() => {
    if (operatingHours && operatingHours.length > 0) {
      const mapped: Record<DayKey, DayHours> = createDefaultHours();
      operatingHours.forEach((entry) => {
        const key = entry.day.toLowerCase() as DayKey;
        if (DAY_KEYS.includes(key)) {
          mapped[key] = {
            operatingHourId: entry.operatingHourId,
            isOpen: entry.isOpen !== false,
            openTime: entry.openTime || '09:00',
            closeTime: entry.closeTime || '21:00',
          };
        }
      });
      setHours(mapped);
    }
  }, [operatingHours]);

  const dayNames: Record<DayKey, string> = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  };

  const timeSlots = useMemo(
    () =>
      Array.from({ length: 24 * 4 }, (_, i) => {
        const hour = Math.floor(i / 4);
        const minute = (i % 4) * 15;
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      }),
    []
  );

  const handleSave = () => {
    if (!token || !restaurant?.id) {
      toast.error('Please sign in again to update operating hours');
      return;
    }
    const payload = {
      hours: Object.entries(hours).map(([dayKey, cfg]) => ({
        operatingHourId: cfg.operatingHourId,
        day: dayKey,
        isOpen: cfg.isOpen,
        openTime: cfg.isOpen ? cfg.openTime : '',
        closeTime: cfg.isOpen ? cfg.closeTime : '',
      })),
    };
    updateOperatingHours(token, restaurant.id, payload)
      .then(() => {
        setIsEditing(false);
        toast.success('Operating hours updated successfully!');
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : 'Failed to update operating hours';
        toast.error(message);
      });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setHours(createDefaultHours());
    toast.info('Changes discarded');
  };

  const updateDayHours = (day: DayKey, field: keyof DayHours, value: string | boolean) => {
    setHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Operating Hours</h2>
          <p className="text-muted-foreground">Set your restaurant's weekly operating hours</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} disabled={isOperatingHoursLoading}>
            Edit Hours
          </Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={handleCancel} disabled={isOperatingHoursUpdating}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isOperatingHoursUpdating}>
              {isOperatingHoursUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Regular Operating Hours</CardTitle>
          <CardDescription>Set your weekly schedule</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(Object.entries(dayNames) as [DayKey, string][]).map(([day, dayName]) => {
            const dayConfig = hours[day];
            return (
              <div key={day} className="p-3 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-20">
                      <span className="font-medium">{dayName}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-bold ${dayConfig.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                      {dayConfig.isOpen ? 'Open' : 'Closed'}
                    </span>
                    <Switch
                      checked={dayConfig.isOpen}
                      onCheckedChange={(checked) => updateDayHours(day, 'isOpen', checked)}
                      disabled={!isEditing}
                      style={{
                        backgroundColor: dayConfig.isOpen ? '#16a34a' : '#dc2626'
                      }}
                    />
                  </div>
                </div>

                {dayConfig.isOpen && (
                  <div className="flex items-center space-x-2 pl-24">
                    <Select
                      value={dayConfig.openTime}
                      onValueChange={(value) => updateDayHours(day, 'openTime', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={`${day}-open-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-sm">to</span>
                    <Select
                      value={dayConfig.closeTime}
                      onValueChange={(value) => updateDayHours(day, 'closeTime', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={`${day}-close-${time}`} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            );
          })}

          {isEditing && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setHours((prev) => {
                    const updated = { ...prev };
                    (['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as DayKey[]).forEach(
                      (day) => {
                        updated[day] = { isOpen: true, openTime: '11:00', closeTime: '22:00' };
                      }
                    );
                    return updated;
                  });
                }}
              >
                Set Weekday Hours
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setHours((prev) => {
                    const updated = { ...prev };
                    (['saturday', 'sunday'] as DayKey[]).forEach((day) => {
                      updated[day] = { isOpen: true, openTime: '11:00', closeTime: '23:00' };
                    });
                    return updated;
                  });
                }}
              >
                Set Weekend Hours
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
