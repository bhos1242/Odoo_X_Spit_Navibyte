"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ArrowRightLeft,
  Warehouse,
  Users,
  Settings,
  LogOut,
  History,
  ClipboardList,
  Truck,
  Container,
  MapPin,
  Tags,
  ShoppingCart,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarGroups = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Receipts",
        href: "/dashboard/operations/receipts",
        icon: ArrowDownToLine,
      },
      {
        title: "Deliveries",
        href: "/dashboard/operations/deliveries",
        icon: ArrowUpFromLine,
      },
      {
        title: "All Operations",
        href: "/dashboard/operations",
        icon: ArrowRightLeft,
      },
    ],
  },
  {
    title: "Inventory",
    items: [
      {
        title: "Products",
        href: "/dashboard/inventory",
        icon: Package,
      },
      {
        title: "Categories",
        href: "/dashboard/categories",
        icon: Tags,
      },
      {
        title: "Warehouses",
        href: "/dashboard/warehouses",
        icon: Warehouse,
      },
      {
        title: "Locations",
        href: "/dashboard/inventory/locations",
        icon: MapPin,
      },
    ],
  },
  {
    title: "Reporting",
    items: [
      {
        title: "Stock Moves",
        href: "/dashboard/moves",
        icon: History,
      },
      {
        title: "Current Stock",
        href: "/dashboard/stock",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "Configuration",
    items: [
      {
        title: "Users",
        href: "/dashboard/users",
        icon: Users,
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
  {
    title: "Contacts",
    items: [
      {
        title: "Contacts",
        href: "/dashboard/contacts",
        icon: Users,
      },
    ],
  },
];

import { signOut } from "@/app/actions/auth";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12 min-h-screen border-r bg-background", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            IMS
          </h2>
          <div className="space-y-4">
            {sidebarGroups.map((group) => (
              <div key={group.title} className="px-3 py-2">
                <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  {group.title}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <Button
                      key={item.href}
                      variant={pathname === item.href ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href={item.href as any}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 px-3 w-full">
        <form action={signOut}>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}
