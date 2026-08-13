"use server";

import { unstable_cache } from "next/cache";
import { makeApiCall } from "@/lib/api";
import { getUser } from "@/services/auth";
import type { UnitAdmin } from "@/types/api";

const getCachedUnitAdminsIT = unstable_cache(
  async (unitId: number) => {
    const data = await makeApiCall<{ authorizations: UnitAdmin[] }>("/v1/authorizations", {
      resid: String(unitId),
      authid: "adminit",
      type: "role",
      alldata: "1",
    });
    console.log(`Fetched ${data.authorizations?.length || 0} IT admins for unit ${unitId}`);
    console.log(
      "Data received:",
      data.authorizations.map((admin) => ({ person: admin.person })),
    );
    return data.authorizations || [];
  },
  ["unit-admins-it-by-unit"],
  { revalidate: 300 },
);

export async function getUnitAdminsIT(unitId: number): Promise<UnitAdmin[]> {
  await getUser();

  try {
    return await getCachedUnitAdminsIT(unitId);
  } catch (error) {
    console.error("Error fetching unit IT admins:", error);
    return [];
  }
}
