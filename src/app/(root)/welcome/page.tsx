import Link from "next/link";
import { getTranslations } from "next-intl/server";

const linkClassName = "text-red-600 hover:text-red-700 underline font-medium";

export default async function Welcome() {
  const translations = {
    welcome: await getTranslations("pages.welcome"),
  };

  return (
    <div className="container mx-auto px-6 py-8 lg:py-8 max-w-3xl space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight">{translations.welcome("title")}</h1>
        <p className="text-xl font-medium">{translations.welcome("heading")}</p>
        <p className="text-muted-foreground">
          {translations.welcome.rich("acronym", {
            red: (chunks) => <span className="text-red-600">{chunks}</span>,
          })}
        </p>
        <p className="text-muted-foreground">{translations.welcome("description")}</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">{translations.welcome("gettingStarted.title")}</h2>
        <p className="text-muted-foreground">
          {translations.welcome.rich("gettingStarted.login", {
            link: (chunks) => (
              <a href="/api/auth" className={linkClassName}>
                {chunks}
              </a>
            ),
          })}
        </p>
        <p className="text-muted-foreground">{translations.welcome("gettingStarted.browse")}</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">{translations.welcome("goingFurther.title")}</h2>
        <p className="text-muted-foreground">
          {translations.welcome.rich("goingFurther.description", {
            repo: (chunks) => (
              <Link
                href="https://github.com/epfl-si/ATARI"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              >
                {chunks}
              </Link>
            ),
            issue: (chunks) => (
              <Link
                href="https://github.com/epfl-si/ATARI/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    </div>
  );
}
