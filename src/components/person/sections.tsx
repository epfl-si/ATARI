"use client";

import { ChevronDown, ExternalLink, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { type ReactNode, type SyntheticEvent, useState } from "react";
import type { PersonTranslations } from "@/components/person/types";
import { cn } from "@/lib/utils";
import { getUnitAdminsIT } from "@/services/units";
import type { AccountStatus, Accred, ActiveDirectoryInfo, ApiPerson, PersonAddress, UnitAdmin } from "@/types/api";

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-6 first:mt-0">
      <h3 className="mb-2 border-b pb-1.5 text-sm font-semibold text-muted-foreground uppercase">{label}</h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="py-0.5 text-sm">
      <span className="font-semibold text-foreground">{label}</span>
      <span className="text-muted-foreground"> : </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function ToolLink({ href, label }: { href: string; label: string }) {
  const external = href.startsWith("http");

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-base hover:bg-muted transition-colors"
    >
      {label}
      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
    </a>
  );
}

function localizedLabel(item: { labelfr?: string; labelen?: string } | undefined, locale: string): string | undefined {
  if (!item) return undefined;
  return locale === "en" ? (item.labelen ?? item.labelfr) : (item.labelfr ?? item.labelen);
}

function AdminsIT({ unitId, translations }: { unitId: number; translations: Pick<PersonTranslations, "adminsIt"> }) {
  const [admins, setAdmins] = useState<UnitAdmin[] | null>(null);
  const [loading, setLoading] = useState(false);

  function handleToggle(event: SyntheticEvent<HTMLDetailsElement>) {
    if (!event.currentTarget.open || admins !== null || loading) return;
    setLoading(true);
    getUnitAdminsIT(unitId)
      .then(setAdmins)
      .finally(() => setLoading(false));
  }

  const explicit = (admins ?? []).filter((admin) => admin.attribution === "explicit");
  const inheritedByReason = new Map<string, UnitAdmin[]>();
  for (const admin of admins ?? []) {
    if (admin.attribution !== "inherited") continue;
    const key = admin.reasonname ?? admin.resource.name;
    inheritedByReason.set(key, [...(inheritedByReason.get(key) ?? []), admin]);
  }

  return (
    <details className="group/admins mt-2" onToggle={handleToggle}>
      <summary className="flex cursor-pointer list-none items-center gap-1.5 font-semibold text-foreground hover:text-primary">
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-destructive transition-transform group-open/admins:rotate-180" />
        {translations.adminsIt("title")}
      </summary>
      <div className="mt-1.5 space-y-3 pl-5">
        {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        {!loading && admins !== null && explicit.length === 0 && inheritedByReason.size === 0 && (
          <p>{translations.adminsIt("empty")}</p>
        )}
        {explicit.length > 0 && (
          <div>
            <p className="mb-1 font-semibold text-foreground">
              {translations.adminsIt("explicitFor", { unit: explicit[0].resource.name })}
            </p>
            <ul className="space-y-0.5">
              {explicit.map((admin) => (
                <li key={admin.person.sciper}>
                  <a href={`/${admin.person.sciper}`} className="hover:text-foreground hover:underline">
                    {admin.person.display} ({admin.person.sciper})
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {Array.from(inheritedByReason.entries()).map(([reason, reasonAdmins]) => (
          <div key={reason}>
            <p className="mb-1 font-semibold text-foreground">
              {translations.adminsIt("inheritedFrom", { unit: reason })}
            </p>
            <ul className="space-y-0.5">
              {reasonAdmins.map((admin) => (
                <li key={admin.person.sciper}>
                  <a href={`/${admin.person.sciper}`} className="hover:text-foreground hover:underline">
                    {admin.person.display} ({admin.person.sciper})
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  );
}

function AccredRow({
  accred,
  address,
  translations,
}: {
  accred: Accred;
  address?: PersonAddress;
  translations: Pick<PersonTranslations, "accred" | "adminsIt">;
}) {
  const locale = useLocale();
  const positionLabel = localizedLabel(accred.position, locale);
  const unitLabel = localizedLabel(accred.unit, locale);
  const hierarchy = accred.unit.path ? accred.unit.path.split(" ").filter(Boolean) : [];
  const addressLines = address ? [address.part1, address.part2, address.part3, address.part4].filter(Boolean) : [];
  const statusLabel = localizedLabel(accred.status, locale);

  return (
    <details className="group py-1.5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm hover:text-primary">
        <span>
          {positionLabel && <span className="font-semibold">{positionLabel}, </span>}
          <span className="text-foreground">{unitLabel}</span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-destructive transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 pl-1 text-sm text-muted-foreground sm:grid-cols-2">
        <div>
          {addressLines.length > 0 && (
            <p>
              {addressLines.map((line, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: address lines have no stable id
                <span key={i}>
                  {i === 0 ? <span className="font-semibold text-foreground">{line}</span> : line}
                  {i < addressLines.length - 1 && <br />}
                </span>
              ))}
            </p>
          )}
          <AdminsIT unitId={accred.unit.id} translations={translations} />
        </div>
        <div className="space-y-2">
          {hierarchy.length > 0 && (
            <p>
              <strong className="font-semibold text-foreground">{translations.accred("hierarchy")}</strong> :{" "}
              {hierarchy.map((acro, i) => (
                <span key={acro}>
                  {i > 0 && " › "}
                  <a
                    href={`http://search.epfl.ch/ubrowse.action?acro=${acro}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground hover:underline"
                  >
                    {acro}
                  </a>
                </span>
              ))}
            </p>
          )}
          {statusLabel && (
            <p>
              <strong className="font-semibold text-foreground">{translations.accred("status")}</strong> : {statusLabel}
            </p>
          )}
          {accred.startdate && (
            <p>
              <strong className="font-semibold text-foreground">{translations.accred("from")}</strong> :{" "}
              {accred.startdate}
              {accred.enddate && ` — ${translations.accred("to")} : ${accred.enddate}`}
            </p>
          )}
        </div>
      </div>
    </details>
  );
}

function formatDate(
  iso: string | undefined,
  isNever: boolean,
  translations: Pick<PersonTranslations, "common">,
): string {
  if (isNever) return translations.common("never");
  return iso ? new Date(iso).toLocaleDateString() : "—";
}

function accountStatusDotClass(status: AccountStatus | undefined): string {
  if (status === "ACCOUNT_ENABLED") return "bg-green-500";
  if (status === "ACCOUNT_DISABLED") return "bg-destructive";
  return "bg-muted-foreground";
}

export function GeneralSection({
  person,
  hasEmailAuth,
  translations,
}: {
  person: ApiPerson;
  hasEmailAuth: boolean;
  translations: PersonTranslations;
}) {
  return (
    <Section label={translations.sections("general")}>
      <div className="space-y-1">
        {person.gender && <InfoRow label={translations.fields("gender")} value={person.gender} />}
        <InfoRow
          label={translations.fields("emailAuth")}
          value={hasEmailAuth ? translations.common("yes") : translations.common("no")}
        />
        <InfoRow
          label={translations.fields("accredited")}
          value={person.isaccredited === false ? translations.common("no") : translations.common("yes")}
        />
      </div>
    </Section>
  );
}

export function AccreditationsSection({
  accreds,
  addresses,
  translations,
}: {
  accreds: Accred[];
  addresses?: PersonAddress[];
  translations: PersonTranslations;
}) {
  if (accreds.length === 0) return null;

  const addressByUnitId = new Map((addresses ?? []).map((address) => [address.unitid, address]));

  return (
    <Section label={translations.sections("accreditations")}>
      <div className="divide-y divide-border">
        {accreds.map((accred) => (
          <AccredRow
            key={`${accred.unit.id}-${accred.order}`}
            accred={accred}
            address={addressByUnitId.get(String(accred.unit.id))}
            translations={translations}
          />
        ))}
      </div>
    </Section>
  );
}

export function ActiveDirectorySection({
  adInfo,
  translations,
}: {
  adInfo: ActiveDirectoryInfo | null;
  translations: PersonTranslations;
}) {
  if (!adInfo) return null;

  return (
    <Section label={translations.sections("activeDirectory")}>
      <div className="space-y-1">
        {adInfo.sAMAccountName && (
          <InfoRow label={translations.ad("domainLogin")} value={`INTRANET\\${adInfo.sAMAccountName}`} />
        )}
        {adInfo.accountStatus && (
          <InfoRow
            label={translations.ad("accountControl")}
            value={
              <span className="inline-flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", accountStatusDotClass(adInfo.accountStatus))} />
                {translations.ad(adInfo.accountStatus)}
              </span>
            }
          />
        )}
        <InfoRow
          label={translations.ad("expires")}
          value={formatDate(adInfo.accountExpiresISO, adInfo.accountExpiresNever, translations)}
        />
        <InfoRow
          label={translations.ad("lastLogon")}
          value={formatDate(adInfo.lastLogonISO, adInfo.lastLogonNever, translations)}
        />
        <InfoRow
          label={translations.ad("pwdLastSet")}
          value={formatDate(adInfo.pwdLastSetISO, adInfo.pwdLastSetNever, translations)}
        />
        <InfoRow
          label={translations.ad("badPasswordTime")}
          value={formatDate(adInfo.badPasswordTimeISO, adInfo.badPasswordTimeNever, translations)}
        />
        {adInfo.badPwdCount !== undefined && adInfo.badPwdCount !== 0 && (
          <InfoRow label={translations.ad("badPwdCount")} value={adInfo.badPwdCount} />
        )}
      </div>
    </Section>
  );
}

export function ToolsSection({
  sciper,
  person,
  translations,
}: {
  sciper: string;
  person: ApiPerson;
  translations: PersonTranslations;
}) {
  const hasAccount = Boolean(person.account);
  const emailLocalPart = person.email ? person.email.replace("@epfl.ch", "") : sciper;

  return (
    <Section label={translations.sections("tools")}>
      <div className="flex flex-wrap gap-2">
        <ToolLink
          href={`https://accred.epfl.ch/#/catalog/persons/${sciper}`}
          label={translations.toolLabels("accred")}
        />
        {hasAccount && (
          <>
            <ToolLink href={`/check-ad/${sciper}`} label={translations.toolLabels("checkAd")} />
            <ToolLink href={`/check-ldap/${sciper}`} label={translations.toolLabels("checkLdap")} />
            <ToolLink
              href="https://entra.microsoft.com/?feature.msaljs=true#view/Microsoft_AAD_UsersAndTenants/UserManagementMenuBlade/~/AllUsers/menuId/"
              label={translations.toolLabels("entraId")}
            />
            <ToolLink
              href={`https://it.epfl.ch/backoffice/sys_user.do?sysparm_query=user_name=${sciper}`}
              label={translations.toolLabels("serviceNow")}
            />
            <ToolLink href={`https://people.epfl.ch/${emailLocalPart}`} label={translations.toolLabels("people")} />
            {person.email && (
              <ToolLink
                href={`https://mailwww.epfl.ch/emailStatus.cgi?query=${person.email}`}
                label={translations.toolLabels("checkEmail")}
              />
            )}
            <ToolLink
              href={`https://mycamipro.epfl.ch/admin/home.php?page=cmpcardmgt&sciper=${sciper}`}
              label={translations.toolLabels("camiproAdmin")}
            />
          </>
        )}
      </div>
    </Section>
  );
}
