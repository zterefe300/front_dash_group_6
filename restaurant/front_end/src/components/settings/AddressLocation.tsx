import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { MapPin, Navigation } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function AddressLocation() {
  const [address, setAddress] = useState({
    street: "123 Main Street",
    unit: "Suite 100",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    neighborhood: "Downtown",
    landmark: "Near Central Park",
    deliveryZones: ["10001", "10002", "10003", "10004"],
    coordinates: {
      latitude: "40.7128",
      longitude: "-74.0060"
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Address and location updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form would go here
  };

  const addDeliveryZone = () => {
    const zipCode = prompt('Enter ZIP code for delivery zone:');
    if (zipCode && !address.deliveryZones.includes(zipCode)) {
      setAddress({
        ...address,
        deliveryZones: [...address.deliveryZones, zipCode]
      });
    }
  };

  const removeDeliveryZone = (zipCode: string) => {
    setAddress({
      ...address,
      deliveryZones: address.deliveryZones.filter(zone => zone !== zipCode)
    });
  };

  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Address & Location</h2>
          <p className="text-muted-foreground">Manage your restaurant's location and delivery zones</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Location</Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </div>

      {/* Physical Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Physical Address
          </CardTitle>
          <CardDescription>Your restaurant's street address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={address.street}
                onChange={(e) => setAddress({...address, street: e.target.value})}
                disabled={!isEditing}
                placeholder="123 Main Street"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit/Suite (Optional)</Label>
              <Input
                id="unit"
                value={address.unit}
                onChange={(e) => setAddress({...address, unit: e.target.value})}
                disabled={!isEditing}
                placeholder="Suite 100"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={address.city}
                onChange={(e) => setAddress({...address, city: e.target.value})}
                disabled={!isEditing}
                placeholder="New York"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select
                value={address.state}
                onValueChange={(value) => setAddress({...address, state: value})}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {states.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={address.zipCode}
                onChange={(e) => setAddress({...address, zipCode: e.target.value})}
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
              onChange={(e) => setAddress({...address, country: e.target.value})}
              disabled={!isEditing}
              placeholder="United States"
            />
          </div>
        </CardContent>
      </Card>

      {/* Location Details */}
      <Card>
        <CardHeader>
          <CardTitle>Location Details</CardTitle>
          <CardDescription>Additional information to help customers find you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Neighborhood</Label>
              <Input
                id="neighborhood"
                value={address.neighborhood}
                onChange={(e) => setAddress({...address, neighborhood: e.target.value})}
                disabled={!isEditing}
                placeholder="Downtown"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="landmark">Nearby Landmark</Label>
              <Input
                id="landmark"
                value={address.landmark}
                onChange={(e) => setAddress({...address, landmark: e.target.value})}
                disabled={!isEditing}
                placeholder="Near Central Park"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GPS Coordinates */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            GPS Coordinates
          </CardTitle>
          <CardDescription>Precise location for delivery navigation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                value={address.coordinates.latitude}
                onChange={(e) => setAddress({
                  ...address,
                  coordinates: {...address.coordinates, latitude: e.target.value}
                })}
                disabled={!isEditing}
                placeholder="40.7128"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                value={address.coordinates.longitude}
                onChange={(e) => setAddress({
                  ...address,
                  coordinates: {...address.coordinates, longitude: e.target.value}
                })}
                disabled={!isEditing}
                placeholder="-74.0060"
              />
            </div>
          </div>
          {isEditing && (
            <Button variant="outline">
              Auto-detect Coordinates
            </Button>
          )}
        </CardContent>
      </Card> */}

      {/* Delivery Zones */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Zones</CardTitle>
          <CardDescription>ZIP codes where you offer delivery service</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {address.deliveryZones.map((zone) => (
                <div key={zone} className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-md">
                  <span>{zone}</span>
                  {isEditing && (
                    <button
                      onClick={() => removeDeliveryZone(zone)}
                      className="ml-2 text-xs hover:text-destructive"
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

      {/* Map Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Location Preview</CardTitle>
          <CardDescription>How your location appears to customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg">{address.street}</p>
              <p className="text-muted-foreground">{address.city}, {address.state} {address.zipCode}</p>
              <p className="text-sm text-muted-foreground mt-2">Interactive map would be displayed here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}