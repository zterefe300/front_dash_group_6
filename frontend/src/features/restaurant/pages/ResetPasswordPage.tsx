import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FrontDashLogo } from "./FrontDashLogo";
import { BackgroundPattern } from "./BackgroundPattern";
import { toast } from "sonner";
import { CheckCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  const token = searchParams.get("token");

  useEffect(() => {
    // Simulate token validation
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        return;
      }

      // Simulate API call to validate token
      setTimeout(() => {
        // For demo purposes, consider token valid if it exists
        setTokenValid(true);
      }, 1000);
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    // Simulate API call to reset password
    setTimeout(() => {
      toast.success("Password reset successfully!");
      setPasswordReset(true);
      setIsLoading(false);
    }, 2000);
  };

  // Loading state while validating token
  if (tokenValid === null) {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-background via-background to-primary/5 px-4">
        <BackgroundPattern variant="dots" opacity={0.06} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <FrontDashLogo size="lg" />
            </div>
            <Card className="backdrop-blur-sm bg-card/90 border-border/50 shadow-xl">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Validating reset link...</p>
            </div>
          </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!tokenValid) {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-background via-background to-primary/5 px-4">
        <BackgroundPattern variant="dots" opacity={0.06} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <FrontDashLogo size="lg" />
            </div>
            <Card className="backdrop-blur-sm bg-card/90 border-border/50 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">
              Invalid Reset Link
            </CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                The reset link you used is either invalid or has expired. 
                Please request a new password reset link.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <Link to="/restaurant/forgot-password">
                <Button className="w-full">
                  Request New Reset Link
                </Button>
              </Link>

              <div className="text-center">
                <Link to="/restaurant/login">
                  <Button variant="ghost" className="text-sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (passwordReset) {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-background via-background to-primary/5 px-4">
        <BackgroundPattern variant="dots" opacity={0.06} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center">
              <FrontDashLogo size="lg" />
            </div>
            <Card className="backdrop-blur-sm bg-card/90 border-border/50 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-primary">
              Password Reset Complete
            </CardTitle>
            <CardDescription>
              Your password has been successfully reset
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your password has been updated successfully. You can now log in with your new password.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <Link to="/restaurant/login">
                <Button className="w-full">
                  Continue to Login
                </Button>
              </Link>
            </div>
          </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-background via-background to-primary/5 px-4">
      <BackgroundPattern variant="dots" opacity={0.06} />
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <FrontDashLogo size="lg" />
          </div>
          <Card className="backdrop-blur-sm bg-card/90 border-border/50 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-primary">
            Set New Password
          </CardTitle>
          <CardDescription>
            Choose a strong password for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>

          <div className="text-center">
            <Link to="/restaurant/login">
              <Button variant="ghost" className="text-sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
