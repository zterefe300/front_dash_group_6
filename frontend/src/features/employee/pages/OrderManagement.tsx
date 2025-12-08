import {
  CheckCircle,
  Clock,
  DollarSign,
  History,
  Loader2,
  MapPin,
  Package,
  Search,
  User,
  UserCheck,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../../../components/common/badge";
import { Button } from "../../../components/common/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/common/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/common/dialog";
import { Input } from "../../../components/common/input";
import { Label } from "../../../components/common/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/common/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/common/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/common/tabs";
import { driverService } from "../../../service/employee/driverService";
import { orderService } from "../../../service/employee/orderService";

interface Order {
  orderId: string;
  restaurant: {
    restaurantId: number;
    name: string;
    cuisineType: string;
    pictureUrl?: string;
    addressId: number;
    phoneNumber?: string;
    contactPersonName?: string;
    emailAddress?: string;
    status: string;
  } | null;
  customer: string;
  customerPhone?: string;
  deliveryAddress: {
    addressId: number;
    streetAddress: string;
    bldg?: string;
    city: string;
    state: string;
    zipCode: string;
  } | null;
  items: {
    menuItemId: number;
    categoryId: number;
    itemName: string;
    pictureUrl?: string;
    price: number;
    availability: boolean;
  }[];
  total: number;
  status:
    | "pending"
    | "preparing"
    | "ready"
    | "out_for_delivery"
    | "delivered"
    | "not_delivered"
    | "cancelled";
  orderTime: string;
  assignedDriver: {
    driverId: number;
    firstname: string;
    lastname: string;
    availabilityStatus: string;
  } | null;
  estimatedDelivery?: string;
  deliveryTime?: string;
}

interface Driver {
  driverId: number;
  firstname: string;
  lastname: string;
  availabilityStatus: string;
}

export const OrderManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [statusChangeDialog, setStatusChangeDialog] = useState<{
    isOpen: boolean;
    orderId: string;
    newStatus: string;
    currentStatus: string;
  }>({
    isOpen: false,
    orderId: "",
    newStatus: "",
    currentStatus: "",
  });

  const [errorDialog, setErrorDialog] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });

  const [orderData, setOrderData] = useState({
    orderQueue: [] as Order[],
    activeOrders: [] as Order[],
    orderHistory: [] as Order[],
    drivers: [] as Driver[],
    loading: true,
    error: null as string | null,
  });

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setOrderData((prev) => ({ ...prev, loading: true, error: null }));

        // Fetch orders and drivers
        const [pendingNoDriver, outForDeliveryOrders, deliveredOrders, notDeliveredOrders, drivers] = await Promise.all([
          orderService.getOrdersByStatus("PENDING", false), // orderQueue: PENDING orders with no drivers
          orderService.getOrdersByStatus("OUT_FOR_DELIVERY", true), //activeOrders: OUT_FOR_DELIVERY orders with drivers
          orderService.getOrdersByStatus("DELIVERED", true), // orderHistory: DELIVERED orders
          orderService.getOrdersByStatus("NOT_DELIVERED", true), // orderHistory: NOT_DELIVERED orders
          driverService.getAllDrivers(),
        ]);

        // Transform API data to match our Order interface
        const transformOrder = (apiOrder: any): Order => ({
          orderId: apiOrder.orderId,
          customer: apiOrder.customerName,
          customerPhone: apiOrder.customerPhone,
          restaurant: apiOrder.restaurant,
          deliveryAddress: apiOrder.deliveryAddress,
          items: apiOrder.items || [],
          total: parseFloat(apiOrder.totalAmount),
          status: apiOrder.orderStatus.toLowerCase(),
          orderTime: apiOrder.orderTime,
          assignedDriver: apiOrder.assignedDriver,
          estimatedDelivery: apiOrder.estimatedDeliveryTime,
          deliveryTime: apiOrder.deliveryTime,
        });

        setOrderData({
          orderQueue: pendingNoDriver.map(transformOrder),
          activeOrders: outForDeliveryOrders.map(transformOrder),
          orderHistory: [...deliveredOrders.map(transformOrder), ...notDeliveredOrders.map(transformOrder)],
          drivers: drivers || [],
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Failed to fetch order data:", error);
        setOrderData((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load order data",
        }));
      }
    };

    fetchOrderData();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, icon: Clock, text: "Pending" },
      preparing: { variant: "outline" as const, icon: Package, text: "Preparing" },
      ready: { variant: "default" as const, icon: CheckCircle, text: "Ready" },
      out_for_delivery: { variant: "default" as const, icon: MapPin, text: "Out for Delivery" },
      delivered: { variant: "default" as const, icon: CheckCircle, text: "Delivered" },
      not_delivered: { variant: "destructive" as const, icon: Clock, text: "Not Delivered" },
      cancelled: { variant: "destructive" as const, icon: Clock, text: "Cancelled" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant}>
        <Icon className="mr-1 h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const handleAssignDriver = async () => {
    if (selectedOrder && selectedDriver) {
      try {
        const driverId = parseInt(selectedDriver);
        if (isNaN(driverId)) {
          toast.error("Invalid driver selected");
          return;
        }

        // Call API to assign driver
        await orderService.assignDriver(selectedOrder.orderId, driverId);

        // Update local state optimistically
        setOrderData((prev) => {
          const updatedOrder = {
            ...selectedOrder,
            assignedDriver: orderData.drivers.find((d) => d.driverId === driverId)
              ? {
                  driverId: driverId,
                  firstname: orderData.drivers.find((d) => d.driverId === driverId)?.firstname || "",
                  lastname: orderData.drivers.find((d) => d.driverId === driverId)?.lastname || "",
                  availabilityStatus: "BUSY",
                }
              : null,
            status: "out_for_delivery" as Order["status"],
          };

          // Remove from orderQueue and add/update in activeOrders (prevent duplicates)
          const filteredOrderQueue = prev.orderQueue.filter((order) => order.orderId !== selectedOrder.orderId);
          const filteredActiveOrders = prev.activeOrders.filter((order) => order.orderId !== selectedOrder.orderId);

          return {
            ...prev,
            orderQueue: filteredOrderQueue,
            activeOrders: [...filteredActiveOrders, updatedOrder],
            drivers: prev.drivers.map((driver) =>
              driver.driverId === driverId ? { ...driver, availabilityStatus: "BUSY" } : driver
            ),
          };
        });

        toast.success(`Order ${selectedOrder.orderId} assigned to driver`);
        setSelectedOrder(null);
        setSelectedDriver("");
      } catch (error) {
        console.error("Failed to assign driver:", error);
        toast.error("Failed to assign driver");
      }
    }
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    const order = orderData.activeOrders.find((o) => o.orderId === orderId);
    if (!order) return;

    // Show confirmation dialog for status changes from "out_for_delivery"
    if (order.status === "out_for_delivery" && (newStatus === "delivered" || newStatus === "not_delivered")) {
      setStatusChangeDialog({
        isOpen: true,
        orderId,
        newStatus,
        currentStatus: order.status,
      });
    } else {
      // Direct update for other status changes
      updateOrderStatus(orderId, newStatus);
    }
  };

  const confirmStatusChange = async () => {
    const { orderId, newStatus } = statusChangeDialog;

    // Check if delivery time is set when changing to "delivered"
    if (newStatus === "delivered") {
      const order = orderData.activeOrders.find((o) => o.orderId === orderId);
      if (!order?.deliveryTime) {
        setErrorDialog({
          isOpen: true,
          message: "Please update the Delivery Time before marking as Delivered.",
        });
        setStatusChangeDialog({ isOpen: false, orderId: "", newStatus: "", currentStatus: "" });
        return;
      }
    }

    await updateOrderStatus(orderId, newStatus);
    setStatusChangeDialog({ isOpen: false, orderId: "", newStatus: "", currentStatus: "" });
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Send status in uppercase to match backend expectations
      const uppercaseStatus = newStatus.toUpperCase();
      await orderService.updateOrderStatus(orderId, uppercaseStatus);

      // Update local state
      setOrderData((prev) => {
        const orderToMove = prev.activeOrders.find((order) => order.orderId === orderId);
        if (!orderToMove) return prev;

        const updatedOrder = { ...orderToMove, status: newStatus as Order["status"] };

        // If status is delivered or not_delivered, move to orderHistory and set driver back to available
        if (newStatus === "delivered" || newStatus === "not_delivered") {
          const driverId = orderToMove.assignedDriver?.driverId;
          return {
            ...prev,
            activeOrders: prev.activeOrders.filter((order) => order.orderId !== orderId),
            orderHistory: [...prev.orderHistory, updatedOrder],
            drivers: driverId ? prev.drivers.map((driver) =>
              driver.driverId === driverId ? { ...driver, availabilityStatus: "AVAILABLE" } : driver
            ) : prev.drivers,
          };
        } else {
          // Otherwise, just update the status in activeOrders
          return {
            ...prev,
            activeOrders: prev.activeOrders.map((order) =>
              order.orderId === orderId ? updatedOrder : order
            ),
          };
        }
      });

      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const updateOrderDeliveryTime = (orderId: string, newDeliveryTime: string) => {
    setOrderData((prev) => ({
      ...prev,
      activeOrders: prev.activeOrders.map((order) =>
        order.orderId === orderId ? { ...order, deliveryTime: newDeliveryTime } : order
      ),
    }));
    toast.success("Delivery time updated successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Order Management</h1>
        <p className="text-muted-foreground">Manage orders from queue to delivery completion.</p>
      </div>

      <Tabs defaultValue="queue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="queue">Order Queue</TabsTrigger>
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="history">Order History</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Order Queue</span>
                <Badge variant="secondary">{orderData.loading ? "..." : orderData.orderQueue.length}</Badge>
              </CardTitle>
              <CardDescription>New orders waiting to be processed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Restaurant</TableHead>
                      <TableHead>Delivery Address</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderData.loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                          <p className="text-muted-foreground">Loading orders...</p>
                        </TableCell>
                      </TableRow>
                    ) : orderData.orderQueue.length > 0 ? (
                      orderData.orderQueue.map((order) => (
                        <TableRow key={order.orderId}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.orderId}</p>
                              <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-muted-foreground" />
                              {order.customer}
                            </div>
                          </TableCell>
                          <TableCell>{order.restaurant?.name || "Unknown Restaurant"}</TableCell>
                          <TableCell>
                            {order.deliveryAddress
                              ? `${order.deliveryAddress.bldg ? order.deliveryAddress.bldg + " " : ""}${order.deliveryAddress.streetAddress}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state}`
                              : "Unknown"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />$
                              {order.total.toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell>{order.orderTime}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="default" size="sm" onClick={() => setSelectedOrder(order)}>
                                  Process
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Process Order</DialogTitle>
                                  <DialogDescription>
                                    Review order details and assign a driver
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  {selectedOrder && (
                                    <div className="p-4 bg-muted rounded-lg">
                                      <h4 className="font-medium mb-2">Order Summary</h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <p>
                                              <strong>Order:</strong> {selectedOrder.orderId}
                                            </p>
                                            <p>
                                              <strong>Customer:</strong> {selectedOrder.customer}
                                            </p>
                                            <p>
                                              <strong>Restaurant:</strong>{" "}
                                              {selectedOrder.restaurant?.name || "Unknown Restaurant"}
                                            </p>
                                          </div>
                                          <div>
                                            <p>
                                              <strong>Total:</strong> ${selectedOrder.total.toFixed(2)}
                                            </p>
                                            <p>
                                              <strong>Time:</strong> {selectedOrder.orderTime}
                                            </p>
                                          </div>
                                        </div>
                                        <div>
                                          <p>
                                            <strong>Delivery Address:</strong>{" "}
                                            {selectedOrder.deliveryAddress
                                              ? `${selectedOrder.deliveryAddress.streetAddress}, ${selectedOrder.deliveryAddress.city}, ${selectedOrder.deliveryAddress.state} ${selectedOrder.deliveryAddress.zipCode}`
                                              : "Unknown Address"}
                                          </p>
                                        </div>
                                        <div>
                                          <p>
                                            <strong>Items:</strong>
                                          </p>
                                          <ul className="list-disc list-inside ml-2 space-y-1">
                                            {selectedOrder.items.map((item, index) => (
                                              <li key={index}>{item.itemName}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  <div className="space-y-2">
                                    <Label>Assign Driver</Label>
                                    <Select
                                      key={selectedOrder?.orderId}
                                      value={selectedDriver}
                                      onValueChange={setSelectedDriver}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Choose a driver" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {orderData.drivers
                                          .filter((driver) => driver.availabilityStatus === "AVAILABLE")
                                          .map((driver) => (
                                            <SelectItem
                                              key={driver.driverId}
                                              value={driver.driverId.toString()}
                                            >
                                              {driver.firstname} {driver.lastname}
                                            </SelectItem>
                                          ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="flex justify-end space-x-2">
                                    <Button variant="outline">Cancel</Button>
                                    <Button onClick={handleAssignDriver} disabled={!selectedDriver}>
                                      <UserCheck className="h-4 w-4 mr-2" />
                                      Assign Driver
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <p className="text-muted-foreground">No orders in queue</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Active Orders</span>
                <Badge variant="default">{orderData.loading ? "..." : orderData.activeOrders.length}</Badge>
              </CardTitle>
              <CardDescription>Orders currently being delivered</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search active orders..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Restaurant</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>ETA</TableHead>
                      <TableHead>Delivery Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderData.loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                          <p className="text-muted-foreground">Loading active orders...</p>
                        </TableCell>
                      </TableRow>
                    ) : orderData.activeOrders.length > 0 ? (
                      orderData.activeOrders.map((order) => (
                        <TableRow key={order.orderId}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.orderId}</p>
                              <p className="text-sm text-muted-foreground">${order.total.toFixed(2)}</p>
                            </div>
                          </TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{order.restaurant?.name || "Unknown Restaurant"}</TableCell>
                          <TableCell>
                            {order.assignedDriver ? (
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                {order.assignedDriver.firstname} {order.assignedDriver.lastname}
                              </div>
                            ) : (
                              <Badge variant="secondary">Not Assigned</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{order.estimatedDelivery || "Not set"}</span>
                          </TableCell>
                          <TableCell>
                            {order.deliveryTime ? (
                              <Input
                                type="time"
                                value={order.deliveryTime}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  updateOrderDeliveryTime(order.orderId, e.target.value)
                                }
                                className="w-32"
                              />
                            ) : (
                              <Input
                                type="time"
                                placeholder="Set delivery time"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  updateOrderDeliveryTime(order.orderId, e.target.value)
                                }
                                className="w-32"
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(value: string) => handleStatusChange(order.orderId, value)}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="not_delivered">Not Delivered</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <p className="text-muted-foreground">No active orders</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>Order History</span>
                <Badge variant="secondary">{orderData.loading ? "..." : orderData.orderHistory.length}</Badge>
              </CardTitle>
              <CardDescription>Completed and cancelled orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search order history..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Restaurant</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderData.loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                          <p className="text-muted-foreground">Loading order history...</p>
                        </TableCell>
                      </TableRow>
                    ) : orderData.orderHistory.length > 0 ? (
                      orderData.orderHistory.map((order) => (
                        <TableRow key={order.orderId}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.orderId}</p>
                              <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                            </div>
                          </TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{order.restaurant?.name || "Unknown Restaurant"}</TableCell>
                          <TableCell>
                            {order.assignedDriver && (
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                {order.assignedDriver.firstname} {order.assignedDriver.lastname}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />$
                              {order.total.toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell>{order.orderTime}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <p className="text-muted-foreground">No order history</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={statusChangeDialog.isOpen} onOpenChange={(open) => !open && setStatusChangeDialog({ isOpen: false, orderId: "", newStatus: "", currentStatus: "" })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the order status from "{statusChangeDialog.currentStatus.replace('_', ' ')}" to "{statusChangeDialog.newStatus.replace('_', ' ')}"?
              {statusChangeDialog.newStatus === "delivered" && (
                <span className="block mt-2 font-medium text-amber-600">
                   Note: Please ensure the Delivery Time is set before marking as Delivered.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={errorDialog.isOpen} onOpenChange={(open) => !open && setErrorDialog({ isOpen: false, message: "" })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="text-red-600 font-medium">{errorDialog.message}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction autoFocus onClick={() => setErrorDialog({ isOpen: false, message: "" })}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
