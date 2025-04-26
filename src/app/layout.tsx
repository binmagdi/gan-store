import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

import { ClerkProvider } from "@clerk/nextjs";

import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/providers/modal-provider";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Gan Store",
  description:
    "Welcome to Gan Store - Your one-stop shop for all men's fashion needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={montserrat.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ModalProvider>{children}</ModalProvider>
            <Toaster position="bottom-right" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
