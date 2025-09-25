import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { FrontDashLogo } from "./FrontDashLogo";
import { BackgroundPattern } from "./BackgroundPattern";
import { toast } from "sonner@2.0.3";
import { Info, Truck, Clock, Shield } from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const validateUsername = (username: string) => {
    if (!username) {
      return "Username is required";
    }
    
    if (username.length < 3) {
      return "Username must be at least 3 characters long";
    }
    
    const usernameRegex = /^[a-zA-Z]+\d{2}$/;
    if (!usernameRegex.test(username)) {
      return "Username must be lastname + 2 digits (e.g., smith01)";
    }
    
    return "";
  };

  const handleUsernameChange = (value: string) => {
    setLoginData({ ...loginData, username: value });
    setUsernameError(validateUsername(value));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const usernameValidationError = validateUsername(loginData.username);
    setUsernameError(usernameValidationError);
    
    if (!loginData.username || !loginData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (usernameValidationError) {
      toast.error(usernameValidationError);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Login successful!");
      onLogin();
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background Pattern */}
      <BackgroundPattern variant="food" opacity={0.08} />
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
      </div>

      <div className="min-h-screen flex max-w-6xl mx-auto">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:pl-8 lg:pr-6 xl:pl-12 xl:pr-8">
          <div className="max-w-md xl:max-w-lg">
            <FrontDashLogo size="xl" animate={true} />
            
            <div className="mt-8 space-y-6">
              <h1 className="text-4xl font-bold text-foreground">
                Partner with the Future of Food Delivery
              </h1>
              <p className="text-lg text-muted-foreground">
                Join thousands of restaurants already growing their business with FrontDash's 
                powerful delivery platform.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Fast & Reliable Delivery</h3>
                    <p className="text-sm text-muted-foreground">Quick delivery times with real-time tracking</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">24/7 Support</h3>
                    <p className="text-sm text-muted-foreground">Round-the-clock assistance for partners</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Secure Payments</h3>
                    <p className="text-sm text-muted-foreground">Safe and timely payment processing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-6 xl:px-8">
          <div className="w-full max-w-md space-y-6">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center">
              <FrontDashLogo size="lg" animate={true} />
            </div>

            <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-xl">
              <CardHeader className="text-center space-y-3">
                <CardTitle className="text-2xl text-primary">
                  Partner Login
                </CardTitle>
                <CardDescription className="text-base">
                  Access your restaurant dashboard
                </CardDescription>
              </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Don't have login credentials yet? You need to{" "}
              <Link
                to="/register"
                className="underline hover:text-primary"
              >
                submit an application
              </Link>{" "}
              first and wait for approval.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="smith01"
                value={loginData.username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                disabled={isLoading}
                className={usernameError ? "border-destructive focus:ring-destructive" : ""}
              />
              {usernameError ? (
                <p className="text-xs text-destructive">
                  {usernameError}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Format: lastname + 2 digits (e.g., smith01)
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    password: e.target.value,
                  })
                }
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Need to apply to become a partner?
            </p>
            <Link to="/register">
              <Button variant="outline" className="w-full">
                Submit Restaurant Application
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <Link to="/forgot-password">
              <Button variant="ghost" className="text-sm">
                Forgot password?
              </Button>
            </Link>
          </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
}