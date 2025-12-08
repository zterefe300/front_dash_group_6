import { useEffect, useMemo, useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DocumentUpload, DocumentFile } from './DocumentUpload';
import { FrontDashLogo } from './FrontDashLogo';
import { BackgroundPattern } from './BackgroundPattern';
import type { RegistrationPayload } from '@/api/restaurant';
import { toast } from 'sonner';
import { Building2, Clock, CheckCircle, ArrowLeft, FileText, Plus, Trash2, FolderPlus } from 'lucide-react';
import { useAppStore } from '@/store';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const BUSINESS_TYPES = [
  'Restaurant',
  'Fast Casual',
  'Quick Service',
  'Food Truck',
  'Bakery',
  'Cafe',
  'Catering',
  'Ghost Kitchen',
  'Other',
];

const DEFAULT_MENU_CATEGORIES = [
  'Appetizers',
  'Salads',
  'Soups',
  'Main Course',
  'Pizza',
  'Pasta',
  'Burgers',
  'Seafood',
  'Desserts',
  'Beverages',
  'Other',
];

const createInitialApplicationData = () => ({
  restaurantName: '',
  businessType: '',
  description: '',
  ownerName: '',
  email: '',
  phone: '',
  building: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  agreeToTerms: true,
  agreeToCommission: true,
  confirmAccuracy: true,
});

const createInitialOperatingHours = () =>
  DAYS_OF_WEEK.map((day) => ({
    day,
    isOpen: true,
    openTime: '11:00',
    closeTime: '20:00',
  }));

type MenuItemState = {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
};

interface MenuSectionProps {
  menuItems: MenuItemState[];
  onAddCategory: () => void;
  onAddItem: () => void;
  onEditItem: (item: MenuItemState) => void;
  onRemoveItem: (id: string) => void;
}

const MenuSection = memo(function MenuSection({
  menuItems,
  onAddCategory,
  onAddItem,
  onEditItem,
  onRemoveItem,
}: MenuSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Menu Items
          </CardTitle>
          <CardDescription>
            Add signature dishes and pricing so we can preconfigure your dashboard.
          </CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onAddCategory}
            className="flex items-center gap-2"
          >
            <FolderPlus className="h-4 w-4" />
            Add Category
          </Button>
          <Button type="button" onClick={onAddItem} className="flex items-center gap-2 sm:w-auto">
            <Plus className="h-4 w-4" />
            Add Menu Item
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {menuItems.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No menu items yet. Add your first dish to showcase your restaurant.
          </div>
        ) : (
          menuItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-lg border border-border bg-card/50 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-base font-semibold">{item.name}</h4>
                  {item.category ? <Badge variant="secondary">{item.category}</Badge> : null}
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.description ? item.description : 'No description provided.'}
                </p>
              </div>
              <div className="flex flex-col items-start gap-2 md:items-end">
                <span className="text-base font-semibold">${Number(item.price).toFixed(2)}</span>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => onEditItem(item)}>
                    Edit
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => onRemoveItem(item.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
});

interface HoursSectionProps {
  operatingHours: {
    day: string;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
  }[];
  timeOptions: string[];
  onChangeHour: (day: string, field: 'openTime' | 'closeTime', value: string) => void;
  onToggleDay: (day: string, isOpen: boolean) => void;
}

const HoursSection = memo(function HoursSection({
  operatingHours,
  timeOptions,
  onChangeHour,
  onToggleDay,
}: HoursSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Operating Hours
        </CardTitle>
        <CardDescription>Configure the weekly schedule customers will see on launch day.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {operatingHours.map((entry) => (
            <div
              key={entry.day}
              className="grid grid-cols-1 gap-4 rounded-lg border border-border bg-card/50 p-4 md:grid-cols-[160px,repeat(2,minmax(0,1fr)),auto]"
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{entry.day}</span>
                  <Badge variant={entry.isOpen ? 'secondary' : 'outline'}>
                    {entry.isOpen ? 'Open' : 'Closed'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {entry.isOpen ? 'Customers can place orders on this day.' : 'Closed all day.'}
                </p>
              </div>
              <div className="space-y-2" style={{ width: '88px' }}>
                <Label htmlFor={`${entry.day}-open`}>Opens</Label>
                <Select
                  value={entry.openTime}
                  onValueChange={(value) => onChangeHour(entry.day, 'openTime', value)}
                  disabled={!entry.isOpen}
                >
                  <SelectTrigger id={`${entry.day}-open`}>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={`${entry.day}-open-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2" style={{ width: '88px' }}>
                <Label htmlFor={`${entry.day}-close`}>Closes</Label>
                <Select
                  value={entry.closeTime}
                  onValueChange={(value) => onChangeHour(entry.day, 'closeTime', value)}
                  disabled={!entry.isOpen}
                >
                  <SelectTrigger id={`${entry.day}-close`}>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={`${entry.day}-close-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2" style={{ width: '88px' }}>
                <Switch
                  id={`${entry.day}-open-toggle`}
                  checked={entry.isOpen}
                  onCheckedChange={(checked) => onToggleDay(entry.day, checked)}
                />
                <Label htmlFor={`${entry.day}-open-toggle`} className="text-sm text-muted-foreground">
                  {entry.isOpen ? 'Open' : 'Closed'}
                </Label>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

export function RegistrationPage() {
  const submitRegistration = useAppStore((state) => state.submitRegistration);
  const registrationSubmitting = useAppStore((state) => state.registrationSubmitting);
  const registrationResult = useAppStore((state) => state.registrationResult);
  const registrationError = useAppStore((state) => state.registrationError);
  const clearRegistrationResult = useAppStore((state) => state.clearRegistrationResult);

  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [applicationData, setApplicationData] = useState(() => createInitialApplicationData());
  const [menuItems, setMenuItems] = useState<MenuItemState[]>([]);
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [isEditingMenuItem, setIsEditingMenuItem] = useState(false);
  const [menuForm, setMenuForm] = useState({
    id: '',
    name: '',
    category: '',
    price: '',
    description: '',
  });
  const [operatingHours, setOperatingHours] = useState(() => createInitialOperatingHours());

  const timeOptions = useMemo(() => {
    const startHour = 6; // 06:00
    const endHour = 26; // 26:00 (wraps to 02:00 next day)
    const options: string[] = [];

    for (let h = startHour; h < endHour; h++) {
      const hour = (h % 24).toString().padStart(2, '0');
      options.push(`${hour}:00`);
      options.push(`${hour}:30`);
    }

    return options;
  }, []);

  useEffect(() => {
    if (registrationError) {
      toast.error(registrationError);
    }
  }, [registrationError]);


  const resetForm = () => {
    setDocuments([]);
    setMenuItems([]);
    setIsMenuDialogOpen(false);
    setIsEditingMenuItem(false);
    setMenuForm({
      id: '',
      name: '',
      category: '',
      price: '',
      description: '',
    });
    setOperatingHours(createInitialOperatingHours());
    setApplicationData(createInitialApplicationData());
  };

  const handleStartNewApplication = () => {
    clearRegistrationResult();
    resetForm();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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

  const [menuCategories, setMenuCategories] = useState<string[]>(DEFAULT_MENU_CATEGORIES);

  const handleInputChange = useCallback((field: string, value: string | boolean) => {
    setApplicationData((prev) => ({ ...prev, [field]: value }));
  }, [setApplicationData]);

  const openAddMenuDialog = useCallback(() => {
    setMenuForm({
      id: '',
      name: '',
      category: '',
      price: '',
      description: '',
    });
    setIsEditingMenuItem(false);
    setIsMenuDialogOpen(true);
  }, [setMenuForm, setIsEditingMenuItem, setIsMenuDialogOpen]);

  const openEditMenuDialog = useCallback((item: typeof menuItems[number]) => {
    setMenuForm({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
    });
    setIsEditingMenuItem(true);
    setIsMenuDialogOpen(true);
  }, [setMenuForm, setIsEditingMenuItem, setIsMenuDialogOpen]);

  const handleAddMenuCategory = useCallback(() => {
    const rawName = prompt('Enter a new menu category name:');
    if (rawName === null) {
      return;
    }

    const formatted = rawName.trim();
    if (!formatted) {
      toast.error('Category name cannot be empty');
      return;
    }

    const exists = menuCategories.some(
      (category) => category.toLowerCase() === formatted.toLowerCase()
    );
    if (exists) {
      toast.info('Category already exists');
      return;
    }

    setMenuCategories((prev) => [formatted, ...prev]);
    if (isMenuDialogOpen) {
      setMenuForm((prev) => ({
        ...prev,
        category: formatted,
      }));
    }
    toast.success(`Added category "${formatted}"`);
  }, [isMenuDialogOpen, menuCategories, setMenuCategories, setMenuForm]);

  const handleMenuFormChange = <
    Field extends 'name' | 'category' | 'price' | 'description'
  >(
    field: Field,
    value: string
  ) => {
    setMenuForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMenuDialogSubmit = () => {
    if (!menuForm.name.trim() || !menuForm.price.trim()) {
      toast.error('Menu item must include a name and price');
      return;
    }

    const priceValue = parseFloat(menuForm.price);
    if (Number.isNaN(priceValue) || priceValue <= 0) {
      toast.error('Price must be a positive number');
      return;
    }

    if (isEditingMenuItem) {
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === menuForm.id
            ? {
                ...item,
                name: menuForm.name.trim(),
                category: menuForm.category.trim(),
                price: priceValue.toFixed(2),
                description: menuForm.description.trim(),
              }
            : item
        )
      );
    } else {
      setMenuItems((prev) => [
        ...prev,
        {
          id: `menu-${Date.now()}`,
          name: menuForm.name.trim(),
          category: menuForm.category.trim(),
          price: priceValue.toFixed(2),
          description: menuForm.description.trim(),
        },
      ]);
    }

    setIsMenuDialogOpen(false);
  };

  const removeMenuItem = useCallback((id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  }, [setMenuItems]);

  const updateOperatingHour = useCallback(
    (day: string, field: 'openTime' | 'closeTime', value: string) => {
      setOperatingHours((prev) =>
        prev.map((entry) =>
          entry.day === day
            ? {
                ...entry,
                [field]: value,
              }
            : entry
        )
      );
    },
    [setOperatingHours]
  );

  const setDayOpen = useCallback((day: string, isOpen: boolean) => {
    setOperatingHours((prev) =>
      prev.map((entry) =>
        entry.day === day
          ? {
              ...entry,
              isOpen,
              ...(isOpen
                ? {
                    openTime: entry.openTime || '09:00',
                    closeTime: entry.closeTime || '21:00',
                  }
                : { openTime: '', closeTime: '' }),
            }
          : entry
      )
    );
  }, [setOperatingHours]);

  const applyOperatingHoursTemplate = (sourceDay: string) => {
    const template = operatingHours.find((entry) => entry.day === sourceDay);
    if (!template) {
      return;
    }

    setOperatingHours((prev) =>
      prev.map((entry) =>
        entry.day === sourceDay
          ? entry
          : {
              ...entry,
              isOpen: template.isOpen,
              openTime: template.isOpen ? template.openTime : '',
              closeTime: template.isOpen ? template.closeTime : '',
            }
      )
    );
    toast.success(`Applied ${sourceDay}'s hours to all days`);
  };

  const validateForm = () => {
    const requiredFields = [
      'restaurantName', 'businessType', 'description',
      'ownerName', 'email', 'phone',
      'building', 'street', 'city', 'state', 'zipCode',
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

    if (!/\d/.test(applicationData.building)) {
      toast.error('Building must include a number');
      return false;
    }

    if (!applicationData.street.trim()) {
      toast.error('Street is required for a valid address');
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

    if (menuItems.length === 0) {
      toast.error('Please add at least one menu item with a name and price');
      return false;
    }

    const atLeastOneOpenDay = operatingHours.some((entry) => entry.isOpen);
    if (!atLeastOneOpenDay) {
      toast.error('Please select at least one operating day');
      return false;
    }

    const missingTimes = operatingHours.some(
      (entry) => entry.isOpen && (!entry.openTime || !entry.closeTime)
    );

    if (missingTimes) {
      toast.error('Please provide opening and closing times for each open day');
      return false;
    }

    const invalidHourOrder = operatingHours.some(
      (entry) => entry.isOpen && entry.openTime >= entry.closeTime
    );

    if (invalidHourOrder) {
      toast.error('Closing time must be later than opening time for each day');
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

    if (registrationResult) {
      clearRegistrationResult();
    }

    const cleanedMenuItems = menuItems
      .filter(
        (item) =>
          item.name.trim() ||
          item.category.trim() ||
          item.price.trim() ||
          item.description.trim()
      )
      .map((item) => ({
        name: item.name.trim(),
        category: item.category.trim(),
        price: parseFloat(item.price),
        description: item.description.trim(),
      }));

    const supportingFiles = documents
      .filter((doc) => doc.status === 'uploaded' && doc.url)
      .map((doc) => doc.url as string);

    const submissionPayload: RegistrationPayload = {
      restaurantName: applicationData.restaurantName.trim(),
      businessType: applicationData.businessType,
      description: applicationData.description.trim(),
      ownerName: applicationData.ownerName.trim(),
      email: applicationData.email.trim(),
      phone: applicationData.phone.trim(),
      building: applicationData.building.trim(),
      street: applicationData.street.trim(),
      city: applicationData.city.trim(),
      state: applicationData.state.trim(),
      zipCode: applicationData.zipCode.trim(),
      agreeToTerms: applicationData.agreeToTerms,
      agreeToCommission: applicationData.agreeToCommission,
      confirmAccuracy: applicationData.confirmAccuracy,
      menuItems: cleanedMenuItems,
      operatingHours,
      ...(supportingFiles.length ? { supportingFiles } : {}),
    };

    try {
      await submitRegistration(submissionPayload);
      toast.success('Application submitted successfully!');
    } catch {
      // Error feedback handled via registrationError state
    }
  };

  if (registrationResult) {
    const submittedAt = registrationResult.submittedAt
      ? new Date(registrationResult.submittedAt).toLocaleString()
      : null;

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
                <li>- Our team will review your application</li>
                <li>- We may contact you for additional information</li>
                <li>- Once approved, you'll receive login credentials via email</li>
                <li>- You can then access your restaurant dashboard</li>
              </ul>
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              <p><span className="font-medium text-foreground">Application Reference:</span> {registrationResult.id}</p>
              <p><span className="font-medium text-foreground">Current Status:</span> {registrationResult.status}</p>
              {submittedAt && (
                <p><span className="font-medium text-foreground">Submitted At:</span> {submittedAt}</p>
              )}
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <Link to="/restaurant/login">
                <Button
                  className="w-full"
                  onClick={() => {
                    clearRegistrationResult();
                    resetForm();
                  }}
                >
                  Go to Login Page
                </Button>
              </Link>
              <Button variant="outline" className="w-full" onClick={handleStartNewApplication}>
                Submit another application
              </Button>
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
          <Link to="/restaurant/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
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
          
          <CardContent className="space-y-10">
            {/* Basic Restaurant Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">Basic Restaurant Information</h3>
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
                      {BUSINESS_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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

            <Separator className="my-12 bg-primary/50 h-[3px] rounded-full" />

            {/* Contact Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">Contact Information</h3>
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

            <Separator className="my-12 bg-primary/50 h-[3px] rounded-full" />

            {/* Business Address */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">Business Address</h3>
                <p className="text-sm text-muted-foreground">Where your restaurant is located</p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="building">Building *</Label>
                    <Input
                      id="building"
                      placeholder="123 or Suite 500"
                      value={applicationData.building}
                      onChange={(e) => handleInputChange('building', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Include building or unit number for accurate delivery.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street">Street *</Label>
                    <Input
                      id="street"
                      placeholder="Main Street"
                      value={applicationData.street}
                      onChange={(e) => handleInputChange('street', e.target.value)}
                    />
                  </div>
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
              </div>
            </div>

            <Separator className="my-12 bg-primary/50 h-[3px] rounded-full" />

            {/* Required Documents */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Documents</h3>
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

            </div>

            <Separator className="my-12 bg-primary/50 h-[3px] rounded-full" />

            {/* Menu Planning */}
            <div className="space-y-6">
              <MenuSection
                menuItems={menuItems}
                onAddCategory={handleAddMenuCategory}
                onAddItem={openAddMenuDialog}
                onEditItem={openEditMenuDialog}
                onRemoveItem={removeMenuItem}
              />
            </div>

            <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>
                    {isEditingMenuItem ? 'Edit Menu Item' : 'Add Menu Item'}
                  </DialogTitle>
                  <DialogDescription>
                    Provide details for a menu item. These can be updated later from the dashboard.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="menu-name">Item Name *</Label>
                    <Input
                      id="menu-name"
                      placeholder="Margherita Pizza"
                      value={menuForm.name}
                      onChange={(e) => handleMenuFormChange('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="menu-category">Category</Label>
                    <Select
                      value={menuForm.category}
                      onValueChange={(value) => handleMenuFormChange('category', value)}
                    >
                      <SelectTrigger id="menu-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {menuCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="menu-price">Price (USD) *</Label>
                    <Input
                      id="menu-price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="16.50"
                      value={menuForm.price}
                      onChange={(e) => handleMenuFormChange('price', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="menu-description">Description</Label>
                    <Textarea
                      id="menu-description"
                      placeholder="Fresh tomato sauce, mozzarella, basil..."
                      value={menuForm.description}
                      onChange={(e) => handleMenuFormChange('description', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter className="sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsMenuDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleMenuDialogSubmit}>
                    {isEditingMenuItem ? 'Save Changes' : 'Add Item'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Separator className="my-12 bg-primary/50 h-[3px] rounded-full" />

            {/* Operating Hours */}
            <div className="space-y-6">
              <HoursSection
                operatingHours={operatingHours}
                timeOptions={timeOptions}
                onChangeHour={updateOperatingHour}
                onToggleDay={setDayOpen}
              />
            </div>

            <Separator className="my-12 bg-primary/50 h-[3px] rounded-full" />

            {/* Terms & Agreements */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">Terms & Agreements</h3>
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
                  disabled={registrationSubmitting}
                  className="sm:w-auto w-full"
                  size="lg"
                >
                  {registrationSubmitting ? 'Submitting Application...' : 'Submit Application'}
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
