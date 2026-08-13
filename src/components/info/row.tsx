import type { ReactNode } from "react";

export function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <li className="py-0.5 text-sm">
      <span className="font-semibold text-foreground">{label}</span>
      <span className="text-muted-foreground"> : </span>
      <span className="font-medium">{value}</span>
    </li>
  );
}
