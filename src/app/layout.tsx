import type { Metadata } from "next";
import { Fredoka, Baloo_2 } from "next/font/google";
import { SessionProvider } from "@/components/providers/session-provider";
import { I18nProvider } from "@/lib/i18n";
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
  title: "+MSTEM",
  description:
    "Más M, más mujeres en STEM. Inspiramos, informamos y conectamos a mujeres y niñas con el mundo STEM.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${fredokaOne.variable} ${baloo2.variable} antialiased`}
      >
        <I18nProvider>
          <SessionProvider>
            <Navbar />
            {children}
          </SessionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
