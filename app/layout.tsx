import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc/client";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Green Academy — Learn, Teach, Grow",
    template: "%s | Green Academy",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <TRPCProvider>
            {children}
            <Toaster
              position="bottom-right"
              richColors
              closeButton
            />
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

