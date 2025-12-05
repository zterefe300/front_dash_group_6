import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

import { useAppStore } from '@/store';
import type { RestaurantSummary } from '@/api/restaurant';

type ContactFormState = {
  primaryPhone: string;
  supportPhone: string;
  email: string;
  supportEmail: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  deliveryInstructions: string;
};

const mapSummaryToContact = (restaurant?: RestaurantSummary): ContactFormState => ({
  primaryPhone: restaurant?.primaryPhone ?? '',
  supportPhone: restaurant?.supportPhone ?? '',
  email: restaurant?.primaryEmail ?? '',
  supportEmail: restaurant?.supportEmail ?? '',
  emergencyContactName: restaurant?.emergencyContact?.name ?? '',
  emergencyContactPhone: restaurant?.emergencyContact?.phone ?? '',
  emergencyContactRelationship: restaurant?.emergencyContact?.relationship ?? '',
  deliveryInstructions: restaurant?.deliveryInstructions ?? '',
});

export function ContactDetails() {
  const restaurant = useAppStore((state) => state.restaurant);
  const updateRestaurantContact = useAppStore((state) => state.updateRestaurantContact);
  const isContactSaving = useAppStore((state) => state.isContactSaving);
  const contactError = useAppStore((state) => state.contactError);

  const [isEditing, setIsEditing] = useState(false);
  const [contacts, setContacts] = useState<ContactFormState>(() => mapSummaryToContact(restaurant ?? undefined));

  useEffect(() => {
    if (!isEditing) {
      setContacts(mapSummaryToContact(restaurant ?? undefined));
    }
  }, [restaurant, isEditing]);

  useEffect(() => {
    if (contactError) {
      toast.error(contactError);
    }
  }, [contactError]);

  const handleCancel = () => {
    setContacts(mapSummaryToContact(restaurant ?? undefined));
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await updateRestaurantContact({
        primaryPhone: contacts.primaryPhone,
        supportPhone: contacts.supportPhone || undefined,
        email: contacts.email,
        supportEmail: contacts.supportEmail || undefined,
        emergencyContact: {
          name: contacts.emergencyContactName,
          phone: contacts.emergencyContactPhone,
          relationship: contacts.emergencyContactRelationship,
        },
        deliveryInstructions: contacts.deliveryInstructions || undefined,
      });
      setIsEditing(false);
      toast.success('Contact details updated successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update contact details';
      toast.error(message);
    }
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
            <Button variant="outline" onClick={handleCancel} disabled={isContactSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isContactSaving}>
              {isContactSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Phone Numbers
          </CardTitle>
          <CardDescription>Primary and secondary contact numbers for your restaurant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="primaryPhone">Primary Phone</Label>
              <Input
                id="primaryPhone"
                value={contacts.primaryPhone}
                onChange={(e) => setContacts((prev) => ({ ...prev, primaryPhone: e.target.value }))}
                disabled={!isEditing}
                placeholder="+1 (555) 123-4567"
              />
              <p className="text-xs text-muted-foreground">Main number for customer orders</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportPhone">Secondary Phone</Label>
              <Input
                id="supportPhone"
                value={contacts.supportPhone}
                onChange={(e) => setContacts((prev) => ({ ...prev, supportPhone: e.target.value }))}
                disabled={!isEditing}
                placeholder="+1 (555) 123-4568"
              />
              <p className="text-xs text-muted-foreground">Backup number for high volume times</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Addresses
          </CardTitle>
          <CardDescription>Email contacts for different purposes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Primary Email</Label>
              <Input
                id="email"
                type="email"
                value={contacts.email}
                onChange={(e) => setContacts((prev) => ({ ...prev, email: e.target.value }))}
                disabled={!isEditing}
                placeholder="orders@restaurant.com"
              />
              <p className="text-xs text-muted-foreground">Main email for orders and inquiries</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={contacts.supportEmail}
                onChange={(e) => setContacts((prev) => ({ ...prev, supportEmail: e.target.value }))}
                disabled={!isEditing}
                placeholder="support@restaurant.com"
              />
              <p className="text-xs text-muted-foreground">For customer support and complaints</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Delivery Instructions
          </CardTitle>
          <CardDescription>Helpful notes for drivers or customers</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            id="deliveryInstructions"
            value={contacts.deliveryInstructions}
            onChange={(e) => setContacts((prev) => ({ ...prev, deliveryInstructions: e.target.value }))}
            disabled={!isEditing}
            placeholder="Ring doorbell twice. Building entrance is on Main Street side."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
          <CardDescription>Primary contact person for urgent matters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="emergencyName">Contact Name</Label>
              <Input
                id="emergencyName"
                value={contacts.emergencyContactName}
                onChange={(e) => setContacts((prev) => ({ ...prev, emergencyContactName: e.target.value }))}
                disabled={!isEditing}
                placeholder="Full Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Phone Number</Label>
              <Input
                id="emergencyPhone"
                value={contacts.emergencyContactPhone}
                onChange={(e) => setContacts((prev) => ({ ...prev, emergencyContactPhone: e.target.value }))}
                disabled={!isEditing}
                placeholder="+1 (555) 987-6543"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Input
                id="relationship"
                value={contacts.emergencyContactRelationship}
                onChange={(e) => setContacts((prev) => ({ ...prev, emergencyContactRelationship: e.target.value }))}
                disabled={!isEditing}
                placeholder="e.g., Owner, Manager"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
