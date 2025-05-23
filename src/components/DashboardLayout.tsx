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
    <div className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 w-full">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <MapPin className="h-8 w-8 text-amber-500" />
                <span className="ml-2 text-xl font-bold">Zimbabwe Tourism</span>
              </Link>
              <nav className="hidden md:ml-10 md:flex md:space-x-8">
                {navItems.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) =>
                      `text-sm transition-colors px-1 py-3 border-b-2 ${
                        isActive
                          ? "text-amber-500 border-amber-500 font-medium"
                          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url || `/placeholder.svg`} alt={user.user_metadata?.name || "Avatar"} />
                        <AvatarFallback>{user.user_metadata?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
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
                      <DropdownMenuItem key={item.href} onClick={() => navigate(item.href)}>
                        {item.label}
                        <User className="ml-auto h-4 w-4" />
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      Log out
                      <LogOut className="ml-auto h-4 w-4" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button variant="default">Sign In</Button>
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
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>
                      Explore Zimbabwe Tourism
                    </SheetDescription>
                  </SheetHeader>
                  <nav className="grid gap-4 text-sm mt-8">
                    {navItems.map((item) => (
                      <Link key={item.href} to={item.href} className="flex items-center space-x-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    {user && (
                      <>
                        <Link to="/dashboard" className="flex items-center space-x-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>Dashboard</span>
                        </Link>
                        <Link to="/settings" className="flex items-center space-x-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                          <Settings className="h-4 w-4 text-muted-foreground" />
                          <span>Settings</span>
                        </Link>
                        <Button variant="ghost" className="justify-start" onClick={handleSignOut}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Log Out
                        </Button>
                      </>
                    )}
                  </nav>
                  <SheetTrigger asChild>
                    <Button variant="ghost" className="absolute top-2 right-2">
                      <X className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
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
