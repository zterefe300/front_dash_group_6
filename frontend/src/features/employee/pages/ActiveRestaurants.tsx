import { ArrowLeft, Building2, Eye, Mail, Phone, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../../components/common/badge";
import { Button } from "../../../components/common/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/common/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/common/dialog";
import { Input } from "../../../components/common/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/common/table";
import { restaurantService } from "../../../service/employee/restaurantService";
import { Loader } from "../components/Loader";

interface Restaurant {
  restaurantId: number;
  name: string;
  cuisineType: string;
  contactPersonName: string;
  emailAddress: string;
  phoneNumber: string;
  status: string;
}

export const ActiveRestaurants = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [activeRestaurants, setActiveRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await restaurantService.getAllRestaurants();
        setActiveRestaurants(data);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  if (loading) {
    return <Loader />;
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
        <h1>Restaurant Directory</h1>
        <p className="text-muted-foreground">Manage all restaurant partners - view and update their status</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Restaurant Directory ({activeRestaurants.length})</span>
          </CardTitle>
          <CardDescription>View and manage all restaurant partners on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 flex-1">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by restaurant name, owner, or cuisine..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Restaurant</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeRestaurants.map((restaurant) => (
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
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedRestaurant(restaurant)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Restaurant Details</DialogTitle>
                              <DialogDescription>
                                Complete information for {selectedRestaurant?.name}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedRestaurant && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium">Restaurant Name</h4>
                                    <p className="text-sm text-muted-foreground">{selectedRestaurant.name}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Contact Person Name</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedRestaurant.contactPersonName}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Status</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedRestaurant.status}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Contact Email</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedRestaurant.emailAddress}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Phone</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedRestaurant.phoneNumber}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline">Close</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {activeRestaurants.length === 0 && (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No restaurants found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
