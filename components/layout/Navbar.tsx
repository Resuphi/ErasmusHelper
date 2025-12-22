"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Home, Map, GitCompare } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserSearch } from "@/components/user/UserSearch";
import { UserMenu } from "@/components/auth/UserMenu";
import { MessagesButton } from "@/components/auth/MessagesButton";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Map", href: "/map", icon: Map },
  { name: "Compare", href: "/compare", icon: GitCompare },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden sm:inline-block">
              Erasmus Helper
            </span>
          </Link>

          <div className="flex items-center space-x-1 sm:space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline-block">{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden md:block">
              <UserSearch />
            </div>
            <MessagesButton />
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}


