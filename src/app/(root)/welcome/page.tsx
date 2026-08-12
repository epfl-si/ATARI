import { getTranslations } from "next-intl/server";

export default async function Welcome() {
  const translations = {
    welcome: await getTranslations("pages.welcome"),
  };

  return (
    <div>
      <section className="container mx-auto px-6 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 max-w-xl">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
            {translations.welcome("title")}
          </h1>
        </div>
      </section>
    </div>
  );
}
