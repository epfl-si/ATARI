import type { ReactNode } from "react";

export function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <p>
      <strong className="font-semibold">{label}</strong> : {value}
    </p>
  );
}
