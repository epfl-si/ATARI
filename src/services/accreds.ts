"use server";

import { unstable_cache } from "next/cache";
import { makeApiCall } from "@/lib/api";
import { getUser } from "@/services/auth";
import type { Accred } from "@/types/api";

const getCachedAccreditations = unstable_cache(
  async (sciper: string) => {
    const data = await makeApiCall<{ accreds: Accred[] }>("/v1/accreds", {
      persid: sciper,
      pagesize: "50",
      sortcolumn: "order",
      sortdirection: "asc",
    });
    return data.accreds || [];
  },
  ["accreds-by-sciper"],
  { revalidate: 300 },
);

export async function getAccreditations(sciper: string): Promise<Accred[]> {
  await getUser();

  try {
    return await getCachedAccreditations(sciper);
  } catch (error) {
    console.error("Error fetching accreditations:", error);
    return [];
  }
}

const getCachedHasEmailAuthorization = unstable_cache(
  async (sciper: string) => {
    const data = await makeApiCall<{ authorizations: { status: string }[] }>("/v1/authorizations", {
      persid: sciper,
      type: "property",
      authid: "11",
    });
    return (data.authorizations || []).some((auth) => auth.status === "active");
  },
  ["email-authorization-by-sciper"],
  { revalidate: 300 },
);

export async function getHasEmailAuthorization(sciper: string): Promise<boolean> {
  await getUser();

  try {
    return await getCachedHasEmailAuthorization(sciper);
  } catch (error) {
    console.error("Error fetching email authorization:", error);
    return false;
  }
}
