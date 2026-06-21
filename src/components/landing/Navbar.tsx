"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onGetStarted: () => void;
  show: boolean;
}

export function Navbar({ onGetStarted, show }: NavbarProps) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={show ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "bg-white/80 backdrop-blur-xl border-b border-slate-100"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-200">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">
              MyDocReader
            </span>
          </div>
          <Button
            onClick={onGetStarted}
            variant="gradient"
            size="sm"
          >
            Get Started
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
