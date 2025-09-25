import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Phone, Mail, MessageSquare } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ContactDetails() {
  const [contacts, setContacts] = useState({
    primaryPhone: "+1 (555) 123-4567",
    secondaryPhone: "+1 (555) 123-4568",
    email: "orders@bellasitaliankitchen.com",
    supportEmail: "support@bellasitaliankitchen.com",
    emergencyContact: {
      name: "Marco Bellucci",
      phone: "+1 (555) 987-6543",
      relationship: "Owner"
    },
    deliveryInstructions: "Ring doorbell twice. Building entrance is on Main Street side."
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Contact details updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form would go here
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Contact Details</h2>
          <p className="text-muted-foreground">Manage your restaurant's contact information</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Details</Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </div>

      {/* Phone Numbers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Phone Numbers
          </CardTitle>
          <CardDescription>Primary and secondary contact numbers for your restaurant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryPhone">Primary Phone</Label>
              <Input
                id="primaryPhone"
                value={contacts.primaryPhone}
                onChange={(e) => setContacts({...contacts, primaryPhone: e.target.value})}
                disabled={!isEditing}
                placeholder="+1 (555) 123-4567"
              />
              <p className="text-xs text-muted-foreground">Main number for customer orders</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryPhone">Secondary Phone</Label>
              <Input
                id="secondaryPhone"
                value={contacts.secondaryPhone}
                onChange={(e) => setContacts({...contacts, secondaryPhone: e.target.value})}
                disabled={!isEditing}
                placeholder="+1 (555) 123-4568"
              />
              <p className="text-xs text-muted-foreground">Backup number for high volume times</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Addresses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Addresses
          </CardTitle>
          <CardDescription>Email contacts for different purposes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Primary Email</Label>
              <Input
                id="email"
                type="email"
                value={contacts.email}
                onChange={(e) => setContacts({...contacts, email: e.target.value})}
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
                onChange={(e) => setContacts({...contacts, supportEmail: e.target.value})}
                disabled={!isEditing}
                placeholder="support@restaurant.com"
              />
              <p className="text-xs text-muted-foreground">For customer support and complaints</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
          <CardDescription>Primary contact person for urgent matters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyName">Contact Name</Label>
              <Input
                id="emergencyName"
                value={contacts.emergencyContact.name}
                onChange={(e) => setContacts({
                  ...contacts,
                  emergencyContact: {...contacts.emergencyContact, name: e.target.value}
                })}
                disabled={!isEditing}
                placeholder="Full Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Phone Number</Label>
              <Input
                id="emergencyPhone"
                value={contacts.emergencyContact.phone}
                onChange={(e) => setContacts({
                  ...contacts,
                  emergencyContact: {...contacts.emergencyContact, phone: e.target.value}
                })}
                disabled={!isEditing}
                placeholder="+1 (555) 987-6543"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Input
                id="relationship"
                value={contacts.emergencyContact.relationship}
                onChange={(e) => setContacts({
                  ...contacts,
                  emergencyContact: {...contacts.emergencyContact, relationship: e.target.value}
                })}
                disabled={!isEditing}
                placeholder="e.g., Owner, Manager"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Delivery Instructions
          </CardTitle>
          <CardDescription>Special instructions for delivery drivers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="deliveryInstructions">Instructions</Label>
            <textarea
              id="deliveryInstructions"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={contacts.deliveryInstructions}
              onChange={(e) => setContacts({...contacts, deliveryInstructions: e.target.value})}
              disabled={!isEditing}
              placeholder="Provide specific instructions for delivery drivers..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Include details about parking, building access, or special delivery requirements
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Preferences</CardTitle>
          <CardDescription>How you prefer to be contacted by FrontDash</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Preferred contact method for:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm">Order notifications</p>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="orderNotifications" value="phone" defaultChecked disabled={!isEditing} />
                      <span className="text-sm">Phone</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="orderNotifications" value="email" disabled={!isEditing} />
                      <span className="text-sm">Email</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">Marketing updates</p>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="marketingUpdates" value="email" defaultChecked disabled={!isEditing} />
                      <span className="text-sm">Email</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="marketingUpdates" value="none" disabled={!isEditing} />
                      <span className="text-sm">None</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}