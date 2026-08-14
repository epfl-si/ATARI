"use client";

import { ChevronDown, User } from "lucide-react";
import { useState } from "react";
import type { PersonTranslations } from "@/components/person/types";
import type { PersonEgg } from "@/constants/egg";
import { cn } from "@/lib/utils";
import type { Accred, AccredUnit, ActiveDirectoryInfo, ApiPerson, PersonPhone } from "@/types/api";

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
      {/* biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: click-to-copy convenience; kept as a span (not a button) so the value stays mouse-selectable */}
      <span
        onClick={copy}
        className={cn("cursor-copy truncate font-medium hover:text-primary", copied && "text-gray-400")}
      >
        {value}
      </span>
    </div>
  );
}

type PhoneGroup = { number: string; unitNames: string[] };

// A person can have the same number registered once per accreditation, each tagged with a
// different unitid — group by number and collect the unit names instead of showing duplicates.
function groupPhones(phones: PersonPhone[] | undefined, unitById: Map<number, AccredUnit>): PhoneGroup[] {
  const sorted = [...(phones ?? [])].sort(
    (a, b) => (b.fromdefault ?? 0) - (a.fromdefault ?? 0) || (a.order ?? 0) - (b.order ?? 0),
  );

  const groups: PhoneGroup[] = [];
  const indexByNumber = new Map<string, number>();
  for (const phone of sorted) {
    const unitName = phone.unitid ? unitById.get(Number(phone.unitid))?.name : undefined;
    const existingIndex = indexByNumber.get(phone.number);
    if (existingIndex === undefined) {
      indexByNumber.set(phone.number, groups.length);
      groups.push({ number: phone.number, unitNames: unitName ? [unitName] : [] });
    } else if (unitName && !groups[existingIndex].unitNames.includes(unitName)) {
      groups[existingIndex].unitNames.push(unitName);
    }
  }
  return groups;
}

function PhoneField({
  phones,
  unitById,
  translations,
}: {
  phones: PersonPhone[] | undefined;
  unitById: Map<number, AccredUnit>;
  translations: PersonTranslations;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const groups = groupPhones(phones, unitById);

  function copy(value: string) {
    navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied((current) => (current === value ? null : current)), 1500);
  }

  if (groups.length === 0) return null;
  // A single unique number, no matter how many accreditations it's tied to, is just a plain
  // field like the rest of the sidebar. Only distinct numbers are worth a list.
  if (groups.length === 1) return <CopyRow label={translations.fields("phone")} value={groups[0].number} />;

  return (
    <details className="group/phones py-1.5 text-base" open>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="text-muted-foreground">{translations.fields("phone")}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-destructive transition-transform group-open/phones:rotate-180" />
      </summary>
      <div className="mt-1.5 space-y-1.5 pl-1">
        {groups.map((group) => (
          <div key={group.number} className="flex items-center justify-between gap-3 text-sm">
            {group.unitNames.length > 0 && (
              <span className="truncate text-xs text-muted-foreground">{group.unitNames.join(", ")}</span>
            )}
            <button
              type="button"
              onClick={() => copy(group.number)}
              className={cn("cursor-copy font-medium hover:text-primary", copied === group.number && "text-gray-400")}
            >
              {group.number}
            </button>
          </div>
        ))}
      </div>
    </details>
  );
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

export function PersonSidebar({
  sciper,
  person,
  adInfo,
  accreds,
  pictureUrl,
  egg,
  translations,
}: {
  sciper: string;
  person: ApiPerson;
  adInfo: ActiveDirectoryInfo | null;
  accreds: Accred[];
  pictureUrl: string | null;
  egg?: PersonEgg;
  translations: PersonTranslations;
}) {
  const [eggHovered, setEggHovered] = useState(false);
  const [nameCopied, setNameCopied] = useState(false);
  const fullName = person.name || person.display;
  const unitById = new Map(accreds.map((accred) => [accred.unit.id, accred.unit]));

  function copyName() {
    navigator.clipboard.writeText(fullName);
    setNameCopied(true);
    setTimeout(() => setNameCopied(false), 1500);
  }
  const hasAccount = Boolean(person.account);
  // GID/UID/Home/Shell live on the AD entry (POSIX attributes); the persons API's own
  // account object is a fallback for when AD hasn't answered yet or has no account.
  const gid = adInfo?.gidNumber ?? (person.account?.gid !== undefined ? String(person.account.gid) : undefined);
  const uid = adInfo?.uidNumber ?? (person.account?.uid !== undefined ? String(person.account.uid) : undefined);
  const home = adInfo?.unixHomeDirectory ?? person.account?.home;
  const shell = adInfo?.loginShell ?? person.account?.shell;

  return (
    <div className="flex shrink-0 flex-col items-center gap-4 border-b border-destructive/25 pb-8 lg:w-96 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
      {/* biome-ignore lint/a11y/noStaticElementInteractions: purely decorative hover cursor/animation, nothing to reach by keyboard */}
      <div
        className="relative h-40 w-40 overflow-hidden rounded-full bg-muted transition-transform hover:rotate-2"
        style={egg && eggHovered ? { ...egg.hoverStyle, cursor: `url(${egg.cursor}) 10 3, auto` } : undefined}
        onMouseEnter={() => egg && setEggHovered(true)}
        onMouseLeave={() => egg && setEggHovered(false)}
      >
        <User className="absolute inset-0 m-auto h-14 w-14 text-muted-foreground" />
        {pictureUrl && (
          // biome-ignore lint/performance/noImgElement: external EPFL photo endpoint, no next/image domain config needed
          <img
            src={pictureUrl}
            alt={fullName}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
      </div>
      {/* biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: click-to-copy convenience; kept as a span (not a button) so the name stays mouse-selectable */}
      <span
        onClick={copyName}
        className={cn(
          "cursor-copy text-center text-2xl font-semibold underline decoration-destructive underline-offset-8",
          nameCopied && "text-gray-700",
        )}
      >
        {fullName}
      </span>

      <div className="w-full space-y-1">
        <CopyRow label={translations.fields("sciper")} value={sciper} />
        {person.email && <CopyRow label={translations.fields("email")} value={person.email} />}
        {(person.username || person.account?.username) && (
          <CopyRow label={translations.fields("username")} value={person.username || person.account?.username || ""} />
        )}
        <PhoneField phones={person.phones} unitById={unitById} translations={translations} />
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
  );
}
