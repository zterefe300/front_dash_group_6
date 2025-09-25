import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { useUser } from '../contexts/UserContext';
import { Loader2 } from 'lucide-react';

export const LoginPage: = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useUser();

  const validateUsername = (username: string): boolean => {
    // Administrator is always valid
    if (username === 'administrator') return true;
    // Staff usernames should have minimum 2 chars followed by 2 digits
    const staffPattern = /^[a-zA-Z]{2,}[0-9]{2}$/;
    // For wireframe: allow any other username format (will be treated as admin)
    return staffPattern.test(username) || username.length > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!validateUsername(username)) {
      setError('Please enter a valid username');
      setIsLoading(false);
      return;
    }

    try {
      await login(username, password);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-gradient-lg border-0">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center shadow-gradient">
              <span className="text-primary-foreground font-bold text-xl">FD</span>
            </div>
          </div>
          <CardTitle className="text-center">FrontDash Employee Portal</CardTitle>
          <CardDescription className="text-center">
            Sign in to access your employee dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="administrator or staff01"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Demo credentials:</p>
              <p>Admin: administrator / password123</p>
              <p>Staff: staff01 / password123</p>
              <p>Admin: manager / password123</p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};