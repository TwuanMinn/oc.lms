import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc/client";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "LMS — Learn, Teach, Grow",
    template: "%s | LMS",
  },
  description:
    "A modern Learning Management System. Discover courses, track progress, and earn certificates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <TRPCProvider>
          {children}
          <Toaster
            position="bottom-right"
            richColors
            closeButton
            theme="dark"
          />
        </TRPCProvider>
      </body>
    </html>
  );
}
