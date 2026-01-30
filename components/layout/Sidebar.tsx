"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  Search,
  Settings,
  ChevronRight,
  Car,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const navigation = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Overview",
        href: "#overview",
        icon: LayoutDashboard,
      },
      {
        title: "Analytics",
        href: "#analytics",
        icon: BarChart3,
        children: [
          { title: "By County", href: "#analytics-county", icon: MapPin },
          { title: "By Manufacturer", href: "#analytics-make", icon: Car },
          { title: "Trends", href: "#analytics-trends", icon: TrendingUp },
        ],
      },
    ],
  },
  {
    title: "Data",
    items: [
      {
        title: "Explore",
        href: "#explore",
        icon: Search,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-card lg:block lg:w-64">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Car className="h-6 w-6 text-primary" />
            <span className="text-lg">EV Analytics</span>
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-4">
            {navigation.map((section) => (
              <div key={section.title}>
                <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </h4>
                <nav className="space-y-1">
                  {section.items.map((item) => (
                    <div key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                          pathname === item.href
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.children && (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                      </Link>
                      {item.children && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                                pathname === child.href
                                  ? "bg-accent text-accent-foreground"
                                  : "text-muted-foreground",
                              )}
                            >
                              <child.icon className="h-3 w-3" />
                              <span>{child.title}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator />

        {/* User Section */}
        <div className="p-4">
          <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-semibold">WA</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium">Washington State</p>
              <p className="text-xs text-muted-foreground">50K+ Vehicles</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
