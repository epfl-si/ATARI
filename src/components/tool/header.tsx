"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function ToolHeader({ title }: { title: string }) {
  const router = useRouter();

  return (
    <div className="mb-6 flex items-center gap-0">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Back"
        className="ml-[-0.5rem] flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-md text-foreground transition-colors hover:text-muted-foreground"
      >
        <ArrowLeft className="h-7 w-7" />
      </button>
      <h1 className="text-3xl font-semibold">{title}</h1>
    </div>
  );
}
