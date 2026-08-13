"use client";

import { Check, Copy, User } from "lucide-react";
import { useState } from "react";
import type { PersonTranslations } from "@/components/person/types";
import type { ActiveDirectoryInfo, ApiPerson } from "@/types/api";

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
  pictureUrl,
  translations,
}: {
  sciper: string;
  person: ApiPerson;
  adInfo: ActiveDirectoryInfo | null;
  pictureUrl: string | null;
  translations: PersonTranslations;
}) {
  const fullName = person.name || person.display;
  const hasAccount = Boolean(person.account);
  // GID/UID/Home/Shell live on the AD entry (POSIX attributes); the persons API's own
  // account object is a fallback for when AD hasn't answered yet or has no account.
  const gid = adInfo?.gidNumber ?? (person.account?.gid !== undefined ? String(person.account.gid) : undefined);
  const uid = adInfo?.uidNumber ?? (person.account?.uid !== undefined ? String(person.account.uid) : undefined);
  const home = adInfo?.unixHomeDirectory ?? person.account?.home;
  const shell = adInfo?.loginShell ?? person.account?.shell;

  return (
    <div className="flex shrink-0 flex-col items-center gap-4 border-b border-destructive/25 pb-8 lg:w-96 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
      <div className="relative h-40 w-40 overflow-hidden rounded-full bg-muted transition-transform hover:rotate-2">
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
          <CopyRow label={translations.fields("username")} value={person.username || person.account?.username || ""} />
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
  );
}
