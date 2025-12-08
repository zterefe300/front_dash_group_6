import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAppStore } from '@/store';

type ContactFormState = {
  contactName: string;
  phoneNumber: string;
  email: string;
};

export function ContactDetails() {
  const token = useAppStore((state) => state.token);
  const restaurant = useAppStore((state) => state.user);
  const restaurantProfile = useAppStore((state) => state.restaurant);
  const isProfileUpdating = useAppStore((state) => state.isProfileUpdating);
  const fetchProfile = useAppStore((state) => state.fetchProfile);
  const updateContact = useAppStore((state) => state.updateContact);

  const [isEditing, setIsEditing] = useState(false);
  const [contacts, setContacts] = useState<ContactFormState>({
    contactName: restaurantProfile?.contactName || restaurant?.name || '',
    phoneNumber: restaurantProfile?.phone || restaurant?.phone || '',
    email: restaurantProfile?.email || restaurant?.email || '',
  });

  useEffect(() => {
    if (!token || !restaurant?.id) return;
    fetchProfile(token, restaurant.id).catch((error) => {
      console.error('Failed to fetch profile', error);
    });
  }, [token, restaurant?.id, fetchProfile]);

  useEffect(() => {
    if (restaurantProfile) {
      setContacts({
        contactName: restaurantProfile.contactName || '',
        phoneNumber: restaurantProfile.phone || '',
        email: restaurantProfile.email || '',
      });
    }
  }, [restaurantProfile]);

  const handleCancel = () => {
    setIsEditing(false);
    toast.info('Changes discarded');
  };

  const handleSave = () => {
    if (!token || !restaurant?.id) {
      toast.error('Please sign in again to update contacts');
      return;
    }
    updateContact(token, restaurant.id, {
      contactName: contacts.contactName,
      phoneNumber: contacts.phoneNumber,
      email: contacts.email,
    })
      .then(() => {
        setIsEditing(false);
        toast.success('Contact details updated successfully!');
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : 'Failed to update contact details';
        toast.error(message);
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Contact Details</h2>
          <p className="text-muted-foreground">Manage your restaurant&apos;s contact information</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Details</Button>
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
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Primary contact details for your restaurant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactName">Contact Name</Label>
            <Input
              id="contactName"
              value={contacts.contactName}
              onChange={(e) => setContacts((prev) => ({ ...prev, contactName: e.target.value }))}
              disabled={!isEditing}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={contacts.phoneNumber}
              onChange={(e) => setContacts((prev) => ({ ...prev, phoneNumber: e.target.value }))}
              disabled={!isEditing}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={contacts.email}
              onChange={(e) => setContacts((prev) => ({ ...prev, email: e.target.value }))}
              disabled={!isEditing}
              placeholder="contact@restaurant.com"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
