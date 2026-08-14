"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  AccreditationsSection,
  ActiveDirectorySection,
  GeneralSection,
  ToolsSection,
} from "@/components/person/sections";
import { PersonSidebar } from "@/components/person/sidebar";
import type { PersonTranslations } from "@/components/person/types";
import { getAccreditations, getHasEmailAuthorization } from "@/services/accreds";
import { getActiveDirectoryInfo } from "@/services/ad";
import { getPersonEgg } from "@/services/egg";
import { getProfilePicture } from "@/services/people";
import { getPersonBySciper } from "@/services/person";
import type { Accred, ActiveDirectoryInfo, ApiPerson } from "@/types/api";

type PersonDetailsState = {
  loading: boolean;
  person: ApiPerson | null;
  adInfo: ActiveDirectoryInfo | null;
  accreds: Accred[];
  hasEmailAuth: boolean;
  pictureUrl: string | null;
};

const emptyState: PersonDetailsState = {
  loading: true,
  person: null,
  adInfo: null,
  accreds: [],
  hasEmailAuth: false,
  pictureUrl: null,
};

function usePersonDetails(sciper: string): PersonDetailsState {
  const [state, setState] = useState<PersonDetailsState>(emptyState);

  useEffect(() => {
    let cancelled = false;
    setState(emptyState);

    Promise.all([
      getPersonBySciper(sciper),
      getAccreditations(sciper),
      getHasEmailAuthorization(sciper),
      getProfilePicture(sciper),
    ]).then(([person, accreds, hasEmailAuth, pictureUrl]) => {
      if (cancelled) return;
      setState({ loading: false, person, adInfo: null, accreds, hasEmailAuth, pictureUrl });

      if (person?.account) {
        getActiveDirectoryInfo(sciper)
          .then((adInfo) => !cancelled && setState((prev) => ({ ...prev, adInfo })))
          .catch(() => {});
      }
    });

    return () => {
      cancelled = true;
    };
  }, [sciper]);

  return state;
}

export function PersonDetails({ sciper }: { sciper: string }) {
  const translations: PersonTranslations = {
    fields: useTranslations("person.fields"),
    sections: useTranslations("person.sections"),
    toolLabels: useTranslations("person.toolLabels"),
    accred: useTranslations("person.accred"),
    adminsIt: useTranslations("person.adminsIt"),
    ad: useTranslations("tools.ad"),
    common: useTranslations("common"),
  };

  const { loading, person, adInfo, accreds, hasEmailAuth, pictureUrl } = usePersonDetails(sciper);

  // Scroll the details block into view once it actually exists in the DOM (it doesn't
  // during the loading state) — independent from the URL hash, which the search bar
  // also touches and shouldn't have to coordinate with.
  useEffect(() => {
    if (!loading) {
      document.getElementById("details")?.scrollIntoView({ behavior: "instant", block: "start" });
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="mt-8 flex w-full max-w-5xl items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!person) return null;

  const egg = getPersonEgg(sciper, accreds);

  return (
    <div className="pt-10 flex w-full max-w-5xl flex-col gap-10 lg:flex-row" id="details">
      <PersonSidebar
        sciper={sciper}
        person={person}
        adInfo={adInfo}
        accreds={accreds}
        pictureUrl={pictureUrl}
        egg={egg}
        translations={translations}
      />

      <div className="min-w-0 flex-1 mt-3">
        <GeneralSection person={person} hasEmailAuth={hasEmailAuth} translations={translations} />
        <AccreditationsSection accreds={accreds} addresses={person.addresses} translations={translations} />
        <ActiveDirectorySection adInfo={adInfo} translations={translations} />
        <ToolsSection sciper={sciper} person={person} translations={translations} />
      </div>
    </div>
  );
}
