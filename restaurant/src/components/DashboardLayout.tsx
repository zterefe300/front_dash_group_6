import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
} from './ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
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
import { Button } from './ui/button';

interface DashboardLayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

export function DashboardLayout({ children, onLogout }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      path: '/dashboard',
    },
    {
      title: 'Menu Management',
      icon: Menu,
      path: '/menu',
    },
    {
      title: 'Business Actions',
      icon: Briefcase,
      path: '/business',
    },
    {
      title: 'Settings',
      icon: Settings,
      subItems: [
        { title: 'Restaurant Profile', icon: User, path: '/settings/profile' },
        { title: 'Contact Details', icon: Phone, path: '/settings/contact' },
        { title: 'Address & Location', icon: MapPin, path: '/settings/address' },
        { title: 'Operating Hours', icon: Clock, path: '/settings/hours' },
        { title: 'Account Security', icon: Shield, path: '/settings/security' },
      ],
    },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (subItems: any[]) => 
    subItems.some(item => location.pathname === item.path);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="px-4 py-2">
              <h2 className="text-primary font-bold">FrontDash Partner</h2>
              <p className="text-sm text-muted-foreground">Bella's Italian Kitchen</p>
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
                            <SidebarMenuButton>
                              <item.icon className="h-4 w-4" />
                              {item.title}
                              <ChevronRight className="ml-auto h-4 w-4" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.subItems.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.path}>
                                  <SidebarMenuSubButton
                                    onClick={() => navigate(subItem.path)}
                                    isActive={isActive(subItem.path)}
                                  >
                                    <subItem.icon className="h-4 w-4" />
                                    {subItem.title}
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        <SidebarMenuButton
                          onClick={() => navigate(item.path)}
                          isActive={isActive(item.path)}
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
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <header className="border-b px-6 py-4 bg-background">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1>Restaurant Dashboard</h1>
              </div>
            </header>
            <div className="flex-1 overflow-auto p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}