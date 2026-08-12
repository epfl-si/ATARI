"use client";

import { Loader2, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";
import { getPersonBySciper } from "@/services/people";
import type { ApiPerson } from "@/types/api";

export function PersonDetails({ sciper }: { sciper: string }) {
  const [person, setPerson] = useState<ApiPerson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setPerson(null);

    getPersonBySciper(sciper).then((found) => {
      if (cancelled) return;
      setPerson(found);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [sciper]);

  if (loading) {
    return (
      <div className="mt-6 flex w-full max-w-xl items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!person) return null;

  return (
    <div className="mt-6 flex w-full max-w-xl items-center gap-4 rounded-xl border border-border p-6">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted">
        <User className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-lg font-semibold">{person.name || person.display}</p>
        {person.email && (
          <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            {person.email}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">#{person.id}</p>
      </div>
    </div>
  );
}
