import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Clock, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface DayHours {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface SpecialHours {
  date: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  reason: string;
}

export function OperatingHours() {
  const [hours, setHours] = useState<Record<string, DayHours>>({
    monday: { isOpen: true, openTime: "11:00", closeTime: "22:00" },
    tuesday: { isOpen: true, openTime: "11:00", closeTime: "22:00" },
    wednesday: { isOpen: true, openTime: "11:00", closeTime: "22:00" },
    thursday: { isOpen: true, openTime: "11:00", closeTime: "22:00" },
    friday: { isOpen: true, openTime: "11:00", closeTime: "23:00" },
    saturday: { isOpen: true, openTime: "11:00", closeTime: "23:00" },
    sunday: { isOpen: true, openTime: "12:00", closeTime: "21:00" }
  });

  const [specialHours, setSpecialHours] = useState<SpecialHours[]>([
    {
      date: "2024-12-25",
      isOpen: false,
      openTime: "",
      closeTime: "",
      reason: "Christmas Day"
    },
    {
      date: "2024-12-31",
      isOpen: true,
      openTime: "17:00",
      closeTime: "01:00",
      reason: "New Year's Eve"
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);

  const dayNames = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday"
  };

  const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Operating hours updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form would go here
  };

  const updateDayHours = (day: string, field: keyof DayHours, value: any) => {
    setHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const copyHours = (fromDay: string, toDay: string) => {
    setHours(prev => ({
      ...prev,
      [toDay]: { ...prev[fromDay] }
    }));
  };

  const addSpecialHours = () => {
    const newSpecial: SpecialHours = {
      date: "",
      isOpen: true,
      openTime: "11:00",
      closeTime: "22:00",
      reason: ""
    };
    setSpecialHours([...specialHours, newSpecial]);
  };

  const updateSpecialHours = (index: number, field: keyof SpecialHours, value: any) => {
    const updated = [...specialHours];
    updated[index] = { ...updated[index], [field]: value };
    setSpecialHours(updated);
  };

  const removeSpecialHours = (index: number) => {
    setSpecialHours(specialHours.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Operating Hours</h2>
          <p className="text-muted-foreground">Set your restaurant's regular and special operating hours</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Hours</Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Current Status
          </CardTitle>
          <CardDescription>Your restaurant's current operating status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Restaurant Status</p>
              <p className="text-sm text-muted-foreground">Based on your current operating hours</p>
            </div>
            <Badge variant="secondary" className="bg-green-500 text-white">
              Open
            </Badge>
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Today:</strong> Open until 10:00 PM
            </p>
            <p className="text-sm text-muted-foreground">
              Next opening: Tomorrow at 11:00 AM
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Regular Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Regular Operating Hours</CardTitle>
          <CardDescription>Set your weekly schedule</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(dayNames).map(([day, dayName]) => (
            <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-20">
                  <span className="font-medium">{dayName}</span>
                </div>
                <Switch
                  checked={hours[day].isOpen}
                  onCheckedChange={(checked) => updateDayHours(day, 'isOpen', checked)}
                  disabled={!isEditing}
                />
              </div>
              
              {hours[day].isOpen ? (
                <div className="flex items-center space-x-2">
                  <Select
                    value={hours[day].openTime}
                    onValueChange={(value) => updateDayHours(day, 'openTime', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>to</span>
                  <Select
                    value={hours[day].closeTime}
                    onValueChange={(value) => updateDayHours(day, 'closeTime', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const fromDay = Object.keys(dayNames).find(d => d !== day);
                        if (fromDay) copyHours(fromDay, day);
                      }}
                    >
                      Copy
                    </Button>
                  )}
                </div>
              ) : (
                <Badge variant="secondary">Closed</Badge>
              )}
            </div>
          ))}
          
          {isEditing && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  const weekdayHours = { isOpen: true, openTime: "11:00", closeTime: "22:00" };
                  ["monday", "tuesday", "wednesday", "thursday", "friday"].forEach(day => {
                    setHours(prev => ({ ...prev, [day]: weekdayHours }));
                  });
                }}
              >
                Set Weekday Hours
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const weekendHours = { isOpen: true, openTime: "11:00", closeTime: "23:00" };
                  ["saturday", "sunday"].forEach(day => {
                    setHours(prev => ({ ...prev, [day]: weekendHours }));
                  });
                }}
              >
                Set Weekend Hours
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Special Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Special Hours & Holidays
          </CardTitle>
          <CardDescription>Override regular hours for specific dates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {specialHours.map((special, index) => (
            <div key={index} className="p-3 border rounded-lg space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <Label htmlFor={`date-${index}`}>Date</Label>
                  <input
                    id={`date-${index}`}
                    type="date"
                    value={special.date}
                    onChange={(e) => updateSpecialHours(index, 'date', e.target.value)}
                    disabled={!isEditing}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div>
                  <Label htmlFor={`reason-${index}`}>Reason</Label>
                  <input
                    id={`reason-${index}`}
                    value={special.reason}
                    onChange={(e) => updateSpecialHours(index, 'reason', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Holiday name"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={special.isOpen}
                    onCheckedChange={(checked) => updateSpecialHours(index, 'isOpen', checked)}
                    disabled={!isEditing}
                  />
                  <Label>Open</Label>
                </div>
                <div className="flex items-center space-x-2">
                  {isEditing && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSpecialHours(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
              
              {special.isOpen && (
                <div className="flex items-center space-x-2">
                  <Select
                    value={special.openTime}
                    onValueChange={(value) => updateSpecialHours(index, 'openTime', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>to</span>
                  <Select
                    value={special.closeTime}
                    onValueChange={(value) => updateSpecialHours(index, 'closeTime', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          ))}
          
          {isEditing && (
            <Button variant="outline" onClick={addSpecialHours}>
              Add Special Hours
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Delivery Hours Note */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">
              • Changes to operating hours will take effect immediately for new orders
            </p>
            <p className="text-sm">
              • Customers will see updated hours on your restaurant page
            </p>
            <p className="text-sm">
              • Special hours override regular hours for the specified dates
            </p>
            <p className="text-sm">
              • Make sure to update hours for holidays and special events in advance
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}