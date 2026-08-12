import { getTranslations } from "next-intl/server";
import { SearchBar } from "@/components/search";

export default async function Home() {
  const translations = {
    home: await getTranslations("pages.home"),
  };

  return (
    <div className="flex flex-col items-center px-6 pt-16">
      <SearchBar />
    </div>
  );
}
