"use server";

import { makeApiCall } from "@/lib/api";
import { getUser } from "@/services/auth";
import type { ApiPerson } from "@/types/api";

export async function searchPeople(query: string): Promise<ApiPerson[]> {
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
    console.error("Error searching people:", error);
    return [];
  }
}
