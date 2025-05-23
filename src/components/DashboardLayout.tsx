
import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  LogOut, 
  Settings, 
  User, 
  MapPin,
  LayoutDashboard,
  Calendar,
  Heart,
  Hotel,
  Map,
  Route,
  BookOpen,
  Car
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: "Destinations", href: "/destinations", icon: <MapPin className="h-5 w-5" /> },
    { label: "Events", href: "/events", icon: <Calendar className="h-5 w-5" /> },
    { label: "Cities", href: "/cities", icon: <Map className="h-5 w-5" /> },
    { label: "Accommodations", href: "/accommodations", icon: <Hotel className="h-5 w-5" /> },
    { label: "Transport", href: "/transport", icon: <Car className="h-5 w-5" /> },
    { label: "Itineraries", href: "/itineraries", icon: <Route className="h-5 w-5" /> },
    { label: "Wishlist", href: "/wishlist", icon: <Heart className="h-5 w-5" /> },
    { label: "Bookings", href: "/bookings", icon: <BookOpen className="h-5 w-5" /> }
  ];

  const Sidebar = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn(
      "flex h-full flex-col border-r bg-card",
      isMobile ? "w-full" : "w-64"
    )}>
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/dashboard" className="flex items-center gap-2" onClick={() => isMobile && setSidebarOpen(false)}>
          <div className="bg-primary p-2 rounded-lg">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">Zimbabwe Tourism</span>
        </Link>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={() => isMobile && setSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                isActive 
                  ? "bg-accent text-accent-foreground font-medium" 
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className="border-t p-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url || `/placeholder.svg`} />
              <AvatarFallback>
                {user.user_metadata?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">
                {user.user_metadata?.name || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
          
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2 h-9"
              onClick={() => {
                navigate("/settings");
                if (isMobile) setSidebarOpen(false);
              }}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2 h-9 text-destructive hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar isMobile={true} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header for Mobile */}
        <header className="lg:hidden bg-card border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-md">
                <MapPin className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Zimbabwe Tourism</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <ModeToggle />
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url || `/placeholder.svg`} />
                        <AvatarFallback>
                          {user.user_metadata?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex bg-card border-b px-6 py-3">
          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className="text-lg font-semibold">
                {navItems.find(item => location.pathname.startsWith(item.href))?.label || "Dashboard"}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <ModeToggle />
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url || `/placeholder.svg`} />
                        <AvatarFallback>
                          {user.user_metadata?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
