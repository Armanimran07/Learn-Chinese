"use client";

import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

export interface CardProps extends HTMLMotionProps<"div"> {
  glass?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={{ y: -2 }}
        className={cn(
          "rounded-2xl p-6 shadow-sm border",
          glass ? "glass-dark" : "bg-card text-card-foreground border-border",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = "Card";
