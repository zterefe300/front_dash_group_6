import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ImageIcon, Trash2, Upload } from 'lucide-react';

import { useAppStore } from '@/store';
import type { RestaurantSocialLinks, RestaurantSummary } from '@/api/restaurant';

type ProfileFormState = {
  name: string;
  description: string;
  cuisineType: string;
  businessType: string;
  priceRange: string;
  website: string;
  socialLinks: RestaurantSocialLinks;
  specialties: string[];
  certifications: string[];
  imageUrls: string[];
};

const defaultSocialLinks = (): RestaurantSocialLinks => ({
  facebook: '',
  instagram: '',
  twitter: '',
  tiktok: '',
});

const mapSummaryToForm = (restaurant?: RestaurantSummary): ProfileFormState => ({
  name: restaurant?.name ?? '',
  description: restaurant?.description ?? '',
  cuisineType: restaurant?.cuisineType ?? '',
  businessType: restaurant?.businessType ?? '',
  priceRange: restaurant?.priceRange ?? '',
  website: restaurant?.website ?? '',
  socialLinks: {
    ...defaultSocialLinks(),
    ...restaurant?.socialLinks,
  },
  specialties: restaurant?.specialties ?? [],
  certifications: restaurant?.certifications ?? [],
  imageUrls: restaurant?.imageUrls ?? [],
});

const CUISINE_OPTIONS = [
  'Italian',
  'Chinese',
  'Mexican',
  'Indian',
  'American',
  'Japanese',
  'Mediterranean',
  'Thai',
];

const PRICE_RANGE_OPTIONS = [
  { value: '$', label: '$ - Budget friendly' },
  { value: '$$', label: '$$ - Moderate' },
  { value: '$$$', label: '$$$ - Expensive' },
  { value: '$$$$', label: '$$$$ - Very expensive' },
];

export function RestaurantProfile() {
  const restaurant = useAppStore((state) => state.restaurant);
  const updateRestaurantProfile = useAppStore((state) => state.updateRestaurantProfile);
  const uploadSupportFile = useAppStore((state) => state.uploadSupportFile);
  const isProfileSaving = useAppStore((state) => state.isProfileSaving);
  const isFileUploading = useAppStore((state) => state.isFileUploading);
  const profileError = useAppStore((state) => state.profileError);

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileFormState>(() => mapSummaryToForm(restaurant ?? undefined));
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setProfile(mapSummaryToForm(restaurant ?? undefined));
    }
  }, [restaurant, isEditing]);

  useEffect(() => {
    if (profileError) {
      toast.error(profileError);
    }
  }, [profileError]);

  const isUploadingImage = useMemo(() => isFileUploading || isProfileSaving, [isFileUploading, isProfileSaving]);

  const specialtiesDisplay = profile.specialties;
  const certificationsDisplay = profile.certifications;

  const handleFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    event.target.value = '';
    await handleSelectImage(file);
  };

  const handleSelectImage = async (file: File) => {
    if (!isEditing) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'restaurant-gallery');

      const uploaded = await uploadSupportFile(formData);
      if (!uploaded.url) {
        toast.error('File uploaded but no URL was returned.');
        return;
      }

      const newUrl = uploaded.url;
      setProfile((prev) => {
        const existing = prev.imageUrls ?? [];
        if (newUrl && existing.includes(newUrl)) {
          return prev;
        }
        return newUrl
          ? {
              ...prev,
              imageUrls: [...existing, newUrl],
            }
          : prev;
      });
      toast.success('Image uploaded. Save changes to publish.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload image';
      toast.error(message);
    }
  };

  const handleSave = async () => {
    try {
      await updateRestaurantProfile({
        name: profile.name,
        description: profile.description,
        businessType: profile.businessType,
        cuisineType: profile.cuisineType,
        priceRange: profile.priceRange,
        website: profile.website,
        socialLinks: profile.socialLinks,
        specialties: profile.specialties,
        certifications: profile.certifications,
        imageUrls: profile.imageUrls,
      });
      setIsEditing(false);
      toast.success('Restaurant profile updated successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(message);
    }
  };

  const handleCancel = () => {
    setProfile(mapSummaryToForm(restaurant ?? undefined));
    setIsEditing(false);
  };

  const addSpecialty = () => {
    const specialty = prompt('Enter a specialty:');
    if (!specialty) return;
    setProfile((prev) => ({
      ...prev,
      specialties: [...prev.specialties, specialty],
    }));
  };

  const removeSpecialty = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveImage = (index: number) => {
    if (!isEditing) return;
    setProfile((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleUploadClick = () => {
    if (!isEditing) return;
    fileInputRef.current?.click();
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
            <Button variant="outline" onClick={handleCancel} disabled={isProfileSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isProfileSaving}>
              {isProfileSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Restaurant Images</CardTitle>
          <CardDescription>Upload photos of your restaurant, food, and ambiance to attract customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isEditing && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button type="button" onClick={handleUploadClick} disabled={isUploadingImage}>
                  <Upload className="mr-2 h-4 w-4" />
                  {isUploadingImage ? 'Uploading...' : 'Upload Image'}
                </Button>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 5MB. Upload images while editing, then save to publish updates.
                </p>
              </div>
            )}

            {profile.imageUrls.length === 0 ? (
              <div className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed border-border">
                <div className="flex flex-col items-center text-center text-sm text-muted-foreground">
                  <ImageIcon className="mb-2 h-10 w-10" />
                  <span>No images uploaded yet.</span>
                  {isEditing && <span>Click upload to add your first photo.</span>}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {profile.imageUrls.map((image, index) => (
                  <div key={`${image}-${index}`} className="relative rounded-lg border border-border">
                    <img src={image} alt={`Restaurant image ${index + 1}`} className="h-48 w-full object-cover" />
                    {isEditing && (
                      <button
                        type='button'
                        onClick={() => handleRemoveImage(index)}
                        className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 text-destructive shadow-lg transition hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                        <span className="sr-only">Remove image</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-lg bg-accent/20 p-3">
              <p className="text-sm text-muted-foreground">
                <strong>Tip:</strong> Use natural lighting, showcase signature dishes, and capture the ambiance that
                makes your restaurant special.
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Tell customers more about your restaurant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              <Label htmlFor="cuisineType">Cuisine Type</Label>
              <Select
                value={profile.cuisineType}
                onValueChange={(value) => setProfile((prev) => ({ ...prev, cuisineType: value }))}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cuisine type" />
                </SelectTrigger>
                <SelectContent>
                  {CUISINE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="priceRange">Price Range</Label>
              <Select
                value={profile.priceRange}
                onValueChange={(value) => setProfile((prev) => ({ ...prev, priceRange: value }))}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  {PRICE_RANGE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profile.website}
                onChange={(e) => setProfile((prev) => ({ ...prev, website: e.target.value }))}
                disabled={!isEditing}
                placeholder="https://your-website.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>Connect your social media accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={profile.socialLinks.facebook ?? ''}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, facebook: e.target.value },
                  }))
                }
                disabled={!isEditing}
                placeholder="@your-page"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={profile.socialLinks.instagram ?? ''}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, instagram: e.target.value },
                  }))
                }
                disabled={!isEditing}
                placeholder="@your-handle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={profile.socialLinks.twitter ?? ''}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, twitter: e.target.value },
                  }))
                }
                disabled={!isEditing}
                placeholder="@your-handle"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Specialties</CardTitle>
          <CardDescription>Highlight your restaurant&apos;s signature dishes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {specialtiesDisplay.map((specialty, index) => (
                <Badge key={`${specialty}-${index}`} variant="secondary" className="flex items-center gap-1">
                  {specialty}
                  {isEditing && (
                    <button
                      onClick={() => removeSpecialty(index)}
                      className="ml-1 text-xs hover:text-destructive"
                      type="button"
                    >
                      ×
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {isEditing && (
              <Button variant="outline" onClick={addSpecialty}>
                Add Specialty
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
          <CardDescription>Display your restaurant&apos;s certifications and awards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {certificationsDisplay.map((cert, index) => (
              <Badge key={`${cert}-${index}`} variant="outline">
                {cert}
              </Badge>
            ))}
          </div>
          {isEditing && (
            <Button variant="outline" className="mt-4">
              Add Certification
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
