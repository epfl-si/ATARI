import { getTranslations } from "next-intl/server";
import { ToolHeader } from "@/components/tool/header";
import type { LdapEntry, LdapInfo } from "@/types/api";

async function LdapAttributeList({ entry }: { entry: LdapEntry }) {
  const translations = {
    ldap: await getTranslations("tools.ldap"),
  };

  if (!entry) return <p className="text-sm text-muted-foreground">{translations.ldap("noEntry")}</p>;

  const attributes = Object.entries(entry).filter(([key]) => key !== "dn");
  if (attributes.length === 0)
    return <p className="text-sm text-muted-foreground">{translations.ldap("noAttributes")}</p>;

  return (
    <ul className="space-y-1 text-sm">
      {attributes.map(([key, value]) => (
        <li key={key}>
          <span className="font-medium">{key}</span>
          {Array.isArray(value) ? (
            <ul className="ml-6 list-disc text-muted-foreground">
              {value.map((v) => (
                <li key={String(v)}>{String(v)}</li>
              ))}
            </ul>
          ) : (
            <span className="text-muted-foreground"> : {String(value)}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

export async function CheckLdap({ sciper, info }: { sciper: string; info: LdapInfo }) {
  const translations = {
    ldap: await getTranslations("tools.ldap"),
  };

  return (
    <div className="w-full max-w-3xl space-y-8">
      <ToolHeader title={translations.ldap("title", { sciper })} />

      <div>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {translations.ldap("sectionLdap")}
        </h2>
        <LdapAttributeList entry={info.ldap} />
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {translations.ldap("sectionAutomap")}
        </h2>
        <LdapAttributeList entry={info.automap} />
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {translations.ldap("sectionScoldap")}
        </h2>
        <LdapAttributeList entry={info.scoldap} />
      </div>
    </div>
  );
}
