import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { PageType } from '../../App';
import { 
  ArrowLeft,
  UserX, 
  Search, 
  Eye, 
  Check, 
  X, 
  Clock, 
  Building2,
  FileText,
  Calendar
} from 'lucide-react';

interface WithdrawalRequestsProps {
  onNavigate: (page: PageType) => void;
}

interface DeregistrationRequest {
  id: string;
  restaurantId: string;
  restaurantName: string;
  ownerName: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  reason: string;
  joinDate: string;
  contractEndDate: string;
  outstandingOrders: number;
  lastActiveDate: string;
  description?: string;
  rejectionReason?: string;
}

const mockDeregistrationRequests: DeregistrationRequest[] = [
  {
    id: '1',
    restaurantId: 'rest_001',
    restaurantName: 'Pizza Palace',
    ownerName: 'John Smith',
    requestDate: '2024-01-15',
    status: 'pending',
    reason: 'Business Closure',
    joinDate: '2022-03-15',
    contractEndDate: '2024-03-15',
    outstandingOrders: 0,
    lastActiveDate: '2024-01-14',
    description: 'Closing down due to lease expiration and unable to find new location'
  },
  {
    id: '2',
    restaurantId: 'rest_002',
    restaurantName: 'Sushi Zen',
    ownerName: 'Mike Chen',
    requestDate: '2024-01-14',
    status: 'pending',
    reason: 'Relocation',
    joinDate: '2021-08-20',
    contractEndDate: '2024-08-20',
    outstandingOrders: 2,
    lastActiveDate: '2024-01-13',
    description: 'Moving restaurant to a different city outside FrontDash service area'
  },
  {
    id: '3',
    restaurantId: 'rest_003',
    restaurantName: 'Burger House',
    ownerName: 'Sarah Johnson',
    requestDate: '2024-01-13',
    status: 'processing',
    reason: 'Switch to Competitor',
    joinDate: '2020-11-05',
    contractEndDate: '2024-11-05',
    outstandingOrders: 5,
    lastActiveDate: '2024-01-12',
    description: 'Switching to another delivery platform that better suits our business needs'
  },
  {
    id: '4',
    restaurantId: 'rest_004',
    restaurantName: 'Taco Fiesta',
    ownerName: 'Maria Garcia',
    requestDate: '2024-01-12',
    status: 'approved',
    reason: 'Contract Completion',
    joinDate: '2023-01-12',
    contractEndDate: '2024-01-12',
    outstandingOrders: 0,
    lastActiveDate: '2024-01-11',
    description: 'Contract period completed successfully, not renewing for business reasons'
  },
  {
    id: '5',
    restaurantId: 'rest_005',
    restaurantName: 'Mediterranean Delight',
    ownerName: 'Omar Hassan',
    requestDate: '2024-01-11',
    status: 'rejected',
    reason: 'Dissatisfied with Service',
    joinDate: '2023-06-10',
    contractEndDate: '2024-06-10',
    outstandingOrders: 8,
    lastActiveDate: '2024-01-10',
    description: 'Unhappy with commission rates and customer service quality',
    rejectionReason: 'Outstanding orders must be completed before deregistration. Early contract termination fees apply.'
  }
];

export const WithdrawalRequests: React.FC<WithdrawalRequestsProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<DeregistrationRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredRequests = mockDeregistrationRequests.filter(request =>
    request.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingRequests = filteredRequests.filter(req => req.status === 'pending');

  const handleApprove = (id: string) => {
    console.log('Approving withdrawal:', id);
    // In real app, make API call to approve withdrawal
  };

  const handleReject = (id: string, reason: string) => {
    console.log('Rejecting withdrawal:', id, 'Reason:', reason);
    // In real app, make API call to reject withdrawal
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="default">
            <Check className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <X className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" />
            Processing
          </Badge>
        );
      default:
        return null;
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onNavigate('restaurant-management')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Restaurant Management</span>
        </Button>
      </div>

      <div>
        <h1>Withdrawal Requests</h1>
        <p className="text-muted-foreground">
          Process restaurant withdrawal requests and manage platform exits
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
                <p className="text-xl font-bold">{pendingRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Approved Today</p>
                <p className="text-xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <X className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserX className="h-5 w-5" />
            <span>Withdrawal Requests Queue</span>
            <Badge variant="secondary">{filteredRequests.length}</Badge>
          </CardTitle>
          <CardDescription>
            Review and process restaurant withdrawal requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by restaurant name or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Restaurant</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.restaurantName}</p>
                        <p className="text-sm text-muted-foreground">ID: {request.restaurantId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{request.ownerName}</p>
                    </TableCell>
                    <TableCell>{request.requestDate}</TableCell>
                    <TableCell>
                      {getStatusBadge(request.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Withdrawal Request Details</DialogTitle>
                              <DialogDescription>
                                Review withdrawal request from {selectedRequest?.restaurantName}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedRequest && (
                              <div className="space-y-6">
                                {/* Restaurant Information */}
                                <div>
                                  <h3 className="text-lg font-semibold mb-3">Restaurant Information</h3>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Restaurant Name</Label>
                                      <p className="text-sm mt-1">{selectedRequest.restaurantName}</p>
                                    </div>
                                    <div>
                                      <Label>Owner Name</Label>
                                      <p className="text-sm mt-1">{selectedRequest.ownerName}</p>
                                    </div>
                                    <div>
                                      <Label>Restaurant ID</Label>
                                      <p className="text-sm mt-1">{selectedRequest.restaurantId}</p>
                                    </div>
                                    <div>
                                      <Label>Withdrawal Reason</Label>
                                      <p className="text-sm mt-1">{selectedRequest.reason}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Contract & Activity Information */}
                                <div>
                                  <h3 className="text-lg font-semibold mb-3">Contract & Activity Details</h3>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Join Date</Label>
                                      <p className="text-sm mt-1">{selectedRequest.joinDate}</p>
                                    </div>
                                    <div>
                                      <Label>Contract End Date</Label>
                                      <p className="text-sm mt-1">{selectedRequest.contractEndDate}</p>
                                    </div>
                                    <div>
                                      <Label>Last Active Date</Label>
                                      <p className="text-sm mt-1">{selectedRequest.lastActiveDate}</p>
                                    </div>
                                    <div>
                                      <Label>Outstanding Orders</Label>
                                      <p className="text-sm mt-1">
                                        {selectedRequest.outstandingOrders} {selectedRequest.outstandingOrders === 1 ? 'order' : 'orders'}
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Request Date</Label>
                                      <p className="text-sm mt-1">{selectedRequest.requestDate}</p>
                                    </div>
                                    <div>
                                      <Label>Current Status</Label>
                                      <div className="mt-1">
                                        {getStatusBadge(selectedRequest.status)}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {selectedRequest.outstandingOrders > 0 && (
                                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                      <div className="flex items-center text-yellow-800">
                                        <Clock className="h-4 w-4 mr-2" />
                                        <span className="text-sm font-medium">Outstanding Orders</span>
                                      </div>
                                      <p className="text-sm text-yellow-700 mt-1">
                                        This restaurant has {selectedRequest.outstandingOrders} pending {selectedRequest.outstandingOrders === 1 ? 'order' : 'orders'} that must be completed before withdrawal.
                                      </p>
                                    </div>
                                  )}
                                </div>



                                {/* Additional Details */}
                                {selectedRequest.description && (
                                  <div>
                                    <Label>Additional Details</Label>
                                    <p className="text-sm mt-1 p-3 bg-gray-50 rounded">{selectedRequest.description}</p>
                                  </div>
                                )}

                                {/* Rejection Reason */}
                                {selectedRequest.status === 'rejected' && selectedRequest.rejectionReason && (
                                  <div>
                                    <Label>Rejection Reason</Label>
                                    <p className="text-sm mt-1 p-3 bg-red-50 border border-red-200 rounded text-red-800">
                                      {selectedRequest.rejectionReason}
                                    </p>
                                  </div>
                                )}

                                {/* Rejection Reason Input (for new rejections) */}
                                {selectedRequest.status === 'pending' && (
                                  <div>
                                    <Label htmlFor="rejection-reason">Rejection Reason (if rejecting)</Label>
                                    <Textarea
                                      id="rejection-reason"
                                      placeholder="Enter reason for rejection..."
                                      value={rejectionReason}
                                      onChange={(e) => setRejectionReason(e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                            <DialogFooter className="flex space-x-2">
                              {selectedRequest?.status === 'pending' && (
                                <>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      if (selectedRequest && rejectionReason.trim()) {
                                        handleReject(selectedRequest.id, rejectionReason);
                                        setRejectionReason('');
                                      }
                                    }}
                                    disabled={!rejectionReason.trim()}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Reject Request
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      if (selectedRequest) {
                                        handleApprove(selectedRequest.id);
                                      }
                                    }}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Approve Withdrawal
                                  </Button>
                                </>
                              )}
                              {selectedRequest?.status !== 'pending' && (
                                <Button variant="outline">Close</Button>
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {request.status === 'pending' && (
                          <div className="flex space-x-1">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm">
                                  <Check className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Approve Withdrawal</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to approve this withdrawal request for {request.restaurantName}? This will remove the restaurant from the platform.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleApprove(request.id)}>
                                    Approve
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredRequests.length === 0 && (
              <div className="text-center py-8">
                <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No withdrawal requests found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};