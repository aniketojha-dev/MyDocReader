"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, FileText, Shield, Zap } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#f5f0eb] via-[#f0ece6] to-[#f5f0eb]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-200/30 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-300/10 rounded-full blur-3xl" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <Badge variant="default" className="px-4 py-1.5 text-sm">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            AI-Powered Document Intelligence
          </Badge>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#3d3833] mb-6"
        >
          Your Documents,
          <br />
          <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 bg-clip-text text-transparent">
            Supercharged with AI
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-[#6b6560] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Upload PDFs, DOCX, or TXT files and ask questions about your content.
          Get precise answers with automatic citations — no more searching through pages.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={onGetStarted}
            variant="gradient"
            size="lg"
            className="group text-base"
          >
            Start Reading Now
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-base"
            onClick={() => {
              document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Learn More
          </Button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto"
        >
          {[
            { icon: FileText, label: "PDF, DOCX & TXT", desc: "Multi-format support" },
            { icon: Zap, label: "Instant Answers", desc: "RAG-powered responses" },
            { icon: Shield, label: "100% Private", desc: "No cloud storage" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center p-4 rounded-2xl bg-[#faf7f3]/80 backdrop-blur-sm border border-[#e5ded7]"
            >
              <item.icon className="h-6 w-6 text-primary-500 mb-2" />
              <span className="text-sm font-semibold text-[#3d3833]">{item.label}</span>
              <span className="text-xs text-[#9c9590]">{item.desc}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
