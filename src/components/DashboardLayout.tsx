
import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, LogOut, Settings, User, MapPin } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);

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
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/destinations" },
    { label: "Events", href: "/events" },
    { label: "Cities", href: "/cities" },
    { label: "Accommodations", href: "/accommodations" },
    { label: "Transport", href: "/transport" },
    { label: "Itineraries", href: "/itineraries" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Bookings", href: "/bookings" }
  ];

  const profileNavItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Settings", href: "/settings" },
    { label: "Admin Panel", href: "/admin" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-blue-950 dark:via-indigo-950 dark:to-gray-900">
      <header className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 w-full shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg shadow-md">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Zimbabwe Tourism
                </span>
              </Link>
              <nav className="hidden md:ml-10 md:flex md:space-x-8">
                {navItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) =>
                      `text-sm transition-all duration-200 px-3 py-2 rounded-lg ${
                        isActive
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium shadow-md"
                          : "text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <ModeToggle />
              {isMounted && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8 border-2 border-amber-200 dark:border-amber-700">
                        <AvatarImage src={user.user_metadata?.avatar_url || `/placeholder.svg`} alt={user.user_metadata?.name || "Avatar"} />
                        <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                          {user.user_metadata?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 border-amber-100 dark:border-amber-800" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium leading-none">{user.user_metadata?.name || "Guest"}</span>
                        <span className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {profileNavItems.map((item) => (
                      <DropdownMenuItem key={item.href} onClick={() => navigate(item.href)} className="hover:bg-amber-50 dark:hover:bg-amber-900/20">
                        {item.label}
                        <User className="ml-auto h-4 w-4" />
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      Log out
                      <LogOut className="ml-auto h-4 w-4" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md">
                    Sign In
                  </Button>
                </Link>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="md:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:w-64">
                  <SheetHeader>
                    <SheetTitle className="flex items-center">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg mr-2">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      Menu
                    </SheetTitle>
                    <SheetDescription>
                      Explore Zimbabwe Tourism
                    </SheetDescription>
                  </SheetHeader>
                  <nav className="grid gap-4 text-sm mt-8">
                    {navItems.map((item) => (
                      <Link key={item.href} to={item.href} className="flex items-center space-x-3 py-3 px-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all duration-200">
                        <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    {user && (
                      <>
                        <Link to="/dashboard" className="flex items-center space-x-3 py-3 px-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all duration-200">
                          <User className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          <span>Dashboard</span>
                        </Link>
                        <Link to="/settings" className="flex items-center space-x-3 py-3 px-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all duration-200">
                          <Settings className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          <span>Settings</span>
                        </Link>
                        <Button variant="ghost" className="justify-start text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={handleSignOut}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Log Out
                        </Button>
                      </>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}
