import type { Metadata } from "next";
import { Fredoka, Baloo_2 } from "next/font/google";
import { SessionProvider } from "@/components/providers/session-provider";
import "./globals.css";
import Navbar from "./_components/Navbar";

const fredokaOne = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: "400",
});

const baloo2 = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SheShips",
  description: "Discover your career path",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fredokaOne.variable} ${baloo2.variable} antialiased`}
      >
        <Navbar />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
