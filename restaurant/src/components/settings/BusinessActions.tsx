import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  MessageCircle, 
  LogOut, 
  AlertTriangle, 
  Phone, 
  Mail, 
  Clock,
  FileText,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function BusinessActions() {
  const [contactForm, setContactForm] = useState({
    subject: '',
    priority: 'medium',
    message: ''
  });

  const [withdrawalReason, setWithdrawalReason] = useState('');
  const [withdrawalDetails, setWithdrawalDetails] = useState('');
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);

  const supportTickets = [
    {
      id: '#12345',
      subject: 'Menu upload issue',
      status: 'resolved',
      date: '2024-01-10',
      priority: 'medium'
    },
    {
      id: '#12346',
      subject: 'Payment processing delay',
      status: 'in-progress',
      date: '2024-01-12',
      priority: 'high'
    },
    {
      id: '#12347',
      subject: 'Profile update request',
      status: 'pending',
      date: '2024-01-14',
      priority: 'low'
    }
  ];

  const handleContactSubmit = () => {
    if (!contactForm.subject || !contactForm.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('Support ticket created successfully! You will receive a response within 24 hours.');
    setContactForm({ subject: '', priority: 'medium', message: '' });
  };

  const handleWithdrawal = () => {
    if (!withdrawalReason || !withdrawalDetails) {
      toast.error('Please provide a reason and details for withdrawal');
      return;
    }
    
    toast.success('Withdrawal request submitted. You will be contacted within 2 business days.');
    setWithdrawalReason('');
    setWithdrawalDetails('');
    setShowWithdrawDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Business Actions</h2>
        <p className="text-muted-foreground">Contact support and manage your partnership with FrontDash</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Emergency Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              For urgent issues affecting your business
            </p>
            <Button variant="destructive" className="w-full">
              Call Now: (555) 911-HELP
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Business Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Support available 24/7 for partners
            </p>
            <Button variant="outline" className="w-full">
              View Support Hours
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Help guides and documentation
            </p>
            <Button variant="outline" className="w-full">
              Browse Help Center
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Contact FrontDash */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Contact FrontDash Support
          </CardTitle>
          <CardDescription>Submit a support request or ask a question</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                placeholder="Brief description of your issue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={contactForm.priority}
                onValueChange={(value) => setContactForm({...contactForm, priority: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - General inquiry</SelectItem>
                  <SelectItem value="medium">Medium - Business impact</SelectItem>
                  <SelectItem value="high">High - Urgent issue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={contactForm.message}
              onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
              placeholder="Describe your issue or question in detail..."
              rows={4}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Button onClick={handleContactSubmit}>
              Submit Ticket
            </Button>
            <div className="text-sm text-muted-foreground">
              <Mail className="h-4 w-4 inline mr-1" />
              You can also email us at support@frontdash.com
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Tickets History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Support Tickets</CardTitle>
          <CardDescription>Track your previous support requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supportTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{ticket.id}</span>
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusColor(ticket.status)} text-white`}
                    >
                      {ticket.status}
                    </Badge>
                  </div>
                  <p className="text-sm">{ticket.subject}</p>
                  <p className="text-xs text-muted-foreground">{ticket.date}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority.toUpperCase()}
                  </p>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>Manage your partnership status with FrontDash</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4>Partnership Status</h4>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500 text-white">Active Partner</Badge>
                  <span className="text-sm">Since January 2023</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Your restaurant is live and accepting orders
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4>Account Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-2" />
                  View Financial Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Partnership Agreement
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <Button variant="destructive">
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
                <Button variant="outline" onClick={() => setShowWithdrawDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleWithdrawal}>
                  Submit Withdrawal Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <p className="text-xs text-muted-foreground">
            Need help? Contact our support team before making this decision. We're here to help resolve any issues.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}