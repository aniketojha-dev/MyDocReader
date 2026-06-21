"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
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
        "bg-[#faf7f3]/90 backdrop-blur-xl border-b border-[#e5ded7]"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-200/30">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-[#3d3833]">
              MyDocReader
            </span>
            <span className="text-sm text-[#9c9590] hidden sm:inline">
              &mdash; Build By Aniket Ojha
            </span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
