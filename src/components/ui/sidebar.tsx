
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Link } from "react-router-dom"

// Import your icons
import {
  BarChart3,
  Book,
  Calendar,
  Copy,
  LayoutDashboard,
  ListChecks,
  LogOut,
  MessagesSquare,
  Plus,
  Settings,
  ShoppingBag,
  User2,
  MapPin,
  BedDouble,
  FileText,
  Route,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {}

export function Sidebar({ className }: SidebarProps) {
  const links = [
    {
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      title: "Dashboard",
    },
    {
      href: "/destinations",
      icon: <MapPin className="h-5 w-5" />,
      title: "Destinations",
    },
    {
      href: "/accommodations",
      icon: <BedDouble className="h-5 w-5" />,
      title: "Accommodations",
    },
    {
      href: "/events",
      icon: <Calendar className="h-5 w-5" />,
      title: "Events",
    },
    {
      href: "/reviews",
      icon: <MessagesSquare className="h-5 w-5" />,
      title: "Reviews",
    },
    {
      href: "/bookings",
      icon: <ListChecks className="h-5 w-5" />,
      title: "Bookings",
    },
    {
      href: "/itineraries",
      icon: <Route className="h-5 w-5" />,
      title: "Itineraries",
    },
    {
      href: "/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Analytics",
    },
    {
      href: "/cities",
      icon: <MapPin className="h-5 w-5" />,
      title: "Cities Explorer",
    },
  ];

  return (
    <div className="hidden border-r bg-gray-100/40 dark:bg-gray-800/40 lg:block">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mb-6 px-4 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-semibold tracking-tight">
              Travel Zimbabwe
            </h2>
          </div>
          <div className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="flex w-full items-center space-x-2 rounded-md px-4 py-3 text-sm font-medium transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-300"
              >
                {link.icon}
                <span>{link.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
