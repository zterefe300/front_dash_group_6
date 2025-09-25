import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { FrontDashLogo } from './FrontDashLogo';
import { BackgroundPattern } from './BackgroundPattern';
import { 
  Shield, 
  Smartphone, 
  ArrowLeft, 
  RefreshCw,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TwoFactorVerificationPageProps {
  onVerificationSuccess: () => void;
  userEmail?: string;
}

export function TwoFactorVerificationPage({ onVerificationSuccess, userEmail = "restaurant@example.com" }: TwoFactorVerificationPageProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [showHelp, setShowHelp] = useState(false);

  const handleVerifyCode = async () => {
    const code = useBackupCode ? backupCode : verificationCode;
    
    if (!code || (useBackupCode ? code.length < 8 : code.length !== 6)) {
      toast.error(useBackupCode ? 'Please enter a valid backup code' : 'Please enter a valid 6-digit code');
      return;
    }

    setIsVerifying(true);
    
    // Simulate API verification
    setTimeout(() => {
      // Mock verification - in real app, verify with backend
      if (
        (!useBackupCode && (code === '123456' || code.length === 6)) ||
        (useBackupCode && (code === '1a2b-3c4d-5e6f' || code.length >= 8))
      ) {
        toast.success('Verification successful! Welcome back.');
        onVerificationSuccess();
      } else {
        const newAttemptsLeft = attemptsLeft - 1;
        setAttemptsLeft(newAttemptsLeft);
        
        if (newAttemptsLeft <= 0) {
          toast.error('Too many failed attempts. Please try again later or contact support.');
        } else {
          toast.error(`Invalid code. ${newAttemptsLeft} attempt${newAttemptsLeft !== 1 ? 's' : ''} remaining.`);
        }
        
        // Clear the input
        if (useBackupCode) {
          setBackupCode('');
        } else {
          setVerificationCode('');
        }
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handleResendCode = () => {
    if (useBackupCode) return; // Can't resend backup codes
    
    toast.success('New verification code sent to your authenticator app');
    // In real app, this would trigger backend to send new code
  };

  const toggleBackupCode = () => {
    setUseBackupCode(!useBackupCode);
    setVerificationCode('');
    setBackupCode('');
  };

  const maskedEmail = userEmail.replace(/(.{2}).*(@.*)/, '$1***$2');

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-background via-background to-primary/5 px-4 py-8">
      <BackgroundPattern variant="dots" opacity={0.06} />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md mx-auto relative">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Login
          </Link>
          <FrontDashLogo size="md" />
        </div>

        <Card className="backdrop-blur-sm bg-card/90 border-border/50 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              {useBackupCode ? (
                <Shield className="h-8 w-8 text-primary" />
              ) : (
                <Smartphone className="h-8 w-8 text-primary" />
              )}
            </div>
            <CardTitle className="text-primary text-2xl">
              {useBackupCode ? 'Enter Backup Code' : 'Two-Factor Authentication'}
            </CardTitle>
            <CardDescription className="text-base">
              {useBackupCode 
                ? 'Enter one of your backup recovery codes to access your account'
                : 'Enter the 6-digit code from your authenticator app'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Account Info */}
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Signing in as:</p>
              <p className="font-medium">{maskedEmail}</p>
            </div>

            {/* Verification Input */}
            <div className="space-y-4">
              {!useBackupCode ? (
                <>
                  <Label htmlFor="verification-code">
                    Authentication Code
                  </Label>
                  <Input
                    id="verification-code"
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setVerificationCode(value);
                    }}
                    className="text-center text-xl tracking-widest font-mono"
                    maxLength={6}
                    autoComplete="one-time-code"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Open your authenticator app and enter the current 6-digit code
                  </p>
                </>
              ) : (
                <>
                  <Label htmlFor="backup-code">
                    Backup Recovery Code
                  </Label>
                  <Input
                    id="backup-code"
                    type="text"
                    placeholder="1a2b-3c4d-5e6f"
                    value={backupCode}
                    onChange={(e) => {
                      const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      setBackupCode(value);
                    }}
                    className="text-center font-mono"
                    autoComplete="one-time-code"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Enter one of the backup codes you saved during setup
                  </p>
                </>
              )}
            </div>

            {/* Attempts Warning */}
            {attemptsLeft < 3 && attemptsLeft > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {attemptsLeft} verification attempt{attemptsLeft !== 1 ? 's' : ''} remaining before temporary lockout.
                </AlertDescription>
              </Alert>
            )}

            {/* Verify Button */}
            <Button 
              onClick={handleVerifyCode}
              disabled={
                isVerifying || 
                attemptsLeft <= 0 ||
                (useBackupCode ? backupCode.length < 8 : verificationCode.length !== 6)
              }
              className="w-full"
              size="lg"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify & Sign In'
              )}
            </Button>

            {/* Alternative Options */}
            <div className="space-y-4">
              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={toggleBackupCode}
                  className="text-sm"
                  disabled={isVerifying}
                >
                  {useBackupCode 
                    ? 'Use authenticator app instead' 
                    : 'Use backup code instead'
                  }
                </Button>
              </div>

              {!useBackupCode && (
                <div className="text-center">
                  <Button
                    variant="ghost"
                    onClick={handleResendCode}
                    className="text-sm"
                    disabled={isVerifying}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh code
                  </Button>
                </div>
              )}
            </div>

            {/* Help Section */}
            <div className="border-t pt-4">
              <Button
                variant="ghost"
                onClick={() => setShowHelp(!showHelp)}
                className="w-full text-sm"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Need help?
              </Button>
              
              {showHelp && (
                <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <div>
                    <p className="font-medium mb-1">Can't access your authenticator app?</p>
                    <p>Use one of your backup codes that you saved during setup.</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Lost your backup codes?</p>
                    <p>Contact our support team for assistance with account recovery.</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Code not working?</p>
                    <p>Make sure your device's time is synchronized and try refreshing the code.</p>
                  </div>
                  <div className="text-center pt-2">
                    <Link 
                      to="/support" 
                      className="text-primary hover:underline text-sm"
                    >
                      Contact Support
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Security Notice */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            Your account is protected by two-factor authentication. 
            Never share your codes with anyone.
          </p>
        </div>
      </div>
    </div>
  );
}