import { useState } from 'react';
import { CartItem, Restaurant, PaymentInfo } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/common/card';
import { Button } from '../../../components/common/button';
import { Input } from '../../../components/common/input';
import { Label } from '../../../components/common/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/common/select';
import { Textarea } from '../../../components/common/textarea';
import { Alert, AlertDescription } from '../../../components/common/alert';
import { CreditCard, Lock, AlertCircle, CheckCircle } from 'lucide-react';

interface PaymentProps {
  items: CartItem[];
  restaurant: Restaurant | null;
  paymentInfo: PaymentInfo | null;
  setPaymentInfo: (info: PaymentInfo) => void;
  onPlaceOrder: () => void;
  onBack: () => void;
}

export function Payment({ 
  items, 
  restaurant, 
  paymentInfo, 
  setPaymentInfo,
  onPlaceOrder,
  onBack
}: PaymentProps) {
  const [formData, setFormData] = useState<PaymentInfo>({
    cardType: paymentInfo?.cardType || '',
    cardNumber: paymentInfo?.cardNumber || '',
    cardholderName: paymentInfo?.cardholderName || '',
    billingAddress: paymentInfo?.billingAddress || '',
    expiryMonth: paymentInfo?.expiryMonth || '',
    expiryYear: paymentInfo?.expiryYear || '',
    securityCode: paymentInfo?.securityCode || ''
  });

  const [errors, setErrors] = useState<Partial<PaymentInfo>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<'success' | 'error' | null>(null);

  const validateCardNumber = (number: string) => {
    // Remove spaces and check if it's exactly 16 digits
    const cleanNumber = number.replace(/\s/g, '');
    return /^\d{16}$/.test(cleanNumber);
  };

  const validateSecurityCode = (code: string) => {
    // Must be exactly 3 digits
    return /^\d{3}$/.test(code);
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    // Limit to 16 digits
    const truncated = cleaned.substring(0, 16);
    // Add spaces every 4 digits
    return truncated.replace(/(.{4})/g, '$1 ').trim();
  };

  const handleInputChange = (field: keyof PaymentInfo, value: string) => {
    let processedValue = value;
    
    if (field === 'cardNumber') {
      processedValue = formatCardNumber(value);
    } else if (field === 'securityCode') {
      // Only allow 3 digits
      processedValue = value.replace(/\D/g, '').substring(0, 3);
    } else if (field === 'cardholderName') {
      // Only allow letters and spaces
      processedValue = value.replace(/[^a-zA-Z\s]/g, '');
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
    const newErrors: Partial<PaymentInfo> = {};

    if (!formData.cardType) {
      newErrors.cardType = 'Card type is required';
    }

    if (!formData.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = 'Card number must be exactly 16 digits';
    }

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    } else if (formData.cardholderName.trim().length < 2) {
      newErrors.cardholderName = 'Please enter both first and last name';
    }

    if (!formData.billingAddress.trim()) {
      newErrors.billingAddress = 'Billing address is required';
    }

    if (!formData.expiryMonth) {
      newErrors.expiryMonth = 'Expiry month is required';
    }

    if (!formData.expiryYear) {
      newErrors.expiryYear = 'Expiry year is required';
    }

    if (!formData.securityCode) {
      newErrors.securityCode = 'Security code is required';
    } else if (!validateSecurityCode(formData.securityCode)) {
      newErrors.securityCode = 'Security code must be exactly 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const simulatePaymentValidation = () => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // Simulate validation - 90% success rate
        const success = Math.random() > 0.1;
        resolve(success);
      }, 2000);
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
      const isValid = await simulatePaymentValidation();
      
      if (isValid) {
        setValidationResult('success');
        setPaymentInfo(formData);
        
        // Wait a moment to show success message
        setTimeout(() => {
          onPlaceOrder();
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

  // Calculate totals (simplified version)
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const serviceCharge = subtotal * 0.0825;
  const totalAmount = subtotal + serviceCharge;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl text-green-600 mb-2">Payment Information</h1>
              <p className="text-muted-foreground">
                Enter your credit card details to complete the order
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              Secure payment processing
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service charge (8.25%)</span>
              <span>${serviceCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total Amount</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Card Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Type */}
            <div className="space-y-2">
              <Label htmlFor="cardType">Card Type *</Label>
              <Select
                value={formData.cardType}
                onValueChange={(value) => handleInputChange('cardType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select card type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visa">VISA</SelectItem>
                  <SelectItem value="mastercard">MasterCard</SelectItem>
                  <SelectItem value="discover">Discover</SelectItem>
                  <SelectItem value="amex">American Express</SelectItem>
                </SelectContent>
              </Select>
              {errors.cardType && (
                <p className="text-sm text-destructive">{errors.cardType}</p>
              )}
            </div>

            {/* Card Number */}
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Credit Card Number *</Label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                maxLength={19} // 16 digits + 3 spaces
              />
              {errors.cardNumber && (
                <p className="text-sm text-destructive">{errors.cardNumber}</p>
              )}
            </div>

            {/* Cardholder Name */}
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name *</Label>
              <Input
                id="cardholderName"
                type="text"
                placeholder="John Doe"
                value={formData.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
              />
              {errors.cardholderName && (
                <p className="text-sm text-destructive">{errors.cardholderName}</p>
              )}
            </div>

            {/* Billing Address */}
            <div className="space-y-2">
              <Label htmlFor="billingAddress">Billing Address *</Label>
              <Textarea
                id="billingAddress"
                placeholder="123 Main Street, Apt 4B, New York, NY 10001"
                value={formData.billingAddress}
                onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                rows={3}
              />
              {errors.billingAddress && (
                <p className="text-sm text-destructive">{errors.billingAddress}</p>
              )}
            </div>

            {/* Expiry Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryMonth">Expiry Month *</Label>
                <Select
                  value={formData.expiryMonth}
                  onValueChange={(value) => handleInputChange('expiryMonth', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.expiryMonth && (
                  <p className="text-sm text-destructive">{errors.expiryMonth}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryYear">Expiry Year *</Label>
                <Select
                  value={formData.expiryYear}
                  onValueChange={(value) => handleInputChange('expiryYear', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.expiryYear && (
                  <p className="text-sm text-destructive">{errors.expiryYear}</p>
                )}
              </div>
            </div>

            {/* Security Code */}
            <div className="space-y-2">
              <Label htmlFor="securityCode">Security Code (CVV) *</Label>
              <Input
                id="securityCode"
                type="text"
                placeholder="123"
                value={formData.securityCode}
                onChange={(e) => handleInputChange('securityCode', e.target.value)}
                maxLength={3}
                className="w-24"
              />
              {errors.securityCode && (
                <p className="text-sm text-destructive">{errors.securityCode}</p>
              )}
            </div>

            {/* Validation Results */}
            {validationResult === 'success' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Payment method verified successfully! Proceeding to delivery address...
                </AlertDescription>
              </Alert>
            )}

            {validationResult === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Payment validation failed. Please check your card details and try again.
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
                    Validating Payment...
                  </>
                ) : validationResult === 'success' ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Payment Verified
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Verify Payment
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={onBack}
                disabled={isValidating}
                className="sm:w-auto"
              >
                Back to Bill
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <div className="text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Lock className="h-4 w-4" />
          <span>Your payment information is encrypted and secure</span>
        </div>
        <p>We use industry-standard security measures to protect your data</p>
      </div>
    </div>
  );
}