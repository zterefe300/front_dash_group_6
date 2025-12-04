// src/features/restaurant/pages/DashboardLayout.tsx
import { useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { LucideIcon } from 'lucide-react';
import {
  Home,
  Menu,
  Settings,
  LogOut,
  ChevronRight,
  User,
  Phone,
  MapPin,
  Clock,
  Shield,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  onLogout?: () => void;
}

type NavigationItem = {
  title: string;
  icon: LucideIcon;
  path?: string;
  subItems?: {
    title: string;
    icon: LucideIcon;
    path: string;
  }[];
};

export default function DashboardLayout({ onLogout }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const basePath = '/restaurant';

  const buildFullPath = (path: string) =>
    `${basePath}/${path}`.replace(/\/{2,}/g, '/');

  const menuItems: NavigationItem[] = useMemo(
    () => [
      { title: 'Dashboard', icon: Home, path: 'dashboard' },
      { title: 'Menu Management', icon: Menu, path: 'menu' },
      { title: 'Business Actions', icon: Briefcase, path: 'business' },
      {
        title: 'Settings',
        icon: Settings,
        subItems: [
          { title: 'Restaurant Profile', icon: User, path: 'settings/profile' },
          { title: 'Contact Details', icon: Phone, path: 'settings/contact' },
          { title: 'Address & Location', icon: MapPin, path: 'settings/address' },
          { title: 'Operating Hours', icon: Clock, path: 'settings/hours' },
          { title: 'Account Security', icon: Shield, path: 'settings/security' },
        ],
      },
    ],
    []
  );

  const isActive = (path: string) => {
    const fullPath = buildFullPath(path);
    return (
      location.pathname === fullPath ||
      location.pathname.startsWith(`${fullPath}/`)
    );
  };

  const isParentActive = (subItems: { path: string }[]) =>
    subItems.some((item) => isActive(item.path));

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="px-4 py-2">
              <h2 className="text-primary font-bold">FrontDash Partner</h2>
              <p className="text-sm text-muted-foreground">
                Bella&apos;s Italian Kitchen
              </p>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      {item.subItems ? (
                        <Collapsible defaultOpen={isParentActive(item.subItems)}>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              isActive={isParentActive(item.subItems)}
                            >
                              <item.icon className="h-4 w-4" />
                              {item.title}
                              <ChevronRight className="ml-auto h-4 w-4" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.subItems.map((sub) => (
                                <SidebarMenuSubItem key={sub.path}>
                                  <SidebarMenuSubButton
                                    onClick={() =>
                                      navigate(buildFullPath(sub.path))
                                    }
                                    isActive={isActive(sub.path)}
                                  >
                                    <sub.icon className="h-4 w-4" />
                                    {sub.title}
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        <SidebarMenuButton
                          onClick={() =>
                            item.path && navigate(buildFullPath(item.path))
                          }
                          isActive={item.path ? isActive(item.path) : false}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.title}
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-hidden">
          <div className="flex h-full flex-col">
            <header className="border-b bg-background px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-lg font-semibold">Restaurant Dashboard</h1>
              </div>
            </header>

            <div className="flex-1 overflow-auto p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
