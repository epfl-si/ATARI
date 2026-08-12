"use client";

import { Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ToolHeader } from "@/components/tool/header";
import { Input } from "@/components/ui/input";
import { checkInventory } from "@/services/inventory";
import type { InventoryEntry } from "@/types/api";

function durationBreakdown(start: Date, end: Date) {
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

function Age({ purchaseDate }: { purchaseDate: string }) {
  const translations = {
    inventory: useTranslations("tools.inventory"),
  };
  const start = new Date(purchaseDate);
  const now = new Date();
  const ageDays = Math.floor((now.getTime() - start.getTime()) / 86400000);
  const itemYears = Math.floor(ageDays / 365);
  const { years, months, days } = durationBreakdown(start, now);

  const parts = [
    years > 0 && translations.inventory("years", { count: years }),
    months > 0 && translations.inventory("months", { count: months }),
    translations.inventory("remainingDays", { count: days }),
  ].filter(Boolean);

  return (
    <>
      <li>{itemYears >= 6 ? translations.inventory("ageWarning") : translations.inventory("ageOk")}</li>
      <li>{translations.inventory("purchaseDate", { date: purchaseDate })}</li>
      <li className="font-semibold">
        {translations.inventory("ageLine", { days: ageDays })} ({parts.join(", ")})
      </li>
    </>
  );
}

function EntryDetails({ entry }: { entry: InventoryEntry }) {
  const translations = {
    inventory: useTranslations("tools.inventory"),
  };
  const { ANSDT: _ansdt, SERGE, ...rest } = entry.features;

  return (
    <div className="mt-6 space-y-4">
      <p className="text-lg font-semibold">{entry.header}</p>
      <ul className="ml-6 list-disc space-y-1 text-sm">
        {entry.purchaseDate && <Age purchaseDate={entry.purchaseDate} />}
        {SERGE && (
          <li>
            <span className="font-semibold text-destructive">{translations.inventory("SERGE")}</span> : {SERGE}
          </li>
        )}
        {Object.entries(rest).map(([key, value]) => (
          <li key={key}>
            {translations.inventory.has(key) ? translations.inventory(key) : key} : {value}
          </li>
        ))}
      </ul>
      {entry.softwareStatus && <p className="font-semibold">{entry.softwareStatus}</p>}
    </div>
  );
}

export function CheckInventory({ initialCode }: { initialCode?: string }) {
  const translations = {
    inventory: useTranslations("tools.inventory"),
  };
  const router = useRouter();
  const [code, setCode] = useState(initialCode ?? "");
  const [entry, setEntry] = useState<InventoryEntry | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runSearch(value: string) {
    if (!value.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const found = await checkInventory(value);
      setEntry(found);
      setSearched(true);
      router.push(`/inventory/${value.trim().toUpperCase()}`, { scroll: false });
    } catch {
      setError(translations.inventory("invalidCode"));
      setEntry(null);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: only run once for the code coming from the URL
  useEffect(() => {
    if (initialCode) runSearch(initialCode);
  }, []);

  return (
    <div className="w-full max-w-3xl">
      <ToolHeader title={translations.inventory("title")} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(code);
        }}
        className="flex gap-2"
      >
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={translations.inventory("placeholder")}
          className="max-w-xs"
        />
        <button
          type="submit"
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {translations.inventory("check")}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      {!error && searched && !loading && !entry && (
        <p className="mt-4 text-sm text-muted-foreground">{translations.inventory("notFound")}</p>
      )}
      {entry && <EntryDetails entry={entry} />}
    </div>
  );
}
