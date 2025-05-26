
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
      icon: <ShoppingBag className="h-5 w-5" />,
      title: "Destinations",
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
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Admin
          </h2>
          <div className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="group flex w-full items-center space-x-2 rounded-md p-2 text-sm font-medium hover:underline"
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
