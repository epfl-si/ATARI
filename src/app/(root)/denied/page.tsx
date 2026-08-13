import { ShieldX } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function Denied() {
  const translations = {
    denied: await getTranslations("pages.denied"),
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <ShieldX className="h-12 w-12 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{translations.denied("title")}</h1>
          <p className="text-muted-foreground">{translations.denied("description")}</p>
        </div>

        <p className="text-sm text-muted-foreground">
          {translations.denied("contact")}{" "}
          <a
            href="mailto:1234@epfl.ch"
            className="text-red-600 hover:text-red-700 underline font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            1234
          </a>
        </p>
      </div>
    </div>
  );
}
