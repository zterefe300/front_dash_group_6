import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';

import { useAppStore } from '@/store';
import type { RestaurantAddress, RestaurantSummary } from '@/api/restaurant';

type AddressFormState = {
  street: string;
  unit: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  neighborhood: string;
  landmark: string;
  deliveryZones: string[];
  latitude: string;
  longitude: string;
};

const mapSummaryToAddress = (restaurant?: RestaurantSummary): AddressFormState => {
  const address: RestaurantAddress | undefined = restaurant?.address;
  return {
    street: address?.street ?? '',
    unit: address?.unit ?? '',
    city: address?.city ?? '',
    state: address?.state ?? '',
    zipCode: address?.zipCode ?? '',
    country: address?.country ?? '',
    neighborhood: address?.neighborhood ?? '',
    landmark: address?.landmark ?? '',
    deliveryZones: address?.deliveryZones ?? [],
    latitude: address?.coordinates?.latitude ?? '',
    longitude: address?.coordinates?.longitude ?? '',
  };
};

const STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

export function AddressLocation() {
  const restaurant = useAppStore((state) => state.restaurant);
  const updateRestaurantAddress = useAppStore((state) => state.updateRestaurantAddress);
  const isAddressSaving = useAppStore((state) => state.isAddressSaving);
  const addressError = useAppStore((state) => state.addressError);

  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState<AddressFormState>(() => mapSummaryToAddress(restaurant ?? undefined));

  useEffect(() => {
    if (!isEditing) {
      setAddress(mapSummaryToAddress(restaurant ?? undefined));
    }
  }, [restaurant, isEditing]);

  useEffect(() => {
    if (addressError) {
      toast.error(addressError);
    }
  }, [addressError]);

  const handleCancel = () => {
    setAddress(mapSummaryToAddress(restaurant ?? undefined));
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await updateRestaurantAddress({
        street: address.street,
        unit: address.unit || undefined,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country || undefined,
        neighborhood: address.neighborhood || undefined,
        landmark: address.landmark || undefined,
        deliveryZones: address.deliveryZones,
        coordinates: {
          latitude: address.latitude || undefined,
          longitude: address.longitude || undefined,
        },
      });
      setIsEditing(false);
      toast.success('Address and location updated successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update address';
      toast.error(message);
    }
  };

  const addDeliveryZone = () => {
    if (!isEditing) return;
    const zipCode = prompt('Enter ZIP code for delivery zone:');
    if (!zipCode) return;
    setAddress((prev) => {
      if (prev.deliveryZones.includes(zipCode)) return prev;
      return { ...prev, deliveryZones: [...prev.deliveryZones, zipCode] };
    });
  };

  const removeDeliveryZone = (zipCode: string) => {
    if (!isEditing) return;
    setAddress((prev) => ({
      ...prev,
      deliveryZones: prev.deliveryZones.filter((zone) => zone !== zipCode),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Address & Location</h2>
          <p className="text-muted-foreground">Manage your restaurant&apos;s location and delivery zones</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Location</Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={handleCancel} disabled={isAddressSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isAddressSaving}>
              {isAddressSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Physical Address
          </CardTitle>
          <CardDescription>Your restaurant&apos;s street address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={address.street}
                onChange={(e) => setAddress((prev) => ({ ...prev, street: e.target.value }))}
                disabled={!isEditing}
                placeholder="123 Main Street"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit/Suite (Optional)</Label>
              <Input
                id="unit"
                value={address.unit}
                onChange={(e) => setAddress((prev) => ({ ...prev, unit: e.target.value }))}
                disabled={!isEditing}
                placeholder="Suite 100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={address.city}
                onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
                disabled={!isEditing}
                placeholder="New York"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select
                value={address.state}
                onValueChange={(value) => setAddress((prev) => ({ ...prev, state: value }))}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  {STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={address.zipCode}
                onChange={(e) => setAddress((prev) => ({ ...prev, zipCode: e.target.value }))}
                disabled={!isEditing}
                placeholder="10001"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={address.country}
              onChange={(e) => setAddress((prev) => ({ ...prev, country: e.target.value }))}
              disabled={!isEditing}
              placeholder="United States"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location Details</CardTitle>
          <CardDescription>Additional information to help customers find you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Neighborhood</Label>
              <Input
                id="neighborhood"
                value={address.neighborhood}
                onChange={(e) => setAddress((prev) => ({ ...prev, neighborhood: e.target.value }))}
                disabled={!isEditing}
                placeholder="Downtown"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="landmark">Nearby Landmark</Label>
              <Input
                id="landmark"
                value={address.landmark}
                onChange={(e) => setAddress((prev) => ({ ...prev, landmark: e.target.value }))}
                disabled={!isEditing}
                placeholder="Near Central Park"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Zones</CardTitle>
          <CardDescription>ZIP codes where you offer delivery service</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {address.deliveryZones.map((zone) => (
                <div
                  key={zone}
                  className="flex items-center rounded-md bg-secondary px-3 py-1 text-secondary-foreground"
                >
                  <span>{zone}</span>
                  {isEditing && (
                    <button
                      onClick={() => removeDeliveryZone(zone)}
                      className="ml-2 text-xs hover:text-destructive"
                      type="button"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            {isEditing && (
              <Button variant="outline" onClick={addDeliveryZone}>
                Add Delivery Zone
              </Button>
            )}
            <p className="text-sm text-muted-foreground">
              Customers in these ZIP codes will be able to order delivery from your restaurant.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location Preview</CardTitle>
          <CardDescription>How your location appears to customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed bg-muted">
            <div className="text-center">
              <MapPin className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg">{address.street}</p>
              <p className="text-muted-foreground">
                {address.city}, {address.state} {address.zipCode}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Interactive map preview coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
