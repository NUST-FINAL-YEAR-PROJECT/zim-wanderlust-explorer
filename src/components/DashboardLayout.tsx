
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
  MapPin,
  LayoutDashboard,
  Calendar,
  Heart,
  Hotel,
  Map,
  Route,
  BookOpen,
  Car,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const fullName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}` 
    : profile?.username || user?.email?.split('@')[0] || 'User';

  const initials = profile?.first_name && profile?.last_name
    ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    : profile?.username 
      ? profile.username.substring(0, 2).toUpperCase()
      : user?.email 
        ? user.email.substring(0, 2).toUpperCase() 
        : 'U';

  const sidebarVariants = {
    hidden: { x: "-100%" },
    visible: { 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30
      }
    }
  };

  const navItemVariants = {
    hover: { x: 5, transition: { type: "spring", stiffness: 300 } }
  };

  const Sidebar = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn(
      "flex h-full flex-col shadow-lg dark:bg-gray-800 bg-white border-r dark:border-gray-700 border-indigo-100",
      isMobile ? "w-full" : "w-64"
    )}>
      <div className="p-5 border-b dark:border-gray-700 border-indigo-100">
        <Link 
          to="/dashboard" 
          className="flex items-center space-x-3" 
          onClick={() => isMobile && setSidebarOpen(false)}
        >
          <div className="rounded-full bg-gradient-to-r from-indigo-600 to-indigo-800 p-2 text-white">
            <MapPin size={18} />
          </div>
          <h2 className="font-bold text-lg dark:text-white text-indigo-900">Zimbabwe Tourism</h2>
        </Link>
      </div>
      
      <div className="p-4 flex-1">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4 p-3 rounded-xl dark:bg-indigo-900/20 bg-indigo-50">
            <Avatar className="h-10 w-10 border-2 border-indigo-200">
              <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url || undefined} />
              <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm dark:text-white text-indigo-900">{fullName}</p>
              <p className="text-xs dark:text-indigo-300 text-indigo-400">{profile?.role || 'Tourist'}</p>
            </div>
          </div>
        </div>
        
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <motion.div whileHover="hover" variants={navItemVariants}>
                  <NavLink
                    to={item.href}
                    onClick={() => isMobile && setSidebarOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all",
                        isActive 
                          ? "bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-md" 
                          : "dark:hover:bg-gray-700 dark:text-white hover:bg-indigo-50 text-indigo-700"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.icon}
                        {item.label}
                        {isActive && <ChevronRight className="ml-auto h-5 w-5" />}
                      </>
                    )}
                  </NavLink>
                </motion.div>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t dark:border-gray-700 border-indigo-100 p-4">
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 h-9 dark:border-gray-700 dark:hover:bg-gray-700 border-indigo-200 hover:bg-indigo-50"
            onClick={() => {
              navigate("/settings");
              if (isMobile) setSidebarOpen(false);
            }}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 h-9 text-destructive hover:text-destructive dark:border-gray-700 border-indigo-200"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex dark:bg-gray-900 bg-indigo-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <motion.div 
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <Sidebar isMobile={true} />
          </motion.div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden dark:bg-gray-800 bg-white border-b dark:border-gray-700 border-indigo-100 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-1.5 rounded-md text-white">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="font-semibold dark:text-white text-indigo-900">Zimbabwe Tourism</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <ModeToggle />
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url || undefined} />
                        <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="z-50 bg-white dark:bg-gray-800">
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
        <header className="hidden lg:flex dark:bg-gray-800 bg-white border-b dark:border-gray-700 border-indigo-100 px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className="text-lg font-semibold dark:text-white text-indigo-900">
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
                        <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url || undefined} />
                        <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="z-50 bg-white dark:bg-gray-800">
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

        <main className="flex-1 overflow-y-auto p-6 dark:bg-gray-900 bg-indigo-50">
          {children}
        </main>
      </div>
    </div>
  );
}
