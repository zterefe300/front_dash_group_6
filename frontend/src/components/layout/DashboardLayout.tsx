import {
  Building2,
  CheckCircle,
  ChevronDown,
  Clock,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Settings2,
  ShoppingCart,
  Truck,
  UserPlus,
  Users,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext.js";
import { Badge } from "../common/badge.js";
import { Button } from "../common/button.js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../common/collapsible.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../common/dropdown-menu.js";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../common/sidebar.js";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface SubMenuItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
}

interface MenuItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  submenu?: SubMenuItem[];
}

const adminMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    route: "/employee/dashboard",
  },
  {
    title: "Restaurant Management",
    icon: Building2,
    route: "/employee/restaurant-management",
    submenu: [
      { title: "Registration Requests", icon: FileText, route: "/employee/registration-requests" },
      { title: "Restaurant Directory", icon: CheckCircle, route: "/employee/active-restaurants" },
      { title: "Withdrawal Requests", icon: Clock, route: "/employee/withdrawal-requests" },
    ],
  },
  {
    title: "Staff Management",
    icon: Users,
    route: "/employee/staff-management",
    submenu: [
      { title: "Staff Accounts", icon: Users, route: "/employee/staff-accounts" },
      { title: "Add New Staff", icon: UserPlus, route: "/employee/add-new-staff" },
      { title: "Manage Staff", icon: Settings2, route: "/employee/manage-staff" },
    ],
  },
  {
    title: "Driver Management",
    icon: Truck,
    route: "/employee/driver-management",
    submenu: [
      { title: "Active Drivers", icon: CheckCircle, route: "/employee/active-drivers" },
      { title: "Manage Drivers", icon: Settings2, route: "/employee/manage-drivers" },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    route: "/employee/admin-settings",
  },
];

const staffMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    route: "/employee/dashboard",
  },
  {
    title: "Order Management",
    icon: ShoppingCart,
    route: "/employee/order-management",
  },
  {
    title: "Account Settings",
    icon: Settings,
    route: "/employee/staff-account-settings",
  },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout, currentView, switchView } = useUser();

  const menuItems = currentView === "admin" ? adminMenuItems : staffMenuItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border p-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-sidebar-primary rounded-lg flex items-center justify-center shadow-gradient">
                <span className="text-sidebar-primary-foreground font-bold">FD</span>
              </div>
              <div>
                <h2 className="font-semibold">FrontDash</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant={currentView === "admin" ? "default" : "secondary"}>
                    {currentView === "admin" ? "Admin View" : "Staff View"}
                  </Badge>
                </div>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-2">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.submenu ? (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full" onClick={() => navigate(item.route)}>
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.title}
                          <ChevronDown className="ml-auto h-4 w-4" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-1 pl-6 mt-1">
                        {item.submenu.map((subItem) => (
                          <SidebarMenuButton
                            key={subItem.title}
                            className="text-sm"
                            onClick={() => navigate(subItem.route)}
                          >
                            <subItem.icon className="mr-2 h-3 w-3" />
                            {subItem.title}
                          </SidebarMenuButton>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton onClick={() => navigate(item.route)}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border p-4">
            <div className="space-y-2">
              <div className="text-sm">
                <p className="font-medium">{user?.name}</p>
                <p className="text-muted-foreground text-xs">{user?.username}</p>
              </div>

              {user?.role === "admin" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-between">
                      Switch View
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => switchView("admin")}>Admin View</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => switchView("staff")}>Staff View</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="border-b bg-card p-4 flex items-center shadow-sm">
            <SidebarTrigger />
          </header>
          <div className="flex-1 p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export { DashboardLayout };
