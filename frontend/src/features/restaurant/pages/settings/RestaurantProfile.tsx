import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

type ProfileFormState = {
  name: string;
  description: string;
  businessType: string;
};

export function RestaurantProfile() {
  // TODO: Replace with real store data later
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileFormState>({
    name: 'Mock Restaurant',
    description: 'A wonderful restaurant serving delicious food',
    businessType: 'Restaurant',
  });

  const handleSave = () => {
    // Mock: Just update local state
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values if needed
    toast.info('Changes discarded');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Restaurant Profile</h2>
          <p className="text-muted-foreground">Manage your restaurant&apos;s public information</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
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
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Tell customers more about your restaurant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Restaurant Name</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
              disabled={!isEditing}
              placeholder="FrontDash Demo Kitchen"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Restaurant Description</Label>
            <Textarea
              id="description"
              value={profile.description}
              onChange={(e) => setProfile((prev) => ({ ...prev, description: e.target.value }))}
              disabled={!isEditing}
              placeholder="Describe your restaurant, atmosphere, and offerings"
              rows={5}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessType">Business Type</Label>
            <Input
              id="businessType"
              value={profile.businessType}
              onChange={(e) => setProfile((prev) => ({ ...prev, businessType: e.target.value }))}
              disabled={!isEditing}
              placeholder="Restaurant, Cafe, Bakery..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
