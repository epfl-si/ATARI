"use server";

import { unstable_cache } from "next/cache";
import { parse } from "node-html-parser";
import { getUser } from "@/services/auth";

const PEOPLE_BASE_URL = "https://people.epfl.ch";

function parseProfilePicture(html: string): string | null {
  const img = parse(html).querySelector('img[alt="Profile picture"]');
  return img?.getAttribute("src") ?? null;
}

const getCachedProfilePicture = unstable_cache(
  async (sciper: string) => {
    console.log(`Fetching profile picture for ${sciper} from ${PEOPLE_BASE_URL}`);
    const response = await fetch(`${PEOPLE_BASE_URL}/${encodeURIComponent(sciper)}`);
    if (!response.ok) return null;

    return parseProfilePicture(await response.text());
  },
  ["people-profile-picture"],
  { revalidate: 300 },
);

export async function getProfilePicture(sciper: string): Promise<string | null> {
  await getUser();

  try {
    return await getCachedProfilePicture(sciper);
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    return null;
  }
}
