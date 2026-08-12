"use server";

import { unstable_cache } from "next/cache";
import { ldapSearch } from "@/lib/ldap";
import { getUser } from "@/services/auth";
import type { ActiveDirectoryInfo, UacFlag } from "@/types/api";

const AD_REPLICAS = ["ad1", "ad2", "ad3", "ad5", "ad6"];
const AD_BASE_DN = "dc=intranet,dc=epfl,dc=ch";

const UAC_FLAGS: [number, UacFlag][] = [
  [0x1, "UAC_SCRIPT"],
  [0x8, "UAC_HOMEDIR_REQUIRED"],
  [0x10, "UAC_LOCKOUT"],
  [0x20, "UAC_PASSWD_NOTREQD"],
  [0x40, "UAC_PASSWD_CANT_CHANGE"],
  [0x80, "UAC_ENCRYPTED_TEXT_PWD_ALLOWED"],
  [0x100, "UAC_TEMP_DUPLICATE_ACCOUNT"],
  [0x200, "UAC_NORMAL_ACCOUNT"],
  [0x800, "UAC_INTERDOMAIN_TRUST_ACCOUNT"],
  [0x1000, "UAC_WORKSTATION_TRUST_ACCOUNT"],
  [0x2000, "UAC_SERVER_TRUST_ACCOUNT"],
  [0x10000, "UAC_DONT_EXPIRE_PASSWORD"],
  [0x20000, "UAC_MNS_LOGON_ACCOUNT"],
  [0x40000, "UAC_SMARTCARD_REQUIRED"],
  [0x80000, "UAC_TRUSTED_FOR_DELEGATION"],
  [0x100000, "UAC_NOT_DELEGATED"],
  [0x200000, "UAC_USE_DES_KEY_ONLY"],
  [0x400000, "UAC_DONT_REQ_PREAUTH"],
  [0x800000, "UAC_PASSWORD_EXPIRED"],
  [0x1000000, "UAC_TRUSTED_TO_AUTH_FOR_DELEGATION"],
];

function str(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  return Array.isArray(value) ? value[0]?.toString() : String(value);
}

function strList(value: unknown): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value.map(String) : [String(value)];
}

function uacFlags(bitmap: number): UacFlag[] {
  const flags = UAC_FLAGS.filter(([flag]) => (bitmap & flag) !== 0).map(([, code]) => code);
  return flags.length > 0 ? flags : ["UAC_NONE"];
}

// Windows FILETIME: 100ns intervals since 1601-01-01, offset to the Unix epoch.
function windowsTimestampToISO(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const ms = (Number(value) / 10000000 - 11644473600) * 1000;
  return Number.isNaN(ms) ? undefined : new Date(ms).toISOString();
}

const getCachedActiveDirectoryInfo = unstable_cache(
  async (sciper: string) => queryActiveDirectory(sciper),
  ["ad-info-by-sciper"],
  { revalidate: 300 },
);

export async function getActiveDirectoryInfo(sciper: string): Promise<ActiveDirectoryInfo | null> {
  await getUser();
  return getCachedActiveDirectoryInfo(sciper);
}

async function queryActiveDirectory(sciper: string): Promise<ActiveDirectoryInfo | null> {
  const username = process.env.AD_USERNAME;
  const password = process.env.AD_PASSWORD;
  if (!username || !password) {
    throw new Error("AD credentials not configured");
  }

  const perReplica = await Promise.all(
    AD_REPLICAS.map(async (ad) => {
      try {
        const entries = await ldapSearch(
          `ldap://${ad}.epfl.ch`,
          AD_BASE_DN,
          {
            scope: "sub",
            filter: `(&(objectClass=organizationalPerson)(employeeID=${sciper}))`,
          },
          { dn: username, password },
        );
        return entries[0];
      } catch (error) {
        console.error(`Error querying ${ad}.epfl.ch:`, error);
        return undefined;
      }
    }),
  );

  const primary = perReplica.find((entry) => entry !== undefined);
  if (!primary) return null;

  // Bad-password stats can differ per domain controller depending on replication lag,
  // so take the most recent (max) value seen across every replica that answered.
  const badPasswordTimes = perReplica
    .map((entry) => Number(str(entry?.badPasswordTime)))
    .filter((n) => !Number.isNaN(n));
  const badPwdCounts = perReplica.map((entry) => Number(str(entry?.badPwdCount))).filter((n) => !Number.isNaN(n));
  const badPasswordTime = badPasswordTimes.length ? String(Math.max(...badPasswordTimes)) : undefined;
  const badPwdCount = badPwdCounts.length ? Math.max(...badPwdCounts) : undefined;

  const rawUac = Number(str(primary.userAccountControl));
  const accountStatus = Number.isNaN(rawUac)
    ? undefined
    : (rawUac & 0x2) !== 0
      ? "ACCOUNT_DISABLED"
      : (rawUac & 0x200) !== 0
        ? "ACCOUNT_ENABLED"
        : "ACCOUNT_UNKNOWN";

  const accountExpires = str(primary.accountExpires);
  const lastLogon = str(primary.lastLogon);
  const pwdLastSet = str(primary.pwdLastSet);
  const mailboxDetails = str(primary.msExchRecipientTypeDetails);

  return {
    description: str(primary.description),
    displayName: str(primary.displayName),
    mail: str(primary.mail),
    userPrincipalName: str(primary.userPrincipalName),
    sAMAccountName: str(primary.sAMAccountName),
    gidNumber: str(primary.gidNumber),
    uidNumber: str(primary.uidNumber),
    unixHomeDirectory: str(primary.unixHomeDirectory),
    loginShell: str(primary.loginShell),
    accountControlHex: Number.isNaN(rawUac) ? undefined : rawUac.toString(16),
    accountStatus,
    uacFlags: Number.isNaN(rawUac) ? [] : uacFlags(rawUac),
    accountExpiresNever: accountExpires === "9223372036854775807",
    accountExpiresISO: windowsTimestampToISO(accountExpires),
    lastLogonNever: lastLogon === "0",
    lastLogonISO: windowsTimestampToISO(lastLogon),
    pwdLastSetNever: pwdLastSet === "0",
    pwdLastSetISO: windowsTimestampToISO(pwdLastSet),
    badPasswordTimeNever: !badPasswordTime || badPasswordTime === "0",
    badPasswordTimeISO: windowsTimestampToISO(badPasswordTime),
    badPwdCount,
    hasExchangeMailbox: Boolean(mailboxDetails),
    mailboxLocation:
      mailboxDetails === "1" ? "MAILBOX_ONPREM" : mailboxDetails === "2147483648" ? "MAILBOX_ONLINE" : "MAILBOX_NA",
    hasDistrilog: strList(primary.memberOf).some((dn) => dn.startsWith("CN=DroitAccred_Distrilog")),
  };
}
