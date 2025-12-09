import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  LogOut,
  AlertTriangle,
  Phone,
  Mail,
  Clock,
  FileText,
  DollarSign,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '@/store';

interface WithdrawalRequest {
  id: string;
  reason: string;
  details: string;
  status: string;
  createdAt: string;
}

export function BusinessActions() {
  const token = useAppStore((state) => state.token);
  const user = useAppStore((state) => state.user);
  const restaurantId = user?.id?.toString();
  const isSubmittingWithdrawal = useAppStore((state) => state.isSubmittingWithdrawal);
  const withdrawalRequests = useAppStore((state) => state.withdrawalRequests);
  const submitWithdrawal = useAppStore((state) => state.submitWithdrawal);
  const fetchWithdrawalRequests = useAppStore((state) => state.fetchWithdrawalRequests);

  const [withdrawalReason, setWithdrawalReason] = useState('');
  const [withdrawalDetails, setWithdrawalDetails] = useState('');
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);

  useEffect(() => {
    if (token) {
      fetchWithdrawalRequests(token).catch((error) => {
        console.error('Failed to fetch withdrawal requests:', error);
      });
    }
  }, [token, fetchWithdrawalRequests]);

  const handleWithdrawal = () => {
    if (!token) {
      toast.error('Please sign in again');
      return;
    }

    if (!restaurantId) {
      toast.error('Restaurant information not found');
      return;
    }

    if (!withdrawalReason || !withdrawalDetails) {
      toast.error('Please provide a reason and details for withdrawal');
      return;
    }

    submitWithdrawal(token, restaurantId, {
      reason: withdrawalReason,
      details: withdrawalDetails,
    })
      .then(() => {
        toast.success('Withdrawal request submitted successfully! A confirmation email has been sent.');
        setWithdrawalReason('');
        setWithdrawalDetails('');
        setShowWithdrawDialog(false);
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : 'Failed to submit withdrawal request';
        toast.error(message);
      });
  };

  const formatLabel = (value: string) =>
    value
      .split(/[\s_-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || value;

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'processing':
      case 'pending':
        return 'secondary';
      case 'cancelled':
      default:
        return 'destructive';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Business Actions</h2>
        <p className="text-muted-foreground">Manage your partnership with FrontDash and access important resources</p>
      </div>
      
      {/* Withdrawal Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            Withdraw from FrontDash
          </CardTitle>
          <CardDescription>End your partnership with FrontDash platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Withdrawing from FrontDash will permanently remove your restaurant from the platform. 
              This action cannot be undone and you will lose access to all customer data and order history.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <h4>Before you withdraw, consider:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Completing all pending orders</li>
              <li>• Downloading your business reports</li>
              <li>• Reviewing the 30-day notice period</li>
              <li>• Potential impact on your revenue</li>
            </ul>
          </div>
          
          <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" disabled={isSubmittingWithdrawal}>
                Request Withdrawal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Withdraw from FrontDash</DialogTitle>
                <DialogDescription>
                  Please provide the reason for your withdrawal. This helps us improve our service.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="withdrawalReason">Reason for withdrawal</Label>
                  <Select
                    value={withdrawalReason}
                    onValueChange={setWithdrawalReason}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="closing-business">Closing business</SelectItem>
                      <SelectItem value="financial-concerns">Financial concerns</SelectItem>
                      <SelectItem value="technical-issues">Technical issues</SelectItem>
                      <SelectItem value="better-alternative">Found better alternative</SelectItem>
                      <SelectItem value="temporary-break">Temporary break</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="withdrawalDetails">Additional details</Label>
                  <Textarea
                    id="withdrawalDetails"
                    value={withdrawalDetails}
                    onChange={(e) => setWithdrawalDetails(e.target.value)}
                    placeholder="Please provide more details about your decision..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowWithdrawDialog(false)}
                  disabled={isSubmittingWithdrawal}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleWithdrawal}
                  disabled={isSubmittingWithdrawal}
                >
                  {isSubmittingWithdrawal ? 'Submitting...' : 'Submit Withdrawal Request'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <p className="text-xs text-muted-foreground">
            Need help? Contact our support team before making this decision. We're here to help resolve any issues.
          </p>

          {withdrawalRequests.length > 0 && (
            <div className="space-y-3 border-t pt-4">
              <h4 className="text-sm font-medium">Recent Withdrawal Requests</h4>
              <div className="space-y-2">
                {withdrawalRequests.slice(0, 3).map((request) => (
                  <div
                    key={request.id}
                    className="flex items-start justify-between rounded-md border border-border/60 bg-muted/40 p-3"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{formatLabel(request.reason)}</p>
                      <p className="text-xs text-muted-foreground">
                        Submitted {new Date(request.createdAt).toLocaleString()}
                      </p>
                      {request.details ? (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {request.details}
                        </p>
                      ) : null}
                    </div>
                    <Badge variant={getStatusVariant(request.status)}>
                      {formatLabel(request.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
