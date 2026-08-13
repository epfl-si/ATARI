import type { CSSProperties } from "react";

export type PersonEgg = {
  id: string;
  scipers?: string[];
  unitIds?: number[];
  cursor: string;
  hoverStyle: CSSProperties;
};

// Ported from the legacy Meteor app's UserDetails.tsx / UserDetails.css: hovering the
// profile picture of these people (or anyone accredited to these units) swaps the cursor
// for a custom gif and runs a one-off animation instead of the default photo hover effect.
export const PERSON_EGGS: PersonEgg[] = [
  {
    id: "nbo",
    scipers: ["169419"],
    cursor: "/easter-eggs/nbo.gif",
    hoverStyle: { animation: "egg-skew-shake 0.25s infinite" },
  },
  {
    id: "sami",
    scipers: ["348084"],
    cursor: "/easter-eggs/sami.gif",
    hoverStyle: { animation: "egg-jump-shake 0.83s infinite" },
  },
  {
    id: "duriaux",
    scipers: ["382268"],
    cursor: "/easter-eggs/duriaux.gif",
    hoverStyle: { animation: "egg-jump-shake 0.83s infinite" },
  },
  {
    id: "sigrist",
    scipers: ["420408"],
    cursor: "/easter-eggs/sigrist.gif",
    hoverStyle: { animation: "egg-wobble 1s ease infinite" },
  },
  {
    id: "fsd",
    unitIds: [13030],
    cursor: "/easter-eggs/fsd.gif",
    hoverStyle: { animation: "egg-wobble 1s ease infinite" },
  },
  {
    id: "sdesk",
    unitIds: [13034],
    cursor: "/easter-eggs/sdesk.gif",
    hoverStyle: { transform: "rotate(-360deg)", transition: "all 0.5s" },
  },
];
