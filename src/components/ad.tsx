import { getTranslations } from "next-intl/server";
import { InfoRow } from "@/components/info/row";
import { ToolHeader } from "@/components/tool/header";
import type { ActiveDirectoryInfo } from "@/types/api";

function formatDate(iso: string | undefined, never: boolean, translations: { common: (key: string) => string }) {
  if (never) return translations.common("never");
  return iso ? new Date(iso).toLocaleDateString() : "—";
}

export async function CheckAd({ sciper, info }: { sciper: string; info: ActiveDirectoryInfo | null }) {
  const translations = {
    ad: await getTranslations("tools.ad"),
    common: await getTranslations("common"),
  };

  if (!info) {
    return (
      <div className="w-full max-w-3xl">
        <ToolHeader title={translations.ad("title", { sciper })} />
        <p className="text-sm text-muted-foreground">{translations.ad("noInfo", { sciper })}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl space-y-2 text-base">
      <ToolHeader title={translations.ad("title", { sciper })} />
      <InfoRow label={translations.ad("description")} value={info.description ?? "—"} />
      <InfoRow label={translations.ad("displayName")} value={info.displayName ?? "—"} />
      <InfoRow label={translations.ad("email")} value={info.mail ?? "—"} />
      <InfoRow label={translations.ad("upn")} value={info.userPrincipalName ?? "—"} />
      {info.sAMAccountName && (
        <InfoRow label={translations.ad("domainLogin")} value={`INTRANET\\${info.sAMAccountName}`} />
      )}
      <InfoRow
        label={translations.ad("accountControl")}
        value={
          <>
            {info.accountControlHex ? `0x${info.accountControlHex}` : "—"}
            {info.accountStatus && <> ({translations.ad(info.accountStatus)})</>}
          </>
        }
      />
      {info.uacFlags.length > 0 && (
        <ul className="ml-6 list-disc text-muted-foreground">
          {info.uacFlags.map((flag) => (
            <li key={flag}>{translations.ad(flag)}</li>
          ))}
        </ul>
      )}
      <InfoRow
        label={translations.ad("expires")}
        value={formatDate(info.accountExpiresISO, info.accountExpiresNever, translations)}
      />
      <InfoRow
        label={translations.ad("lastLogon")}
        value={formatDate(info.lastLogonISO, info.lastLogonNever, translations)}
      />
      <InfoRow
        label={translations.ad("pwdLastSet")}
        value={formatDate(info.pwdLastSetISO, info.pwdLastSetNever, translations)}
      />
      <InfoRow
        label={translations.ad("badPasswordTime")}
        value={formatDate(info.badPasswordTimeISO, info.badPasswordTimeNever, translations)}
      />
      {info.badPwdCount !== undefined && info.badPwdCount !== 0 && (
        <InfoRow label={translations.ad("badPwdCount")} value={info.badPwdCount} />
      )}
      <InfoRow
        label={translations.ad("exchangeMailbox")}
        value={info.hasExchangeMailbox ? translations.common("yes") : translations.common("no")}
      />
      <InfoRow label={translations.ad("mailboxLocation")} value={translations.ad(info.mailboxLocation)} />
      <InfoRow
        label={translations.ad("distrilog")}
        value={info.hasDistrilog ? translations.common("yes") : translations.common("no")}
      />
    </div>
  );
}
