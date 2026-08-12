"use client";

import { Check, ChevronDown, Copy, ExternalLink, Loader2, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { InfoRow } from "@/components/info/row";
import { cn } from "@/lib/utils";
import { getAccreditations, getHasEmailAuthorization } from "@/services/accreds";
import { getActiveDirectoryInfo } from "@/services/ad";
import { getPersonBySciper } from "@/services/person";
import type { Accred, ActiveDirectoryInfo, ApiPerson } from "@/types/api";

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex items-center justify-between gap-3 py-1.5 text-base">
      <span className="text-muted-foreground">{label}</span>
      <button
        type="button"
        onClick={copy}
        className="flex items-center gap-2 font-medium hover:text-primary cursor-copy"
      >
        <span className="truncate">{value}</span>
        {copied ? (
          <Check className="h-4 w-4 shrink-0 text-green-600" />
        ) : (
          <Copy className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </button>
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

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 first:mt-0">
      <h3 className="mb-2 text-lg font-semibold">{label}</h3>
      {children}
    </div>
  );
}

function AccredRow({ accred, translations }: { accred: Accred; translations: { accred: (key: string) => string } }) {
  const title = [accred.position?.labelfr, accred.unit.labelfr].filter(Boolean).join(", ");
  const hierarchy = accred.unit.path ? accred.unit.path.split(" ").filter(Boolean) : [];

  return (
    <details className="group py-2">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 hover:text-primary">
        <span>{title}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-2 space-y-1 pl-1 text-sm text-muted-foreground">
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
        {accred.status?.labelfr && (
          <p>
            <strong className="font-semibold text-foreground">{translations.accred("status")}</strong> :{" "}
            {accred.status.labelfr}
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
    </details>
  );
}

function formatDate(iso: string | undefined, never: boolean, translations: { common: (key: string) => string }) {
  if (never) return translations.common("never");
  return iso ? new Date(iso).toLocaleDateString() : "—";
}

function serviceNowTicketUrl(person: ApiPerson, sciper: string): string {
  const url = `https://epfl.service-now.com/incident.do?
            sys_id=-1
            &sysparm_stack=incident_list.do
            &sysparm_query=short_description=Ticket pour ${person.firstname} ${person.lastname}^
            caller_id=javascript:
              var userRecord = new GlideRecord('sys_user');
              userRecord.addQuery('user_name', '${sciper}');
              userRecord.query();
              if(userRecord.next()) { userRecord.sys_id }^
            category=incident^
            assigned_to=javascript:
              gs.getUserID()^
            assignment_group=javascript:
              var assignmentGroup = new GlideRecord('sys_user_group');
              assignmentGroup.addQuery('name', 'SI_SERVICEDESK');
              assignmentGroup.query();
              if(assignmentGroup.next()) { assignmentGroup.sys_id }^
            business_service=javascript:
              var businessService = new GlideRecord('cmdb_ci_service');
              businessService.addQuery('name', 'Service Desk');
              businessService.query();
              if(businessService.next()) { businessService.getValue('sys_id') }^
            description=%0ANote: Ticket ouvert pour ${person.firstname} ${person.lastname} le ${new Date().toLocaleString("en-GB")} via ATARI.`;
  return url.replace(/ {2,}/g, "");
}

export function PersonDetails({ sciper }: { sciper: string }) {
  const translations = {
    fields: useTranslations("person.fields"),
    sections: useTranslations("person.sections"),
    toolLabels: useTranslations("person.toolLabels"),
    accred: useTranslations("person.accred"),
    ad: useTranslations("tools.ad"),
    common: useTranslations("common"),
  };

  const [person, setPerson] = useState<ApiPerson | null>(null);
  const [loading, setLoading] = useState(true);
  const [adInfo, setAdInfo] = useState<ActiveDirectoryInfo | null>(null);
  const [accreds, setAccreds] = useState<Accred[]>([]);
  const [hasEmailAuth, setHasEmailAuth] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setPerson(null);
    setAdInfo(null);
    setAccreds([]);
    setHasEmailAuth(false);

    Promise.all([getPersonBySciper(sciper), getAccreditations(sciper), getHasEmailAuthorization(sciper)]).then(
      ([foundPerson, foundAccreds, emailAuth]) => {
        if (cancelled) return;
        setPerson(foundPerson);
        setAccreds(foundAccreds);
        setHasEmailAuth(emailAuth);
        setLoading(false);

        if (foundPerson?.account) {
          getActiveDirectoryInfo(sciper)
            .then((info) => !cancelled && setAdInfo(info))
            .catch(() => {});
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [sciper]);

  // The #details target only exists once loading is done, so a navigation-time scroll
  // (or the browser's native hash scroll) has nothing to land on yet — do it ourselves.
  useEffect(() => {
    if (!loading && window.location.hash === "#details") {
      document.getElementById("details")?.scrollIntoView({ behavior: "instant", block: "start" });
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="mt-8 flex w-full max-w-5xl items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!person) return null;

  const fullName = person.name || person.display;
  const hasAccount = Boolean(person.account);
  const emailLocalPart = person.email ? person.email.replace("@epfl.ch", "") : sciper;
  const addresses = (person.addresses ?? []).filter((address) => address.part1 || address.part2 || address.part3);
  // GID/UID/Home/Shell live on the AD entry (POSIX attributes); the persons API's own
  // account object is a fallback for when AD hasn't answered yet or has no account.
  const gid = adInfo?.gidNumber ?? (person.account?.gid !== undefined ? String(person.account.gid) : undefined);
  const uid = adInfo?.uidNumber ?? (person.account?.uid !== undefined ? String(person.account.uid) : undefined);
  const home = adInfo?.unixHomeDirectory ?? person.account?.home;
  const shell = adInfo?.loginShell ?? person.account?.shell;
  const accountStatusColor =
    adInfo?.accountStatus === "ACCOUNT_ENABLED"
      ? "bg-green-500"
      : adInfo?.accountStatus === "ACCOUNT_DISABLED"
        ? "bg-destructive"
        : "bg-muted-foreground";

  return (
    <div className="pt-10 flex w-full max-w-6xl flex-col gap-10 lg:flex-row" id="details">
      <div className="flex shrink-0 flex-col items-center gap-4 border-b border-destructive/25 pb-8 lg:w-96 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
        <div className="relative h-40 w-40 overflow-hidden rounded-full bg-muted transition-transform hover:rotate-2">
          <User className="absolute inset-0 m-auto h-14 w-14 text-muted-foreground" />
          {/** biome-ignore lint/performance/noImgElement: external EPFL photo endpoint, no next/image domain config needed */}
          <img
            src={`https://people.epfl.ch/private/common/photos/links/${sciper}.jpg`}
            alt={fullName}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(fullName)}
          className="cursor-copy text-center text-2xl font-semibold underline decoration-destructive underline-offset-8"
        >
          {fullName}
        </button>

        <div className="w-full space-y-1">
          <CopyRow label={translations.fields("sciper")} value={sciper} />
          {person.email && <CopyRow label={translations.fields("email")} value={person.email} />}
          {(person.username || person.account?.username) && (
            <CopyRow
              label={translations.fields("username")}
              value={person.username || person.account?.username || ""}
            />
          )}
          {person.phones?.slice(0, 2).map((phone) => (
            <CopyRow key={phone.id} label={translations.fields("phone")} value={phone.number} />
          ))}
          {person.sapid && <CopyRow label={translations.fields("sapId")} value={person.sapid} />}
          {gid && <CopyRow label={translations.fields("gid")} value={gid} />}
          {uid && <CopyRow label={translations.fields("uid")} value={uid} />}
          {home && <CopyRow label={translations.fields("home")} value={home} />}
          {shell && <CopyRow label={translations.fields("shell")} value={shell} />}
        </div>

        {hasAccount && (
          <a
            href={serviceNowTicketUrl(person, sciper)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            {translations.toolLabels("createTicket")}
          </a>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <Section label={translations.sections("general")}>
          <div className="grid grid-cols-1 gap-x-10 gap-y-1 text-lg sm:grid-cols-2">
            {person.gender && <InfoRow label={translations.fields("gender")} value={person.gender} />}
            {person.position?.labelfr && (
              <InfoRow label={translations.fields("position")} value={person.position.labelfr} />
            )}
            {person.org && <InfoRow label={translations.fields("unit")} value={person.org} />}
            {person.status && <InfoRow label={translations.fields("status")} value={person.status} />}
            <InfoRow
              label={translations.fields("accredited")}
              value={person.isaccredited === false ? translations.common("no") : translations.common("yes")}
            />
            <InfoRow
              label={translations.fields("emailAuth")}
              value={hasEmailAuth ? translations.common("yes") : translations.common("no")}
            />
          </div>
        </Section>

        {accreds.length > 0 && (
          <Section label={translations.sections("accreditations")}>
            <div className="divide-y divide-border text-lg">
              {accreds.map((accred) => (
                <AccredRow key={`${accred.unit.id}-${accred.order}`} accred={accred} translations={translations} />
              ))}
            </div>
          </Section>
        )}

        {addresses.length > 0 && (
          <Section label={translations.sections("addresses")}>
            <div className="grid grid-cols-1 gap-x-10 gap-y-4 text-lg sm:grid-cols-2">
              {addresses.map((address, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: addresses have no stable id
                <div key={i}>
                  {address.part1 && <p className="font-semibold">{address.part1}</p>}
                  {[address.part2, address.part3, address.part4].filter(Boolean).map((line) => (
                    <p key={line} className="text-muted-foreground">
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </Section>
        )}

        {adInfo && (
          <Section label={translations.sections("activeDirectory")}>
            <div className="grid grid-cols-1 gap-x-10 gap-y-1 text-lg sm:grid-cols-2">
              {adInfo.sAMAccountName && (
                <InfoRow label={translations.ad("domainLogin")} value={`INTRANET\\${adInfo.sAMAccountName}`} />
              )}
              {adInfo.accountStatus && (
                <InfoRow
                  label={translations.ad("accountControl")}
                  value={
                    <span className="inline-flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", accountStatusColor)} />
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
        )}

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
      </div>
    </div>
  );
}
