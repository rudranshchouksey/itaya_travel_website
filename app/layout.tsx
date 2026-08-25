import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { TripProvider } from "@/lib/stores/TripContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Itvaya",
    default: "Itvaya | Premium Travel Booking",
  },
  description: "Discover, plan, and book your next premium travel experience with Itvaya.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    title: "Itvaya | Premium Travel Booking",
    description: "Discover, plan, and book your next premium travel experience with Itvaya.",
    siteName: 'Itvaya',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Itvaya | Premium Travel Booking",
    description: "Discover, plan, and book your next premium travel experience with Itvaya.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <TripProvider>
            {children}
          </TripProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
