
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ReactQueryProvider from '@/lib/ReactQueryProvider';
import { Toaster } from "react-hot-toast";
// import Navbar from "@/components/navigation/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Casewise – Law Office Case Management Software | Streamline Legal Workflow",
  description:
    "Casewise is a modern SaaS Law Office Case Management System that helps lawyers manage cases, clients, documents, appointments, billing, and tasks effortlessly. Boost productivity with intelligent automation and secure cloud-based legal management.",
  keywords: [
    "Casewise",
    "Law Office Software",
    "Legal Case Management System",
    "Law Firm Management",
    "Legal SaaS",
    "Client Management",
    "Court Case Management",
    "Legal Billing Software",
    "Appointment Scheduling",
    "Legal Document Management",
    "Case Tracking Software",
    "Lawyer Productivity Tools",
  ],
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },

  openGraph: {
    title: "Casewise – Smart Law Office Case Management System",
    description:
      "Manage cases, clients, tasks, documents, and billing with ease. Casewise brings secure and efficient legal practice management to your fingertips.",
    url: "https://yourdomain.com",
    siteName: "Casewise",
    images: [
      {
        url: "/images/og-banner.png", // Put your landing page banner image
        width: 1200,
        height: 630,
        alt: "Casewise - Law Office Case Management Software",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Casewise – Law Office Management SaaS",
    description:
      "Casewise helps law firms streamline case tracking, appointments, document management, and billing—all in one powerful SaaS platform.",
    images: ["/images/og-banner.png"],
    creator: "@yourhandle",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  // Optional: Additional SEO
  category: "technology",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <Navbar/> */}
        
        <ReactQueryProvider>
        <Toaster position="top-right" />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
