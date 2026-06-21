"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";
import { ChatInterface } from "@/components/chat/ChatInterface";

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (showChat) {
    return <ChatInterface onBack={() => setShowChat(false)} />;
  }

  return (
    <AnimatePresence mode="wait">
      {!showChat && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        >
          <Navbar
            onGetStarted={() => setShowChat(true)}
            show={showContent}
          />
          <Hero onGetStarted={() => setShowChat(true)} />
          <Features />
          <HowItWorks />
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
