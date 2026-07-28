"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/", icon: Home },
    { name: "Learn", href: "/chapters", icon: BookOpen },
    { name: "Search", href: "/search", icon: Search },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe md:hidden bg-background/80 backdrop-blur-md border-t border-border shadow-[0_-8px_30px_rgb(0,0,0,0.05)]">
      <ul className="flex items-center justify-around h-16 px-2">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

          return (
            <li key={link.name} className="flex-1">
              <Link
                href={link.href}
                className="relative flex flex-col items-center justify-center w-full h-full space-y-1"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-active"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <link.icon
                  className={cn(
                    "w-6 h-6 transition-colors duration-200 z-10",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors duration-200 z-10",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {link.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
