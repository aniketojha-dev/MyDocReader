"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Search, Sparkles, Shield, ArrowRight } from "lucide-react";
import { ChatInterface } from "@/components/chat/ChatInterface";

const features = [
  {
    icon: FileText,
    title: "Upload Documents",
    description: "Upload PDF, DOCX, or TXT files and extract content instantly.",
  },
  {
    icon: Search,
    title: "Ask Questions",
    description: "Ask questions about your documents using natural language.",
  },
  {
    icon: Sparkles,
    title: "Get Answers",
    description: "Receive context-aware answers powered by Retrieval-Augmented Generation.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "All document processing remains secure and reliable.",
  },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" },
});

const stagger = {
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (showChat) {
    return <ChatInterface onBack={() => setShowChat(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#f5f0eb] flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={mounted ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-[#faf7f3]/80 backdrop-blur-xl border-b border-[#e5ded7]"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-200/30">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-[#3d3833]">
                MyDocReader
              </span>
              <span className="text-[#e5ded7] hidden sm:inline">|</span>
              <span className="text-sm text-[#9c9590] hidden sm:inline">
                Built By Aniket Ojha
              </span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="mx-auto max-w-5xl w-full">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-[#3d3833]">
              WELCOME
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#6b6560] font-medium">
              Your Document Assistant To Help You
            </p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial="initial"
            animate={mounted ? "animate" : {}}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp(0)}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group rounded-2xl bg-[#faf7f3] border border-[#e5ded7] p-6 shadow-sm hover:shadow-lg hover:shadow-primary-200/20 hover:border-primary-300 transition-all duration-300"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 mb-4 group-hover:from-primary-200 group-hover:to-accent-200 transition-colors duration-300">
                  <feature.icon className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="text-sm font-semibold text-[#3d3833] mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#6b6560] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center"
          >
            <button
              onClick={() => setShowChat(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-primary-200/30 hover:shadow-xl hover:shadow-primary-200/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <FileText className="h-5 w-5" />
              Get Started
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="py-6 border-t border-[#e5ded7]"
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-center gap-4 text-sm text-[#9c9590]">
            <span>🔒 Private</span>
            <span className="text-[#e5ded7]">&bull;</span>
            <span>🛡 Secure</span>
            <span className="text-[#e5ded7]">&bull;</span>
            <span>⚡ Fast</span>
            <span className="text-[#e5ded7]">&bull;</span>
            <span>✨ Smart</span>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
