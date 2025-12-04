import { Button } from '../../components/common/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/common/card';
import { Store, Users, Shield } from 'lucide-react';

interface LoginTypeSelectorProps {
  onSelectType: (type: 'restaurant' | 'staff' | 'admin') => void;
}

export function LoginTypeSelector({ onSelectType }: LoginTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Choose Login Type</h2>
        <p className="text-muted-foreground mt-2">
          Select your account type to continue
        </p>
      </div>

      <div className="space-y-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Restaurant</CardTitle>
                <CardDescription>
                  Manage your restaurant, menu, and orders
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              onClick={() => onSelectType('restaurant')}
              className="w-full"
              variant="outline"
            >
              Continue as Restaurant
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Staff</CardTitle>
                <CardDescription>
                  Access staff dashboard and tools
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              onClick={() => onSelectType('staff')}
              className="w-full"
              variant="outline"
            >
              Continue as Staff
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Admin</CardTitle>
                <CardDescription>
                  FrontDash administrative access
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              onClick={() => onSelectType('admin')}
              className="w-full"
              variant="outline"
            >
              Continue as Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}