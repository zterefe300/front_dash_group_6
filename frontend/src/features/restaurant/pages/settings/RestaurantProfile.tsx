import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAppStore } from '@/store';
import { ImageUpload } from '../ImageUpload';

type ProfileFormState = {
  name: string;
<<<<<<< HEAD
  imageUrl?: string;
=======
>>>>>>> a0a5f5f87fb9e5cf008038fa5b1e4a585a1dc5ee
};

export function RestaurantProfile() {
  const token = useAppStore((state) => state.token);
  const restaurant = useAppStore((state) => state.user);
  const restaurantProfile = useAppStore((state) => state.restaurant);
  const isProfileLoading = useAppStore((state) => state.isProfileLoading);
  const isProfileUpdating = useAppStore((state) => state.isProfileUpdating);
  const fetchProfile = useAppStore((state) => state.fetchProfile);
  const updateProfile = useAppStore((state) => state.updateProfile);

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileFormState>({
    name: restaurantProfile?.name || restaurant?.name || '',
<<<<<<< HEAD
    imageUrl: restaurantProfile?.imageUrl,
=======
>>>>>>> a0a5f5f87fb9e5cf008038fa5b1e4a585a1dc5ee
  });

  useEffect(() => {
    if (!token || !restaurant?.id) return;
    fetchProfile(token, restaurant.id).catch((error) => {
      console.error('Failed to fetch profile', error);
    });
  }, [token, restaurant?.id, fetchProfile]);

  useEffect(() => {
    if (restaurantProfile) {
      setProfile({
        name: restaurantProfile.name,
<<<<<<< HEAD
        imageUrl: restaurantProfile.imageUrl,
=======
>>>>>>> a0a5f5f87fb9e5cf008038fa5b1e4a585a1dc5ee
      });
    }
  }, [restaurantProfile]);

  const handleSave = () => {
    if (!token || !restaurant?.id) {
      toast.error('Please sign in again to update profile');
      return;
    }
    updateProfile(token, restaurant.id, {
      name: profile.name,
<<<<<<< HEAD
      imageUrl: profile.imageUrl,
=======
>>>>>>> a0a5f5f87fb9e5cf008038fa5b1e4a585a1dc5ee
    })
      .then(() => {
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : 'Failed to update profile';
        toast.error(message);
      });
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (restaurantProfile) {
      setProfile({
        name: restaurantProfile.name,
        imageUrl: restaurantProfile.imageUrl,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Restaurant Profile</h2>
          <p className="text-muted-foreground">Manage your restaurant&apos;s public information</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} disabled={isProfileLoading}>
            Edit Profile
          </Button>
        ) : (
          <div className="space-x-2">
            <Button onClick={handleCancel} disabled={isProfileUpdating}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isProfileUpdating}>
              {isProfileUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Manage your restaurant&apos;s Image</CardDescription>
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
<<<<<<< HEAD
          <ImageUpload
            value={profile.imageUrl}
            onChange={(url) => setProfile((prev) => ({ ...prev, imageUrl: url }))}
            label="Restaurant Image"
            disabled={!isEditing}
          />
=======
>>>>>>> a0a5f5f87fb9e5cf008038fa5b1e4a585a1dc5ee
        </CardContent>
      </Card>
    </div>
  );
}
