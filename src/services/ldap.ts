"use server";

import { unstable_cache } from "next/cache";
import { ldapSearch } from "@/lib/ldap";
import { getUser } from "@/services/auth";
import type { LdapInfo } from "@/types/api";

const LDAP_BASE_DN = "o=epfl,c=ch";
const AUTOMAP_BASE_DN = "ou=automaps,o=epfl,c=ch";

async function queryLdap(url: string, sciper: string) {
  const entries = await ldapSearch(url, LDAP_BASE_DN, {
    scope: "sub",
    filter: `(&(objectclass=EPFLorganizationalPerson)(uniqueIdentifier=${sciper}))`,
  });
  return entries[0];
}

async function queryHomeAutomap(homeDirectory: string) {
  const cn = homeDirectory.split("/")[2];
  if (!cn) return undefined;

  const entries = await ldapSearch("ldap://ldap.epfl.ch", AUTOMAP_BASE_DN, {
    scope: "sub",
    filter: `(cn=${cn})`,
  });
  return entries[0];
}

const getCachedLdapInfo = unstable_cache(async (sciper: string) => queryLdapInfo(sciper), ["ldap-info-by-sciper"], {
  revalidate: 300,
});

export async function getLdapInfo(sciper: string): Promise<LdapInfo> {
  await getUser();
  return getCachedLdapInfo(sciper);
}

async function queryLdapInfo(sciper: string): Promise<LdapInfo> {
  const [ldap, scoldap] = await Promise.all([
    queryLdap("ldap://ldap.epfl.ch", sciper).catch((error) => {
      console.error("Error querying ldap.epfl.ch:", error);
      return undefined;
    }),
    queryLdap("ldap://scoldap.epfl.ch", sciper).catch((error) => {
      console.error("Error querying scoldap.epfl.ch:", error);
      return undefined;
    }),
  ]);

  const homeDirectory = ldap?.homeDirectory?.toString();
  const automap = homeDirectory
    ? await queryHomeAutomap(homeDirectory).catch((error) => {
        console.error("Error querying automap:", error);
        return undefined;
      })
    : undefined;

  return { ldap, scoldap, automap };
}
