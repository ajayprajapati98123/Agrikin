import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "../lib/i18n/i18n-context";
import { AppProvider } from "../lib/store/app-store";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { DhartiMaaFloatingButton } from "../components/dharti-maa/dharti-maa-button";

export const metadata: Metadata = {
  title: "ȺցɾìҠìղ | Intelligent Digital Agriculture Platform",
  description: "Next-generation agricultural technology platform for Indian farmers. AI crop detection, real-time weather intelligence, Krishi Connect marketplace, and Dharti Maa AI companion.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#083344" />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-cyan-200 selection:text-cyan-950">
        <I18nProvider>
          <AppProvider>
            {/* Header Navigation */}
            <Navbar />

            {/* Main Application Body */}
            <main className="flex-1">{children}</main>

            {/* Global Floating Round Dharti Maa AI at Bottom-Left */}
            <DhartiMaaFloatingButton />

            {/* Global Footer */}
            <Footer />
          </AppProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
