import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { DocumentUpload, DocumentFile } from './DocumentUpload';
import { FrontDashLogo } from './FrontDashLogo';
import { BackgroundPattern } from './BackgroundPattern';
import { toast } from 'sonner@2.0.3';
import { Building2, Clock, CheckCircle, ArrowLeft, FileText } from 'lucide-react';

export function RegistrationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  
  const [applicationData, setApplicationData] = useState({
    // Basic Information
    restaurantName: '',
    businessType: '',
    cuisineType: '',
    description: '',
    
    // Contact Information
    ownerName: '',
    email: '',
    phone: '',
    
    // Business Details
    businessAddress: '',
    city: '',
    state: '',
    zipCode: '',
    businessLicense: '',
    taxId: '',
    
    // Operating Information
    yearsInBusiness: '',
    averageOrderValue: '',
    expectedOrderVolume: '',
    
    // Legal & Compliance
    agreeToTerms: false,
    agreeToCommission: false,
    confirmAccuracy: false
  });

  // Generate username based on owner name
  const generateUsername = (ownerName: string) => {
    if (!ownerName) return '';
    const names = ownerName.trim().toLowerCase().split(' ');
    const lastName = names[names.length - 1];
    if (lastName) {
      return `${lastName}${Math.floor(Math.random() * 90) + 10}`;
    }
    return '';
  };

  const generatedUsername = generateUsername(applicationData.ownerName);

  const cuisineTypes = [
    'American', 'Italian', 'Chinese', 'Mexican', 'Japanese', 'Indian', 
    'Thai', 'Mediterranean', 'French', 'Greek', 'Korean', 'Vietnamese',
    'Pizza', 'Burgers', 'Seafood', 'Vegetarian/Vegan', 'Fast Food', 'Other'
  ];

  const businessTypes = [
    'Restaurant', 'Fast Casual', 'Quick Service', 'Food Truck', 
    'Bakery', 'Cafe', 'Catering', 'Ghost Kitchen', 'Other'
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setApplicationData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const requiredFields = [
      'restaurantName', 'businessType', 'cuisineType', 'description',
      'ownerName', 'email', 'phone',
      'businessAddress', 'city', 'state', 'zipCode',
      'yearsInBusiness', 'averageOrderValue', 'expectedOrderVolume'
    ];
    
    const missingFields = requiredFields.filter(field => !applicationData[field as keyof typeof applicationData]);
    const agreementsValid = applicationData.agreeToTerms && applicationData.agreeToCommission && applicationData.confirmAccuracy;
    
    // Check required documents
    const requiredDocuments = ['business-license', 'health-permit'];
    const missingDocuments = requiredDocuments.filter(category => 
      !documents.some(doc => doc.category === category && doc.status === 'uploaded')
    );
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    // Validate phone number (must be 10 digits)
    const phoneDigits = applicationData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      toast.error('Phone number must be exactly 10 digits long');
      return false;
    }

    // Validate email format (XXXX@XXX.XX)
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (!emailRegex.test(applicationData.email)) {
      toast.error('Email must have the format XXXX@XXX.XX');
      return false;
    }

    // Validate address format (should include building number, street name, city, and state)
    const addressParts = applicationData.businessAddress.trim().split(/\s+/);
    if (addressParts.length < 3) {
      toast.error('Address must include building number, street name (minimum 3 parts)');
      return false;
    }
    
    // Check if first part contains a number (building number)
    if (!/\d/.test(addressParts[0])) {
      toast.error('Address must start with a building number');
      return false;
    }

    if (!applicationData.city.trim()) {
      toast.error('City is required for a valid address');
      return false;
    }

    if (!applicationData.state.trim()) {
      toast.error('State is required for a valid address');
      return false;
    }
    
    if (missingDocuments.length > 0) {
      const docNames = missingDocuments.map(doc => 
        doc === 'business-license' ? 'Business License' : 
        doc === 'health-permit' ? 'Health Permit' : doc
      );
      toast.error(`Please upload required documents: ${docNames.join(', ')}`);
      return false;
    }
    
    if (!agreementsValid) {
      toast.error('Please accept all terms and agreements');
      return false;
    }
    
    return true;
  };

  const submitApplication = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API submission
    setTimeout(() => {
      setApplicationSubmitted(true);
      setIsSubmitting(false);
      toast.success('Application submitted successfully!');
    }, 2000);
  };

  if (applicationSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-primary">Application Submitted!</CardTitle>
            <CardDescription>Thank you for your interest in joining FrontDash</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Your application is now under review. Our team will evaluate your submission and contact you within 3-5 business days.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <h4>What happens next?</h4>
              <ul className="text-sm text-muted-foreground space-y-1 text-left">
                <li>• Our team will review your application</li>
                <li>• We may contact you for additional information</li>
                <li>• Once approved, you'll receive login credentials via email</li>
                <li>• You can then access your restaurant dashboard</li>
              </ul>
            </div>
            
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Application Reference: FD-{Date.now().toString().slice(-6)}
              </p>
              <Link to="/login">
                <Button className="w-full">
                  Go to Login Page
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-background via-background to-primary/5 px-4 py-8">
      {/* Background Pattern */}
      <BackgroundPattern variant="dots" opacity={0.06} />
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Login
          </Link>
          <FrontDashLogo size="md" />
        </div>

        <Card className="backdrop-blur-sm bg-card/90 border-border/50 shadow-xl">
          <CardHeader>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-primary text-2xl">Join FrontDash Partner Network</CardTitle>
                <CardDescription className="text-base">Submit your restaurant application to get started with our delivery platform</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Basic Restaurant Information */}
            <div className="space-y-4">
              <div>
                <h3>Basic Restaurant Information</h3>
                <p className="text-sm text-muted-foreground">Tell us about your restaurant</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="restaurantName">Restaurant Name *</Label>
                  <Input
                    id="restaurantName"
                    placeholder="Your Restaurant Name"
                    value={applicationData.restaurantName}
                    onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select value={applicationData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cuisineType">Cuisine Type *</Label>
                <Select value={applicationData.cuisineType} onValueChange={(value) => handleInputChange('cuisineType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cuisine type" />
                  </SelectTrigger>
                  <SelectContent>
                    {cuisineTypes.map(cuisine => (
                      <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Restaurant Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your restaurant, specialties, and what makes you unique..."
                  rows={4}
                  value={applicationData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-4">
              <div>
                <h3>Contact Information</h3>
                <p className="text-sm text-muted-foreground">Primary contact details for your business</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner/Manager Name *</Label>
                  <Input
                    id="ownerName"
                    placeholder="Full name"
                    value={applicationData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Business Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="restaurant@example.com"
                    value={applicationData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: XXXX@XXX.XX (e.g., restaurant@example.com)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Business Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={applicationData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be exactly 10 digits (formatting allowed)
                  </p>
                </div>
              </div>

              {generatedUsername && (
                <Alert>
                  <AlertDescription>
                    <strong>Your login username will be:</strong> <code className="bg-primary/10 px-2 py-1 rounded text-primary">{generatedUsername}</code>
                    <br />
                    <span className="text-sm text-muted-foreground">
                      This username will be provided in your approval email for accessing the partner dashboard.
                    </span>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Separator />

            {/* Business Address & Legal */}
            <div className="space-y-4">
              <div>
                <h3>Business Address & Legal Information</h3>
                <p className="text-sm text-muted-foreground">Where your restaurant is located</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address *</Label>
                  <Input
                    id="businessAddress"
                    placeholder="123 Main Street"
                    value={applicationData.businessAddress}
                    onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Must include building number and street name (e.g., 123 Main Street)
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={applicationData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="State"
                      value={applicationData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      placeholder="ZIP"
                      value={applicationData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessLicense">Business License # (Optional)</Label>
                    <Input
                      id="businessLicense"
                      placeholder="License number"
                      value={applicationData.businessLicense}
                      onChange={(e) => handleInputChange('businessLicense', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID/EIN (Optional)</Label>
                    <Input
                      id="taxId"
                      placeholder="Tax identification number"
                      value={applicationData.taxId}
                      onChange={(e) => handleInputChange('taxId', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Business Operations */}
            <div className="space-y-4">
              <div>
                <h3>Business Operations</h3>
                <p className="text-sm text-muted-foreground">Help us understand your business scale</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yearsInBusiness">Years in Business *</Label>
                  <Select value={applicationData.yearsInBusiness} onValueChange={(value) => handleInputChange('yearsInBusiness', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-than-1">Less than 1 year</SelectItem>
                      <SelectItem value="1-2">1-2 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="6-10">6-10 years</SelectItem>
                      <SelectItem value="more-than-10">More than 10 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="averageOrderValue">Average Order Value *</Label>
                  <Select value={applicationData.averageOrderValue} onValueChange={(value) => handleInputChange('averageOrderValue', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-15">Under $15</SelectItem>
                      <SelectItem value="15-25">$15 - $25</SelectItem>
                      <SelectItem value="25-40">$25 - $40</SelectItem>
                      <SelectItem value="40-60">$40 - $60</SelectItem>
                      <SelectItem value="over-60">Over $60</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expectedOrderVolume">Expected Daily Orders *</Label>
                  <Select value={applicationData.expectedOrderVolume} onValueChange={(value) => handleInputChange('expectedOrderVolume', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select volume" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-20">Under 20 orders</SelectItem>
                      <SelectItem value="20-50">20-50 orders</SelectItem>
                      <SelectItem value="50-100">50-100 orders</SelectItem>
                      <SelectItem value="100-200">100-200 orders</SelectItem>
                      <SelectItem value="over-200">Over 200 orders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Required Documents */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3>Documents</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload your essential business documents. Only Business License and Health Permit are required.
                </p>
              </div>
              
              <Alert>
                <AlertDescription>
                  All documents must be clear, legible, and current. Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB each)
                </AlertDescription>
              </Alert>

              {/* Required Documents */}
              <div className="space-y-2">
                <h4 className="text-base font-medium text-destructive">Required Documents</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DocumentUpload
                    category="business-license"
                    label="Business License"
                    description="Current business license or registration certificate"
                    required={true}
                    files={documents}
                    onFilesChange={setDocuments}
                    multiple={false}
                  />
                  
                  <DocumentUpload
                    category="health-permit"
                    label="Health Department Permit"
                    description="Valid health permit or food service license"
                    required={true}
                    files={documents}
                    onFilesChange={setDocuments}
                    multiple={false}
                  />
                </div>
              </div>

              {/* Optional Documents */}
              <div className="space-y-2">
                <h4 className="text-base font-medium text-muted-foreground">Optional Documents (can be uploaded later)</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DocumentUpload
                    category="liability-insurance"
                    label="Liability Insurance"
                    description="General liability insurance certificate"
                    required={false}
                    files={documents}
                    onFilesChange={setDocuments}
                    multiple={false}
                  />
                  
                  <DocumentUpload
                    category="menu"
                    label="Current Menu"
                    description="Latest menu with prices"
                    required={false}
                    files={documents}
                    onFilesChange={setDocuments}
                    multiple={true}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Terms & Agreements */}
            <div className="space-y-4">
              <div>
                <h3>Terms & Agreements</h3>
                <p className="text-sm text-muted-foreground">Please review and accept the following terms</p>
              </div>
              
              <Alert>
                <AlertDescription>
                  By submitting this application, you acknowledge that you have read and agree to all terms below.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeToTerms"
                    checked={applicationData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="agreeToTerms" className="leading-normal">
                      I agree to the FrontDash Partner Terms & Conditions *
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      This includes service agreements, liability terms, and platform policies.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeToCommission"
                    checked={applicationData.agreeToCommission}
                    onCheckedChange={(checked) => handleInputChange('agreeToCommission', checked)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="agreeToCommission" className="leading-normal">
                      I understand and agree to the commission structure *
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Standard commission rates apply to all orders processed through FrontDash.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="confirmAccuracy"
                    checked={applicationData.confirmAccuracy}
                    onCheckedChange={(checked) => handleInputChange('confirmAccuracy', checked)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="confirmAccuracy" className="leading-normal">
                      I confirm that all information provided is accurate *
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Providing false information may result in application rejection.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Button
                  onClick={submitApplication}
                  disabled={isSubmitting}
                  className="sm:w-auto w-full"
                  size="lg"
                >
                  {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-4 text-center">
                By submitting this application, you agree to our processing of your information for partnership evaluation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}