import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { ImageUpload } from '../ImageUpload';
import { toast } from 'sonner@2.0.3';

export function RestaurantProfile() {
  const [profile, setProfile] = useState({
    name: "Bella's Italian Kitchen",
    description: "Authentic Italian cuisine made with fresh, locally sourced ingredients. Family recipes passed down through generations.",
    cuisineType: "Italian",
    priceRange: "$",
    website: "https://bellasitaliankitchen.com",
    socialMedia: {
      facebook: "@bellasitaliankitchen",
      instagram: "@bellas_italian",
      twitter: "@bellasitalian"
    },
    specialties: ["Wood-fired Pizza", "Homemade Pasta", "Tiramisu"],
    certifications: ["Organic Certified", "Halal Certified"],
    images: {
      logo: undefined as string | undefined,
      interior: undefined as string | undefined,
      food1: undefined as string | undefined,
      food2: undefined as string | undefined
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Restaurant profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form would go here
  };

  const addSpecialty = () => {
    const specialty = prompt('Enter a specialty:');
    if (specialty) {
      setProfile({
        ...profile,
        specialties: [...profile.specialties, specialty]
      });
    }
  };

  const removeSpecialty = (index: number) => {
    setProfile({
      ...profile,
      specialties: profile.specialties.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Restaurant Profile</h2>
          <p className="text-muted-foreground">Manage your restaurant's public information</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </div>

      {/* Restaurant Images */}
      <Card>
        <CardHeader>
          <CardTitle>Restaurant Images</CardTitle>
          <CardDescription>Upload photos of your restaurant, food, and ambiance to attract customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload
              label="Restaurant Logo"
              value={profile.images.logo}
              onChange={(value) => setProfile({
                ...profile,
                images: { ...profile.images, logo: value }
              })}
              className="w-full"
            />
            
            <ImageUpload
              label="Restaurant Interior"
              value={profile.images.interior}
              onChange={(value) => setProfile({
                ...profile,
                images: { ...profile.images, interior: value }
              })}
              className="w-full"
            />
            
            <ImageUpload
              label="Signature Dish Photo"
              value={profile.images.food1}
              onChange={(value) => setProfile({
                ...profile,
                images: { ...profile.images, food1: value }
              })}
              className="w-full"
            />
            
            <ImageUpload
              label="Featured Food Photo"
              value={profile.images.food2}
              onChange={(value) => setProfile({
                ...profile,
                images: { ...profile.images, food2: value }
              })}
              className="w-full"
            />
          </div>
          
          {isEditing && (
            <div className="mt-4 p-3 bg-accent/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Tips for great photos:</strong> Use natural lighting, show food at its best, 
                and include shots that represent your restaurant's atmosphere and style.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>General details about your restaurant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Restaurant Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cuisineType">Cuisine Type</Label>
              <Select
                value={profile.cuisineType}
                onValueChange={(value) => setProfile({...profile, cuisineType: value})}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Italian">Italian</SelectItem>
                  <SelectItem value="Chinese">Chinese</SelectItem>
                  <SelectItem value="Mexican">Mexican</SelectItem>
                  <SelectItem value="Indian">Indian</SelectItem>
                  <SelectItem value="American">American</SelectItem>
                  <SelectItem value="Japanese">Japanese</SelectItem>
                  <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                  <SelectItem value="Thai">Thai</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={profile.description}
              onChange={(e) => setProfile({...profile, description: e.target.value})}
              disabled={!isEditing}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priceRange">Price Range</Label>
              <Select
                value={profile.priceRange}
                onValueChange={(value) => setProfile({...profile, priceRange: value})}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="$">$ - Budget friendly</SelectItem>
                  <SelectItem value="$$">$$ - Moderate</SelectItem>
                  <SelectItem value="$$$">$$$ - Expensive</SelectItem>
                  <SelectItem value="$$$$">$$$$ - Very expensive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profile.website}
                onChange={(e) => setProfile({...profile, website: e.target.value})}
                disabled={!isEditing}
                placeholder="https://your-website.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>Connect your social media accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={profile.socialMedia.facebook}
                onChange={(e) => setProfile({
                  ...profile,
                  socialMedia: {...profile.socialMedia, facebook: e.target.value}
                })}
                disabled={!isEditing}
                placeholder="@your-page"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={profile.socialMedia.instagram}
                onChange={(e) => setProfile({
                  ...profile,
                  socialMedia: {...profile.socialMedia, instagram: e.target.value}
                })}
                disabled={!isEditing}
                placeholder="@your-handle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={profile.socialMedia.twitter}
                onChange={(e) => setProfile({
                  ...profile,
                  socialMedia: {...profile.socialMedia, twitter: e.target.value}
                })}
                disabled={!isEditing}
                placeholder="@your-handle"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specialties */}
      <Card>
        <CardHeader>
          <CardTitle>Specialties</CardTitle>
          <CardDescription>Highlight your restaurant's signature dishes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {profile.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {specialty}
                  {isEditing && (
                    <button
                      onClick={() => removeSpecialty(index)}
                      className="ml-1 text-xs hover:text-destructive"
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

      {/* Certifications */}
      <Card>
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
          <CardDescription>Display your restaurant's certifications and awards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile.certifications.map((cert, index) => (
              <Badge key={index} variant="outline">
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