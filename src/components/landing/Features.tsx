"use client";

import { motion } from "framer-motion";
import {
  FileSearch,
  Brain,
  MessageSquare,
  Lock,
  BookOpen,
  ArrowUpDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: FileSearch,
    title: "Smart Document Parsing",
    description:
      "Extract text from PDF, DOCX, and TXT files with high accuracy. Preserve document structure, headings, and page numbers.",
    gradient: "from-primary-500 to-primary-400",
  },
  {
    icon: Brain,
    title: "Semantic Understanding",
    description:
      "Advanced AI embeddings understand the meaning behind your documents, not just keywords. Find relevant content with precision.",
    gradient: "from-accent-500 to-accent-400",
  },
  {
    icon: MessageSquare,
    title: "Intelligent Q&A",
    description:
      "Ask questions in natural language and get precise answers extracted from your documents. Every answer includes source citations.",
    gradient: "from-primary-600 to-accent-500",
  },
  {
    icon: Lock,
    title: "Complete Privacy",
    description:
      "Your documents never leave your browser. All processing, storage, and search happens in-memory. No cloud, no servers, no tracking.",
    gradient: "from-primary-400 to-primary-300",
  },
  {
    icon: BookOpen,
    title: "Automatic Citations",
    description:
      "Every answer includes file name, section, page number, and paragraph reference. Verify sources instantly.",
    gradient: "from-accent-400 to-accent-300",
  },
  {
    icon: ArrowUpDown,
    title: "Lightning Fast Search",
    description:
      "Vector similarity search retrieves the most relevant document sections in milliseconds for instant responses.",
    gradient: "from-primary-500 to-accent-500",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-[#f5f0eb]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#3d3833] mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-[#6b6560] max-w-2xl mx-auto">
            Powerful features designed to make document analysis effortless and insightful.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group h-full bg-[#faf7f3] border-[#e5ded7] hover:shadow-lg hover:shadow-primary-200/20 hover:border-primary-300 transition-all duration-300">
                <CardContent className="p-6">
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg shadow-primary-200/20`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#3d3833] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#6b6560] leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
