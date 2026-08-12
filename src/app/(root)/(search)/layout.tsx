"use server";
import type { ReactNode } from "react";
import { SearchBar } from "@/components/search";

export default async function SearchLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-10">
      <SearchBar />
      {children}
    </div>
  );
}
