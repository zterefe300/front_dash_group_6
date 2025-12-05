import { useState } from "react";
import { Link } from "react-router-dom";
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
import { toast } from "sonner@2.0.3";
import { ArrowLeft, Mail } from "lucide-react";

export function ForgotPasswordPage() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      toast.error("Please enter your username");
      return;
    }

    // Validate username format (lastname + 2 digits)
    const usernameRegex = /^[a-zA-Z]+\d{2}$/;
    if (!usernameRegex.test(username)) {
      toast.error("Please enter a valid username (lastname + 2 digits)");
      return;
    }

    setIsLoading(true);

    // Simulate API call to send reset email
    setTimeout(() => {
      toast.success("Password reset email sent!");
      setEmailSent(true);
      setIsLoading(false);
    }, 2000);
  };

  if (emailSent) {
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
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-primary">
                  Check Your Email
                </CardTitle>
                <CardDescription>
                  We've sent a password reset link to your email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertDescription>
                    A password reset link has been sent to the email associated with username <strong>{username}</strong>.
                    Please check your email and follow the instructions to reset your password.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  
                  <Alert>
                    <AlertDescription>
                      <strong>Demo:</strong> Click{" "}
                      <Link 
                        to="/restaurant/reset-password?token=demo-token-123" 
                        className="underline hover:text-primary"
                      >
                        here
                      </Link>{" "}
                      to simulate clicking the reset link from your email.
                    </AlertDescription>
                  </Alert>
                  
                  <Button
                    onClick={() => {
                      setEmailSent(false);
                      setUsername("");
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Try Different Username
                  </Button>

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
                Reset Your Password
              </CardTitle>
              <CardDescription>
                Enter your username and we'll send a reset link to your registered email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-username">Username</Label>
                  <Input
                    id="reset-username"
                    type="text"
                    placeholder="smith01"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: lastname + 2 digits (e.g., smith01)
                  </p>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
                </Button>
              </form>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Remember your password?
                </p>
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
