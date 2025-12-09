import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Erasmus Helper - Turkish Universities",
  description: "Interactive web application to explore Erasmus agreements between Turkish and European universities. Find your perfect exchange destination!",
  keywords: ["erasmus", "university", "turkey", "exchange", "student", "europe", "partnerships"],
  authors: [{ name: "Erasmus Helper Team" }],
  openGraph: {
    title: "Erasmus Helper - Turkish Universities",
    description: "Explore 683 Erasmus partnerships across 5 Turkish universities",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

