import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ir-tech-field-guide.up.railway.app"),
  title: "IR x Tech Field Guide",
  description: "Where an international relations major fits in tech: a passport quiz, five paths, USC classes, 31 open doors and 200+ faith-driven orgs.",
  openGraph: {
    title: "Every tech company is a foreign policy company now.",
    description: "If you study how the world works, they need you. Here's where you'd fit.",
    images: [{ url: "/og.png?v=3", width: 1200, height: 630, alt: "An open navy passport, its page stamped Policy, Defense, Trust, Global and Risk, with an Approved stamp" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", images: ["/og.png?v=3"] },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
