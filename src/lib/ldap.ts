"use server";

import { Client, type SearchOptions } from "ldapts";

export async function ldapSearch(
  url: string,
  base: string,
  options: SearchOptions,
  bind?: { dn: string; password: string },
) {
  const client = new Client({ url, timeout: 5000, connectTimeout: 3000 });

  try {
    if (bind) {
      await client.bind(bind.dn, bind.password);
    }

    const { searchEntries } = await client.search(base, options);
    return searchEntries;
  } finally {
    await client.unbind().catch(() => {});
  }
}
