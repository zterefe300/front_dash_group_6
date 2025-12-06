import React, { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/common/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../components/common/collapsible";
import { Label } from "../../../components/common/label";
import { Textarea } from "../../../components/common/textarea";
import {
  ArrowLeft,
  Building2,
  Search,
  Eye,
  Check,
  X,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
} from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  address: string;
  cuisine: string;
  status: "pending" | "active" | "suspended";
  registrationDate: string;
  operatingHours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
  documents?: string[];
  businessLicense?: string;
  taxId?: string;
  description?: string;
}

const mockRegistrationRequests: Restaurant[] = [
  {
    id: "1",
    name: "Pizza Palace",
    owner: "John Smith",
    email: "john@pizzapalace.com",
    phone: "234 567 8901",
    address: "123 Main St, City, State 12345",
    cuisine: "Italian",
    status: "pending",
    registrationDate: "2024-01-15",
    operatingHours: {
      monday: { open: "11:00 AM", close: "10:00 PM" },
      tuesday: { open: "11:00 AM", close: "10:00 PM" },
      wednesday: { open: "11:00 AM", close: "10:00 PM" },
      thursday: { open: "11:00 AM", close: "10:00 PM" },
      friday: { open: "11:00 AM", close: "11:00 PM" },
      saturday: { open: "12:00 PM", close: "11:00 PM" },
      sunday: { open: "12:00 PM", close: "9:00 PM" },
    },
    documents: ["license.pdf", "insurance.pdf", "tax-cert.pdf"],
    businessLicense: "BL123456789",
    taxId: "TX987654321",
    description: "Authentic Italian pizza and pasta restaurant with traditional recipes.",
  },
  {
    id: "2",
    name: "Burger House",
    owner: "Sarah Johnson",
    email: "sarah@burgerhouse.com",
    phone: "234 567 8902",
    address: "456 Oak Ave, City, State 12345",
    cuisine: "American",
    status: "pending",
    registrationDate: "2024-01-14",
    operatingHours: {
      monday: { open: "10:00 AM", close: "9:00 PM" },
      tuesday: { open: "10:00 AM", close: "9:00 PM" },
      wednesday: { open: "10:00 AM", close: "9:00 PM" },
      thursday: { open: "10:00 AM", close: "9:00 PM" },
      friday: { open: "10:00 AM", close: "10:00 PM" },
      saturday: { open: "11:00 AM", close: "10:00 PM" },
      sunday: { open: "11:00 AM", close: "8:00 PM" },
    },
    documents: ["license.pdf", "health-cert.pdf", "insurance.pdf"],
    businessLicense: "BL987654321",
    taxId: "TX123456789",
    description: "Classic American burgers made with fresh, locally sourced ingredients.",
  },
  {
    id: "3",
    name: "Spice Garden",
    owner: "Raj Patel",
    email: "raj@spicegarden.com",
    phone: "234 567 8903",
    address: "789 Curry Lane, City, State 12345",
    cuisine: "Indian",
    status: "pending",
    registrationDate: "2024-01-13",
    operatingHours: {
      monday: { open: "11:30 AM", close: "9:30 PM" },
      tuesday: { open: "11:30 AM", close: "9:30 PM" },
      wednesday: { open: "11:30 AM", close: "9:30 PM" },
      thursday: { open: "11:30 AM", close: "9:30 PM" },
      friday: { open: "11:30 AM", close: "10:30 PM" },
      saturday: { open: "12:00 PM", close: "10:30 PM" },
      sunday: { open: "12:00 PM", close: "9:00 PM" },
    },
    documents: ["license.pdf", "health-cert.pdf", "fire-safety.pdf"],
    businessLicense: "BL456789123",
    taxId: "TX654321987",
    description: "Authentic Indian cuisine with traditional spices and cooking methods.",
  },
  {
    id: "4",
    name: "Noodle Express",
    owner: "Li Wei",
    email: "li@noodleexpress.com",
    phone: "234 567 8904",
    address: "321 Dragon St, City, State 12345",
    cuisine: "Chinese",
    status: "pending",
    registrationDate: "2024-01-12",
    operatingHours: {
      monday: { open: "10:30 AM", close: "9:00 PM" },
      tuesday: { open: "10:30 AM", close: "9:00 PM" },
      wednesday: { open: "10:30 AM", close: "9:00 PM" },
      thursday: { open: "10:30 AM", close: "9:00 PM" },
      friday: { open: "10:30 AM", close: "10:00 PM" },
      saturday: { open: "11:00 AM", close: "10:00 PM" },
      sunday: { open: "11:00 AM", close: "8:30 PM" },
    },
    documents: ["license.pdf", "health-cert.pdf"],
    businessLicense: "BL321654987",
    taxId: "TX987321654",
    description: "Fast-casual Chinese noodle dishes with fresh vegetables and authentic sauces.",
  },
];

export const RegistrationRequests = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<Restaurant | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const filteredRequests = mockRegistrationRequests.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (id: string) => {
    console.log("Approving restaurant:", id);
    // In real app, make API call
  };

  const handleReject = (id: string, reason: string) => {
    console.log("Rejecting restaurant:", id, "Reason:", reason);
    // In real app, make API call
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
                  <TableHead>Owner</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((restaurant) => (
                  <TableRow key={restaurant.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{restaurant.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {restaurant.address}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{restaurant.owner}</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {restaurant.email}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {restaurant.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{restaurant.registrationDate}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending Review
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedRequest(restaurant)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Restaurant Registration Review</DialogTitle>
                              <DialogDescription>
                                Complete application details for {selectedRequest?.name}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedRequest && (
                              <div className="space-y-6">
                                {/* Basic Information */}
                                <div>
                                  <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Restaurant Name</Label>
                                      <p className="text-sm mt-1">{selectedRequest.name}</p>
                                    </div>
                                    <div>
                                      <Label>Owner Name</Label>
                                      <p className="text-sm mt-1">{selectedRequest.owner}</p>
                                    </div>
                                    <div>
                                      <Label>Email Address</Label>
                                      <p className="text-sm mt-1">{selectedRequest.email}</p>
                                    </div>
                                    <div>
                                      <Label>Phone Number</Label>
                                      <p className="text-sm mt-1">{selectedRequest.phone}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <Label>Business Address</Label>
                                      <p className="text-sm mt-1">{selectedRequest.address}</p>
                                    </div>
                                    <div>
                                      <Label>Cuisine Type</Label>
                                      <Badge variant="outline" className="mt-1">
                                        {selectedRequest.cuisine}
                                      </Badge>
                                    </div>
                                    <div>
                                      <Label>Application Date</Label>
                                      <p className="text-sm mt-1">{selectedRequest.registrationDate}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Operating Hours */}
                                <div>
                                  <Collapsible>
                                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                                      <h3 className="text-lg font-semibold">Operating Hours</h3>
                                      <Clock className="h-4 w-4" />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="space-y-2 mt-3">
                                      <div className="grid grid-cols-1 gap-2">
                                        <div className="flex justify-between items-center py-1 border-b">
                                          <span className="font-medium">Monday</span>
                                          <span className="text-sm text-muted-foreground">
                                            {selectedRequest.operatingHours.monday.open} - {selectedRequest.operatingHours.monday.close}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center py-1 border-b">
                                          <span className="font-medium">Tuesday</span>
                                          <span className="text-sm text-muted-foreground">
                                            {selectedRequest.operatingHours.tuesday.open} - {selectedRequest.operatingHours.tuesday.close}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center py-1 border-b">
                                          <span className="font-medium">Wednesday</span>
                                          <span className="text-sm text-muted-foreground">
                                            {selectedRequest.operatingHours.wednesday.open} - {selectedRequest.operatingHours.wednesday.close}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center py-1 border-b">
                                          <span className="font-medium">Thursday</span>
                                          <span className="text-sm text-muted-foreground">
                                            {selectedRequest.operatingHours.thursday.open} - {selectedRequest.operatingHours.thursday.close}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center py-1 border-b">
                                          <span className="font-medium">Friday</span>
                                          <span className="text-sm text-muted-foreground">
                                            {selectedRequest.operatingHours.friday.open} - {selectedRequest.operatingHours.friday.close}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center py-1 border-b">
                                          <span className="font-medium">Saturday</span>
                                          <span className="text-sm text-muted-foreground">
                                            {selectedRequest.operatingHours.saturday.open} - {selectedRequest.operatingHours.saturday.close}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center py-1">
                                          <span className="font-medium">Sunday</span>
                                          <span className="text-sm text-muted-foreground">
                                            {selectedRequest.operatingHours.sunday.open} - {selectedRequest.operatingHours.sunday.close}
                                          </span>
                                        </div>
                                      </div>
                                    </CollapsibleContent>
                                  </Collapsible>
                                </div>

                                {/* Rejection Reason */}
                                <div>
                                  <Label htmlFor="rejection-reason">Rejection Reason (if applicable)</Label>
                                  <Textarea
                                    id="rejection-reason"
                                    placeholder="Enter reason for rejection..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                            )}
                            <DialogFooter className="flex space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  if (selectedRequest && rejectionReason.trim()) {
                                    handleReject(selectedRequest.id, rejectionReason);
                                    setRejectionReason("");
                                  }
                                }}
                                disabled={!rejectionReason.trim()}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject Application
                              </Button>
                              <Button
                                onClick={() => {
                                  if (selectedRequest) {
                                    handleApprove(selectedRequest.id);
                                  }
                                }}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve Restaurant
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
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
