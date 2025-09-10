import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Distinctive Academy - School Management System",
  description: "Professional cosmetology school management platform for Distinctive Academy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}