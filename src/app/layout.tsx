import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import { cn } from "@/lib/utils";
export const dynamic = "force-dynamic";

import { SessionProvider } from "@/providers/session";
import { auth } from "@/services/auth";

const suisse = localFont({
  src: [
    {
      path: "../fonts/SuisseIntl-Regular-WebS.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/SuisseIntl-SemiBold-WebS.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-suisse",
});

export const metadata: Metadata = {
  title: "ATARI",
  description: "Annuaire technique et administratif des responsables informatiques de l'EPFL",
  icons: {
    icon: [
      {
        url: "https://epfl-si.github.io/elements/svg/epfl-logo.svg",
      },
    ],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  const session = await auth();

  return (
    <html lang={locale} className={cn("h-full", suisse.variable)}>
      <body className="antialiased h-full flex flex-col font-sans">
        <NextIntlClientProvider messages={messages}>
          <SessionProvider session={session}>{children}</SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
