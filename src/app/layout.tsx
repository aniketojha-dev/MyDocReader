import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
    title: "MyDocReader - Document Intelligence",
  description:
    "Upload PDF, DOCX, and TXT documents and ask questions about your content using AI-powered RAG technology. Get precise answers with automatic citations.",
  openGraph: {
  title: "MyDocReader - Document Intelligence",
    description:
      "Upload documents and ask questions about your content using AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
