import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Rai — Movies, Shows & Reviews",
    template: "%s · Rai",
  },
  description:
    "Rai picks what to watch next — movies and shows across theatres, Prime Video, Crunchyroll and Apple TV.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink font-sans">
        <Header />
        <main className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
