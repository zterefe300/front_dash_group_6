import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { FrontDashLogo } from './FrontDashLogo';
import { BackgroundPattern } from './BackgroundPattern';
import { 
  Shield, 
  Smartphone, 
  QrCode, 
  Copy, 
  CheckCircle, 
  AlertTriangle,
  ArrowLeft,
  Download,
  Key
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TwoFactorSetupPageProps {
  onSetupComplete: () => void;
  onSkip?: () => void;
}

export function TwoFactorSetupPage({ onSetupComplete, onSkip }: TwoFactorSetupPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [qrCodeCopied, setQrCodeCopied] = useState(false);

  // Mock data - in real app, this would come from backend
  const secretKey = 'JBSWY3DPEHPK3PXP';
  const qrCodeUrl = `otpauth://totp/FrontDash:restaurant@example.com?secret=${secretKey}&issuer=FrontDash`;
  const mockBackupCodes = [
    '1a2b-3c4d-5e6f',
    '7g8h-9i0j-1k2l',
    '3m4n-5o6p-7q8r',
    '9s0t-1u2v-3w4x',
    '5y6z-7a8b-9c0d',
    '1e2f-3g4h-5i6j',
    '7k8l-9m0n-1o2p',
    '3q4r-5s6t-7u8v'
  ];

  const authenticatorApps = [
    { name: 'Google Authenticator', icon: '🔐' },
    { name: 'Microsoft Authenticator', icon: '🔑' },
    { name: 'Authy', icon: '🛡️' },
    { name: '1Password', icon: '🔒' }
  ];

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretKey);
    setQrCodeCopied(true);
    toast.success('Secret key copied to clipboard');
    setTimeout(() => setQrCodeCopied(false), 2000);
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setIsVerifying(true);
    
    // Simulate API verification
    setTimeout(() => {
      // Mock verification - in real app, verify with backend
      if (verificationCode === '123456' || verificationCode.length === 6) {
        setBackupCodes(mockBackupCodes);
        setCurrentStep(3);
        toast.success('Two-factor authentication verified successfully!');
      } else {
        toast.error('Invalid verification code. Please try again.');
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handleComplete = () => {
    toast.success('Two-factor authentication setup complete!');
    onSetupComplete();
  };

  const handleBackupCodesCopied = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText);
    toast.success('Backup codes copied to clipboard');
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-background via-background to-primary/5 px-4 py-8">
      <BackgroundPattern variant="dots" opacity={0.06} />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto relative">
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
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-primary text-2xl">Setup Two-Factor Authentication</CardTitle>
            <CardDescription className="text-base">
              Add an extra layer of security to your restaurant account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-0.5 ml-2 ${
                      step < currentStep ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Download Authenticator App */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Step 1: Download an Authenticator App</h3>
                  <p className="text-muted-foreground">
                    Choose and install one of these recommended authenticator apps on your mobile device
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {authenticatorApps.map((app, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl mb-2">{app.icon}</div>
                        <p className="font-medium">{app.name}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Alert>
                  <Download className="h-4 w-4" />
                  <AlertDescription>
                    Download any of these apps from your device's app store. They're all free and work with FrontDash.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-center">
                  <Button onClick={() => setCurrentStep(2)} className="px-8">
                    I've Downloaded an App
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Scan QR Code */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Step 2: Scan QR Code</h3>
                  <p className="text-muted-foreground">
                    Open your authenticator app and scan this QR code to add your FrontDash account
                  </p>
                </div>

                <div className="flex flex-col items-center space-y-4">
                  {/* Mock QR Code */}
                  <div className="w-48 h-48 bg-white border rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="h-20 w-20 mx-auto text-gray-600 mb-2" />
                      <p className="text-xs text-gray-500">QR Code</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Can't scan? Enter this code manually:</p>
                    <div className="flex items-center justify-center space-x-2">
                      <code className="px-3 py-2 bg-muted rounded text-sm font-mono">{secretKey}</code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopySecret}
                        className="flex items-center"
                      >
                        {qrCodeCopied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label htmlFor="verification-code">
                    Enter the 6-digit code from your authenticator app
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="verification-code"
                      type="text"
                      placeholder="000000"
                      value={verificationCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setVerificationCode(value);
                      }}
                      className="text-center text-lg tracking-widest font-mono"
                      maxLength={6}
                    />
                    <Button 
                      onClick={handleVerifyCode}
                      disabled={isVerifying || verificationCode.length !== 6}
                    >
                      {isVerifying ? 'Verifying...' : 'Verify'}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter the current 6-digit code shown in your authenticator app
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Save Backup Codes */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Step 3: Save Your Backup Codes</h3>
                  <p className="text-muted-foreground">
                    Store these backup codes in a safe place. You can use them to access your account if you lose your phone.
                  </p>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> Each backup code can only be used once. Store them securely and don't share them with anyone.
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Backup Recovery Codes</CardTitle>
                      <Button variant="outline" size="sm" onClick={handleBackupCodesCopied}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {backupCodes.map((code, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Badge variant="secondary" className="font-mono text-sm">
                            {code}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div className="bg-accent/20 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Key className="h-4 w-4 mr-2" />
                      How to use backup codes:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Use when you don't have access to your authenticator app</li>
                      <li>• Enter any unused code when prompted for 2FA</li>
                      <li>• Each code works only once</li>
                      <li>• You can generate new codes anytime in your security settings</li>
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={handleComplete} className="flex-1">
                      Complete Setup
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Skip Option */}
            {onSkip && currentStep === 1 && (
              <>
                <Separator />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    You can set up two-factor authentication later in your security settings
                  </p>
                  <Button variant="outline" onClick={onSkip}>
                    Skip for Now
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}