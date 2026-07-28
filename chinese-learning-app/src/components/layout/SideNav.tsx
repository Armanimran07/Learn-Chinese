"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function SideNav() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/", icon: Home },
    { name: "Chapters", href: "/chapters", icon: BookOpen },
    { name: "Search", href: "/search", icon: Search },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-border glass p-6 z-50">
      <div className="mb-10 pl-4">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          HanziMaster
        </h1>
      </div>
      
      <ul className="flex-1 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

          return (
            <li key={link.name}>
              <Link
                href={link.href}
                className="relative flex items-center space-x-3 px-4 py-3 rounded-xl group transition-all"
              >
                {isActive && (
                  <motion.div
                    layoutId="side-nav-active"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <link.icon
                  className={cn(
                    "w-5 h-5 transition-colors duration-200 z-10",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={cn(
                    "font-medium transition-colors duration-200 z-10",
                    isActive ? "text-primary font-semibold" : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {link.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      
      <div className="mt-auto">
        {/* User profile snippet or theme toggler can go here */}
      </div>
    </nav>
  );
}
