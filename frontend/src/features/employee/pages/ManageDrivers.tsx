import { AlertTriangle, ArrowLeft, Search, UserCheck, UserPlus, UserX } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { driverService } from "../../../service/employee/driverService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/common/alert-dialog";
import { Avatar, AvatarFallback } from "../../../components/common/avatar";
import { Button } from "../../../components/common/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/common/card";
import { Input } from "../../../components/common/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/common/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/common/tabs";

interface Driver {
  driverId: number;
  firstname: string;
  lastname: string;
  availabilityStatus: string;
}

export const ManageDrivers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const [newDriver, setNewDriver] = useState({
    firstname: "",
    lastname: "",
  });

  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await driverService.getAllDrivers();
        setDrivers(data);
      } catch (error) {
        console.error('Failed to fetch drivers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  const getFilteredDrivers = (driverList: Driver[], searchTerm: string) => {
    return driverList.filter((driver) =>
      `${driver.firstname} ${driver.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleTerminate = (driver: Driver) => {
    setSelectedDriver(driver);
    setActionDialogOpen(true);
  };

  const confirmTerminate = async () => {
    if (!selectedDriver) return;

    try {
      await driverService.deleteDriver(selectedDriver.driverId);
      // Refresh the list
      const data = await driverService.getAllDrivers();
      setDrivers(data);
      toast.success(`${selectedDriver.firstname} ${selectedDriver.lastname} has been terminated`);
    } catch (error) {
      toast.error("Failed to terminate driver");
    }
    setActionDialogOpen(false);
    setSelectedDriver(null);
  };

  const hireNewDriver = async () => {
    if (!newDriver.firstname.trim() || !newDriver.lastname.trim()) {
      toast.error("Please enter both first name and last name");
      return;
    }

    try {
      await driverService.createDriver({
        firstname: newDriver.firstname.trim(),
        lastname: newDriver.lastname.trim(),
        availabilityStatus: "AVAILABLE"
      });
      // Refresh the list
      const data = await driverService.getAllDrivers();
      setDrivers(data);
      setNewDriver({ firstname: "", lastname: "" });
      toast.success(`${newDriver.firstname} ${newDriver.lastname} has been hired successfully`);
    } catch (error) {
      toast.error("Failed to hire driver");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate("/employee/driver-management")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Driver Management
        </Button>
        <div>
          <h1>Manage Drivers</h1>
          <p className="text-muted-foreground">Hire, terminate, and manage driver accounts</p>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Drivers</p>
                <p className="text-2xl font-bold text-green-600">{drivers.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Drivers</p>
                <p className="text-2xl font-bold text-blue-600">
                  {drivers.filter(d => d.availabilityStatus === "AVAILABLE").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Driver Management */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Management</CardTitle>
          <CardDescription>Manage all drivers - terminate existing ones and hire new ones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Hire New Driver Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Hire New Driver</h3>
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">First Name</label>
                  <Input
                    placeholder="Enter first name"
                    value={newDriver.firstname}
                    onChange={(e) => setNewDriver((prev) => ({ ...prev, firstname: e.target.value }))}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Last Name</label>
                  <Input
                    placeholder="Enter last name"
                    value={newDriver.lastname}
                    onChange={(e) => setNewDriver((prev) => ({ ...prev, lastname: e.target.value }))}
                  />
                </div>
                <Button onClick={hireNewDriver} className="bg-green-600 hover:bg-green-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Hire Driver
                </Button>
              </div>
            </div>

            {/* Current Drivers List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Current Drivers</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search drivers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Driver</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredDrivers(drivers, searchTerm).map((driver) => (
                      <TableRow key={driver.driverId}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                                {getInitials(`${driver.firstname} ${driver.lastname}`)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{`${driver.firstname} ${driver.lastname}`}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            driver.availabilityStatus === "AVAILABLE"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {driver.availabilityStatus}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTerminate(driver)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Termination Confirmation Dialog */}
      <AlertDialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span>Confirm Termination</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedDriver && (
                <>
                  Are you sure you want to terminate {selectedDriver.firstname} {selectedDriver.lastname}?
                  This action will remove the driver from active duty.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmTerminate} className="bg-red-600 hover:bg-red-700">
              <UserX className="h-4 w-4 mr-2" />
              Terminate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
