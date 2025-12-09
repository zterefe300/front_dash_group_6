import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
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
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useAppStore } from "@/store";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token, user, changePassword, isFirstLogin } = useAppStore();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);

  const resetToken = searchParams.get("token");

  useEffect(() => {
    // If user is logged in and it's their first login, they can reset password
    // Otherwise, they need a reset token (from forgot password flow)
    if (!isFirstLogin && !resetToken && !token) {
      toast.error("Unauthorized access. Please log in first.");
      navigate("/restaurant/login", { replace: true });
    }
  }, [isFirstLogin, resetToken, token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.currentPassword || !formData.password || !formData.confirmPassword) {
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

    if (!token || !user?.username) {
      toast.error("Authentication required. Please log in again.");
      navigate("/restaurant/login", { replace: true });
      return;
    }

    setIsLoading(true);

    try {
      await changePassword(token, user.username, {
        currentPassword: formData.currentPassword,
        newPassword: formData.password,
      });
      toast.success("Password reset successfully!");
      setPasswordReset(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to reset password";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

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
          {isFirstLogin && (
            <Alert>
              <AlertDescription>
                This is your first login. Please change your temporary password to a secure one.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter your current password"
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentPassword: e.target.value,
                  })
                }
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your new password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
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
