import { ArrowRight, Truck, UserCheck, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../../components/common/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/common/card";
import { driverService } from "../../../service/employee/driverService";

export const DriverManagement = () => {
  const navigate = useNavigate();

  const [driverData, setDriverData] = useState({
    drivers: [] as any[],
    loading: true,
    error: null as string | null
  });

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        setDriverData(prev => ({ ...prev, loading: true, error: null }));
        const drivers = await driverService.getAllDrivers();

        setDriverData({
          drivers: drivers || [],
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Failed to fetch driver data:', error);
        setDriverData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load driver data'
        }));
      }
    };

    fetchDriverData();
  }, []);

  // Calculate stats from API data
  const activeDrivers = driverData.drivers.length;
  const availableDrivers = driverData.drivers.filter((d: any) => d.availabilityStatus === 'AVAILABLE').length;
  const busyDrivers = driverData.drivers.filter((d: any) => d.availabilityStatus === 'BUSY').length;

  if (driverData.error) {
    return (
      <div className="space-y-6">
        <div>
          <h1>Driver Management</h1>
          <p className="text-muted-foreground">
            Manage active drivers, hire new drivers, and handle terminations
          </p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-red-600 font-medium">Error loading driver data</div>
            <p className="text-sm text-muted-foreground mt-2">{driverData.error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>Driver Management</h1>
        <p className="text-muted-foreground">
          Manage active drivers, hire new drivers, and handle terminations
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate("/employee/active-drivers")}
        >
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-primary" />
              <span>Active Drivers</span>
            </CardTitle>
            <CardDescription>View and manage currently active delivery drivers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {driverData.loading ? '...' : `${activeDrivers} drivers currently active`}
                </p>
                <div className="flex space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Available: {driverData.loading ? '...' : availableDrivers}
                  </Badge>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    Busy: {driverData.loading ? '...' : busyDrivers}
                  </Badge>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate("/employee/manage-drivers")}
        >
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-primary" />
              <span>Manage Drivers</span>
            </CardTitle>
            <CardDescription>Hire, terminate, and manage driver accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {driverData.loading ? '...' : `${activeDrivers} total drivers`}
                </p>
                <div className="flex space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Available: {driverData.loading ? '...' : availableDrivers}
                  </Badge>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    Busy: {driverData.loading ? '...' : busyDrivers}
                  </Badge>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
