"use client";

import { motion } from "framer-motion";
import { Upload, Split, MessageSquare, FileText } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Document",
    description:
      "Drag and drop or select your PDF, DOCX, or TXT file. Your document stays in your browser - no uploads to the cloud.",
    number: "01",
  },
  {
    icon: Split,
    title: "AI Processing",
    description:
      "Your document is split into semantic chunks and converted into AI-powered vector embeddings for intelligent search.",
    number: "02",
  },
  {
    icon: MessageSquare,
    title: "Ask Questions",
    description:
      "Type any question about your document in natural language. Our AI finds the most relevant sections to answer you.",
    number: "03",
  },
  {
    icon: FileText,
    title: "Get Citations",
    description:
      "Receive precise answers with automatic citations including file name, section, page, and paragraph references.",
    number: "04",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Get started in minutes with this simple workflow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-sm">
                    <step.icon className="h-7 w-7 text-primary-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white text-xs font-bold shadow-lg">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[calc(80%)] h-px bg-gradient-to-r from-primary-200 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
