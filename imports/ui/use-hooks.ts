/**
 * Additional `use*` hooks for React
 */

import { useFind, useSubscribe } from 'meteor/react-meteor-data'
import { Person, Persons } from '/imports/api/persons'

const publications = ['personAPI', 'personActiveDirectory',
  'personScoldap', 'personLdap'] as const;
type PublicationName = typeof publications[number];

/**
 * React “use” hook to reactively obtain the sole entry with a given SCIPER
 * in the Persons collection
 *
 * @locus Client
 */
export function useQueryPerson (
  sciper : string,
  ...subscriptions: PublicationName[]
) : {
  isLoading: () => boolean
  person: Person | undefined
} {
  const isLoadings : (() => boolean)[] = [];
  for (const pub of publications) {
    if (sciper && (subscriptions.indexOf(pub) > -1)) {
      isLoadings.push(useSubscribe(pub, sciper));
    } else {
      // Keep number of “use” hooks constant, even in case our caller
      // changed the `...subscriptions` inbetween re-renders:
      useSubscribe(null);
    }
  }

  const personOrPersons = useFind(() => Persons.find({ _id: sciper }))

  return {
    person: Object.values(personOrPersons)[0],
    isLoading() : boolean {
      for (const l of isLoadings) {
        if (l()) { return true; }
      }
      return false;
    }
  }
}
