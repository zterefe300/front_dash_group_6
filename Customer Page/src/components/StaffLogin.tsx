import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Users, Eye, EyeOff } from 'lucide-react';
import { User } from '../App';

interface StaffLoginProps {
  onLogin: (user: User) => void;
}

export function StaffLogin({ onLogin }: StaffLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Mock authentication - in a real app, this would call an API
    setTimeout(() => {
      if (email === 'staff@frontdash.com' && password === 'password') {
        const mockUser: User = {
          id: '2',
          type: 'staff',
          name: 'John Smith',
          email: email,
          isFirstLogin: false // Set to true for demo of first-time login flow
        };
        onLogin(mockUser);
      } else if (email === 'newstaff@frontdash.com' && password === 'temporary') {
        // Demo user for first-time login
        const mockUser: User = {
          id: '3',
          type: 'staff',
          name: 'Jane Doe',
          email: email,
          isFirstLogin: true
        };
        onLogin(mockUser);
      } else {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Staff Login</h2>
        <p className="text-muted-foreground mt-2">
          Access your staff dashboard
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Access</CardTitle>
          <CardDescription>
            Enter your FrontDash staff credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="staff@frontdash.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground">
              <strong>Demo credentials:</strong><br />
              Regular: staff@frontdash.com / password<br />
              First-time: newstaff@frontdash.com / temporary
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}