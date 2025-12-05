import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/common/card';
import { Button } from '../../../components/common/button';
import { Input } from '../../../components/common/input';
import { Label } from '../../../components/common/label';
import { Alert, AlertDescription } from '../../../components/common/alert';
import { MapPin, CheckCircle, AlertCircle, Truck } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';
import { DeliveryAddress } from '../types';

export function Delivery() {
  const { items, restaurant, deliveryAddress, setDeliveryAddress, goToPayment, goToOrderSummary } = useCart();
  const [formData, setFormData] = useState<DeliveryAddress>({
    buildingNumber: deliveryAddress?.buildingNumber || '',
    streetName: deliveryAddress?.streetName || '',
    apartmentUnit: deliveryAddress?.apartmentUnit || '',
    city: deliveryAddress?.city || '',
    state: deliveryAddress?.state || '',
    zipCode: deliveryAddress?.zipCode || ''
  });

  const [errors, setErrors] = useState<Partial<DeliveryAddress>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<'success' | 'error' | null>(null);

  const handleInputChange = (field: keyof DeliveryAddress, value: string) => {
    let processedValue = value;
    
    if (field === 'buildingNumber') {
      // Allow alphanumeric characters for building numbers like "123A"
      processedValue = value.replace(/[^a-zA-Z0-9]/g, '');
    } else if (field === 'zipCode') {
      // Only allow digits, limit to 5 characters
      processedValue = value.replace(/\D/g, '').substring(0, 5);
    } else if (field === 'state') {
      // Only allow letters, limit to 2 characters for state abbreviation
      processedValue = value.replace(/[^a-zA-Z]/g, '').substring(0, 2).toUpperCase();
    }

    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<DeliveryAddress> = {};

    if (!formData.buildingNumber.trim()) {
      newErrors.buildingNumber = 'Building number is required';
    }

    if (!formData.streetName.trim()) {
      newErrors.streetName = 'Street name is required';
    } else if (formData.streetName.trim().length < 3) {
      newErrors.streetName = 'Street name must be at least 3 characters';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    } else if (formData.city.trim().length < 2) {
      newErrors.city = 'City name must be at least 2 characters';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    } else if (formData.state.trim().length !== 2) {
      newErrors.state = 'State must be 2 characters (e.g., NY, CA)';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (formData.zipCode.trim().length !== 5) {
      newErrors.zipCode = 'ZIP code must be exactly 5 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const simulateAddressValidation = () => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // Simulate validation - 95% success rate
        const success = Math.random() > 0.05;
        resolve(success);
      }, 1500);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      const isValid = await simulateAddressValidation();
      
      if (isValid) {
        setValidationResult('success');
        setDeliveryAddress(formData);
        
        // Wait a moment to show success message
        setTimeout(() => {
          goToPayment();
        }, 1500);
      } else {
        setValidationResult('error');
      }
    } catch (error) {
      setValidationResult('error');
    } finally {
      setIsValidating(false);
    }
  };

  // Calculate estimated delivery time
  const getEstimatedDeliveryTime = () => {
    const now = new Date();
    const deliveryTime = new Date(now.getTime() + (35 * 60000)); // Add 35 minutes
    return deliveryTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const fullAddress = [
    formData.buildingNumber,
    formData.streetName,
    formData.apartmentUnit && `Apt ${formData.apartmentUnit}`,
    formData.city && formData.state && `${formData.city}, ${formData.state}`,
    formData.zipCode
  ].filter(Boolean).join(' ');

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <MapPin className="h-8 w-8 text-orange-600" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl text-orange-600 mb-2">Delivery Address</h1>
              <p className="text-muted-foreground">
                Enter your delivery address to complete the order
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              Estimated delivery: {getEstimatedDeliveryTime()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Restaurant Info */}
      {restaurant && (
        <Card>
          <CardHeader>
            <CardTitle>Order From</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border bg-white flex-shrink-0">
                {restaurant.logo ? (
                  <img
                    src={restaurant.logo}
                    alt={`${restaurant.name} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {restaurant.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">{restaurant.name}</p>
                <p className="text-sm text-muted-foreground">
                  {restaurant.cuisine} • Delivery: {restaurant.deliveryTime}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Address Preview */}
      {fullAddress.trim() && (
        <Card>
          <CardHeader>
            <CardTitle>Address Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {fullAddress}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivery Address Form */}
      <Card>
        <CardHeader>
          <CardTitle>Enter Delivery Address</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Building Number */}
            <div className="space-y-2">
              <Label htmlFor="buildingNumber">Building Number *</Label>
              <Input
                id="buildingNumber"
                type="text"
                placeholder="123"
                value={formData.buildingNumber}
                onChange={(e) => handleInputChange('buildingNumber', e.target.value)}
                maxLength={10}
              />
              {errors.buildingNumber && (
                <p className="text-sm text-destructive">{errors.buildingNumber}</p>
              )}
            </div>

            {/* Street Name */}
            <div className="space-y-2">
              <Label htmlFor="streetName">Street Name *</Label>
              <Input
                id="streetName"
                type="text"
                placeholder="Main Street"
                value={formData.streetName}
                onChange={(e) => handleInputChange('streetName', e.target.value)}
              />
              {errors.streetName && (
                <p className="text-sm text-destructive">{errors.streetName}</p>
              )}
            </div>

            {/* Apartment/Unit Number */}
            <div className="space-y-2">
              <Label htmlFor="apartmentUnit">Apartment or Unit Number (Optional)</Label>
              <Input
                id="apartmentUnit"
                type="text"
                placeholder="4B"
                value={formData.apartmentUnit}
                onChange={(e) => handleInputChange('apartmentUnit', e.target.value)}
                maxLength={10}
              />
            </div>

            {/* City, State, ZIP */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="New York"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  type="text"
                  placeholder="NY"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  maxLength={2}
                />
                {errors.state && (
                  <p className="text-sm text-destructive">{errors.state}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  type="text"
                  placeholder="10001"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  maxLength={5}
                />
                {errors.zipCode && (
                  <p className="text-sm text-destructive">{errors.zipCode}</p>
                )}
              </div>
            </div>

            {/* Validation Results */}
            {validationResult === 'success' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Delivery address verified successfully! Completing your order...
                </AlertDescription>
              </Alert>
            )}

            {validationResult === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Address validation failed. Please check your address and try again.
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={isValidating || validationResult === 'success'}
              >
                {isValidating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Validating Address...
                  </>
                ) : validationResult === 'success' ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Address Verified
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-2" />
                    Complete Order
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={goToOrderSummary}
                disabled={isValidating}
                className="sm:w-auto"
              >
                Back to Bill
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>


    </div>
  );
}
