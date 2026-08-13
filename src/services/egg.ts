import { PERSON_EGGS, type PersonEgg } from "@/constants/egg";
import type { Accred } from "@/types/api";

export function getPersonEgg(sciper: string, accreds: Accred[]): PersonEgg | undefined {
  const unitIds = accreds.map((accred) => accred.unit.id);

  return PERSON_EGGS.find(
    (egg) => egg.scipers?.includes(sciper) || egg.unitIds?.some((unitId) => unitIds.includes(unitId)),
  );
}
