"use server";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { auth } from "@/services/auth";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <main className="flex flex-col h-screen justify-between">
      <Header user={session?.user} />
      <section className="mb-auto">{children}</section>
      <Footer />
    </main>
  );
}
