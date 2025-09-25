import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Store, CheckCircle } from 'lucide-react';

interface RestaurantRegistrationProps {
  onComplete: () => void;
}

export function RestaurantRegistration({ onComplete }: RestaurantRegistrationProps) {
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cuisine: '',
    description: '',
    businessLicense: '',
    taxId: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock submission - in a real app, this would call an API
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">Registration Submitted</h2>
          <p className="text-muted-foreground mt-2">
            Thank you for your interest in FrontDash!
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold mb-2">What happens next?</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-medium mt-0.5">
                      1
                    </div>
                    <p>Our team will review your application within 2-3 business days</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-medium mt-0.5">
                      2
                    </div>
                    <p>We may contact you for additional information or documentation</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-medium mt-0.5">
                      3
                    </div>
                    <p>You'll receive an email notification with the approval decision</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-medium mt-0.5">
                      4
                    </div>
                    <p>Once approved, you can start using your restaurant dashboard</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Application Reference:</strong> FD-{Date.now().toString().slice(-6)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Please save this reference number for future correspondence
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={onComplete} className="w-full">
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Store className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Restaurant Registration</h2>
        <p className="text-muted-foreground mt-2">
          Join FrontDash and start receiving orders
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Register Your Restaurant</CardTitle>
          <CardDescription>
            Please provide your restaurant details. All fields are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Restaurant Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Restaurant Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="restaurantName">Restaurant Name *</Label>
                  <Input
                    id="restaurantName"
                    value={formData.restaurantName}
                    onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                    placeholder="Bella Italia"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cuisine">Cuisine Type *</Label>
                  <Select onValueChange={(value) => handleInputChange('cuisine', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cuisine type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                      <SelectItem value="mexican">Mexican</SelectItem>
                      <SelectItem value="indian">Indian</SelectItem>
                      <SelectItem value="american">American</SelectItem>
                      <SelectItem value="thai">Thai</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Restaurant Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your restaurant, specialties, and what makes you unique..."
                  required
                />
              </div>
            </div>

            {/* Owner Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Owner Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name *</Label>
                  <Input
                    id="ownerName"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    placeholder="John Smith"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="owner@restaurant.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
            </div>

            {/* Business Address */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Business Address</h3>
              
              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="New York"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="NY"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="10001"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Business Documentation */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Business Documentation</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessLicense">Business License Number *</Label>
                  <Input
                    id="businessLicense"
                    value={formData.businessLicense}
                    onChange={(e) => handleInputChange('businessLicense', e.target.value)}
                    placeholder="BL123456789"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID / EIN *</Label>
                  <Input
                    id="taxId"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                    placeholder="12-3456789"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                By submitting this registration, you acknowledge that FrontDash will review your application 
                and notify you of the approval decision. Registration does not guarantee approval to join 
                the FrontDash platform.
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Submitting Application...' : 'Submit Registration'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}