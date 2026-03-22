import type { Metadata } from "next";
import "./globals.css";
import TopNavBar from "@/components/layout/TopNavBar";
import BottomNavBar from "@/components/layout/BottomNavBar";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "VendTrack Dashboard",
  description: "VendingPulse Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-surface text-on-surface font-sans pb-32">
        <AuthProvider>
          <TopNavBar />
          {children}
          <BottomNavBar />
        </AuthProvider>
      </body>
    </html>
  );
}
