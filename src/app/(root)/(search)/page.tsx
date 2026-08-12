import { getTranslations } from "next-intl/server";

export default async function Home() {
  const translations = {
    home: await getTranslations("pages.home"),
  };

  return <p className="mt-6 text-sm text-muted-foreground">{translations.home("hint")}</p>;
}
