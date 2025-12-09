import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  ArrowLeft,
  Building2,
  Search,
  Check,
  X,
  Clock,
  Phone,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { adminService } from "../../../service/employee/adminService";



export const RegistrationRequests = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [registrationRequests, setRegistrationRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await adminService.getRegistrationRequests();
        setRegistrationRequests(data);
      } catch (error) {
        console.error('Failed to fetch registration requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const filteredRequests = registrationRequests.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.contactPersonName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = async (id: number) => {
    try {
      await adminService.approveRegistration(id);
      toast.success("Registration request approved successfully");
      // Refresh the list
      const data = await adminService.getRegistrationRequests();
      setRegistrationRequests(data);
    } catch (error) {
      console.error('Failed to approve registration:', error);
      toast.error("Failed to approve registration request");
    }
  };

  const handleReject = async (id: number, reason: string) => {
    try {
      await adminService.rejectRegistration(id);
      toast.success("Registration request rejected successfully");
      // Refresh the list
      const data = await adminService.getRegistrationRequests();
      setRegistrationRequests(data);
    } catch (error) {
      console.error('Failed to reject registration:', error);
      toast.error("Failed to reject registration request");
    }
  };

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
        <h1>Registration Requests</h1>
        <p className="text-muted-foreground">Review and process restaurant registration applications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Pending Applications</span>
            <Badge variant="secondary">{filteredRequests.length}</Badge>
          </CardTitle>
          <CardDescription>Review restaurant information and documentation before approval</CardDescription>
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
                {filteredRequests.map((restaurant) => (
                  <TableRow key={restaurant.restaurantId}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{restaurant.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{restaurant.contactPersonName}</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {restaurant.emailAddress}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {restaurant.phoneNumber}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        <Clock className="mr-1 h-3 w-3" />
                        {restaurant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprove(restaurant.restaurantId)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(restaurant.restaurantId, "Rejected")}
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
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No registration requests found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
