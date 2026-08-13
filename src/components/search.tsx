"use client";

import { Loader2, Search, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { searchPerson } from "@/services/person";
import type { ApiPerson } from "@/types/api";

export function SearchBar() {
  const router = useRouter();
  const translations = {
    search: useTranslations("pages.home.search"),
  };

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ApiPerson[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Only bounce back to "/" if a search we drove had previously navigated away from it — never on
  // initial load, otherwise landing directly on /<sciper> would immediately redirect to "/".
  const hasSearchNavigatedRef = useRef(false);

  function handleQueryChange(value: string) {
    setQuery(value);

    if (value.trim().length < 3) {
      setResults([]);
      setShowDropdown(false);
      if (hasSearchNavigatedRef.current) {
        hasSearchNavigatedRef.current = false;
        router.replace("/", { scroll: false });
      }
      return;
    }

    setSearching(true);
    setShowDropdown(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const found = await searchPerson(value);
      setResults(found);
      setSearching(false);

      // Explicitly close the dropdown and navigate every time a single match comes back —
      // don't derive this from a value stored in state/effect deps, since two searches in a
      // row landing on the same sciper wouldn't produce a dependency change and would leave
      // the dropdown open through the (no-op) redirect.
      if (found.length === 1) {
        hasSearchNavigatedRef.current = true;
        setShowDropdown(false);
        router.push(`/${found[0].id}`, { scroll: false });
      } else if (hasSearchNavigatedRef.current) {
        hasSearchNavigatedRef.current = false;
        router.replace("/", { scroll: false });
      }
    }, 300);
  }

  function selectPerson(person: ApiPerson) {
    setQuery(person.name || person.display);
    setShowDropdown(false);
    hasSearchNavigatedRef.current = true;
    router.push(`/${person.id}`, { scroll: false });
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        placeholder={translations.search("placeholder")}
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        onFocus={() => results.length > 0 && setShowDropdown(true)}
        className="h-12 md:h-14 rounded-xl pl-12 pr-12 text-base md:text-lg focus-visible:ring-0"
      />
      {searching && (
        <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-muted-foreground" />
      )}

      {showDropdown && (
        <div className="absolute z-50 w-full bg-background border border-border rounded-xl shadow-lg overflow-hidden">
          {results.length === 0 && !searching && (
            <p className="px-4 py-4 text-sm text-center text-muted-foreground">{translations.search("noResults")}</p>
          )}
          {results.length > 0 &&
            results.slice(0, 5).map((person) => (
              <button
                key={person.id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectPerson(person);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors cursor-pointer",
                  person.isaccredited === false && "opacity-50",
                )}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted shrink-0">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{person.name || person.display}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {person.email ? `${person.email} · ` : ""}
                    {person.id}
                  </p>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
