"use server";

import { unstable_cache } from "next/cache";
import { makeApiCall } from "@/lib/api";
import { getUser } from "@/services/auth";
import type { ApiPerson } from "@/types/api";

const getCachedPerson = unstable_cache(
  async (sciper: string) => {
    const person = await makeApiCall<ApiPerson>(`/v1/persons/${encodeURIComponent(sciper)}`);
    return {
      ...person,
      name: person.firstname && person.lastname ? `${person.firstname} ${person.lastname}` : person.display,
    };
  },
  ["person-by-sciper"],
  { revalidate: 300 },
);

export async function searchPerson(query: string): Promise<ApiPerson[]> {
  await getUser();

  const searchTerm = query.trim();
  if (searchTerm.length < 3) return [];

  try {
    const data = await makeApiCall<{ persons: ApiPerson[] }>("/v1/persons", {
      query: searchTerm,
      pagesize: "10",
      pageindex: "0",
    });

    const persons = data.persons || [];

    return persons.map((person) => ({
      ...person,
      name: person.firstname && person.lastname ? `${person.firstname} ${person.lastname}` : person.display,
    }));
  } catch (error) {
    console.error("Error searching persons:", error);
    return [];
  }
}

export async function getPersonBySciper(sciper: string): Promise<ApiPerson | null> {
  await getUser();

  try {
    return await getCachedPerson(sciper);
  } catch (error) {
    console.error("Error fetching person details:", error);
    return null;
  }
}
