import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';

type AddressFormState = {
  building: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
};

const STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

export function AddressLocation() {
  // TODO: Replace with real store data later
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState<AddressFormState>({
    building: 'Building A',
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
  });

  const handleCancel = () => {
    setIsEditing(false);
    toast.info('Changes discarded');
  };

  const handleSave = () => {
    // Mock: Just update local state
    setIsEditing(false);
    toast.success('Address updated successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Address & Location</h2>
          <p className="text-muted-foreground">Manage your restaurant&apos;s location</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Location</Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
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
          <div className="space-y-2">
            <Label htmlFor="building">Building</Label>
            <Input
              id="building"
              value={address.building}
              onChange={(e) => setAddress((prev) => ({ ...prev, building: e.target.value }))}
              disabled={!isEditing}
              placeholder="Building A"
            />
          </div>
          <div className="space-y-2">
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
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={address.city}
              onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
              disabled={!isEditing}
              placeholder="New York"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
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
        </CardContent>
      </Card>
    </div>
  );
}
