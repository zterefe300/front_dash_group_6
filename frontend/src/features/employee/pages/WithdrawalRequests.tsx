import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../../service/employee/adminService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/common/card";
import { Badge } from "../../../components/common/badge";
import { Button } from "../../../components/common/button";
import { Input } from "../../../components/common/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/common/table";
import { ArrowLeft, UserX, Search, Check, X, Clock, Mail, Phone } from "lucide-react";
import { Loader } from "../components/Loader";

export const WithdrawalRequests = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await adminService.getWithdrawalRequests();
        setWithdrawalRequests(data);
      } catch (error) {
        console.error('Failed to fetch withdrawal requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const filteredRequests = withdrawalRequests.filter(
    (request) =>
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.contactPersonName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingRequests = filteredRequests.filter((req) => req.status === "WITHDRAW_REQ");

  const handleApprove = async (id: number) => {
    try {
      await adminService.approveWithdrawal(id);
      // Refresh the list
      const data = await adminService.getWithdrawalRequests();
      setWithdrawalRequests(data);
    } catch (error) {
      console.error('Failed to approve withdrawal:', error);
    }
  };

  const handleReject = async (id: number, reason: string) => {
    try {
      await adminService.rejectWithdrawal(id);
      // Refresh the list
      const data = await adminService.getWithdrawalRequests();
      setWithdrawalRequests(data);
    } catch (error) {
      console.error('Failed to reject withdrawal:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "WITHDRAW_REQ":
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Withdrawal Request
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="default">
            <Check className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <X className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" />
            Processing
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  if (loading) {
    return <Loader/>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/employee/restaurant-management")}
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
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserX className="h-5 w-5" />
            <span>Withdrawal Requests Queue</span>
            <Badge variant="secondary">{filteredRequests.length}</Badge>
          </CardTitle>
          <CardDescription>Review and process restaurant withdrawal requests</CardDescription>
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
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.restaurantId}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.cuisineType}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{request.contactPersonName}</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {request.emailAddress}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {request.phoneNumber}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(request.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(request.restaurantId)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(request.restaurantId, "Rejected")}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
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
