/**
 * Additional `use*` hooks for React
 */

import { useEffect, useRef } from 'react'
import { useFind, useSubscribe } from 'meteor/react-meteor-data'
import { Person, Persons } from '/imports/api/persons'

const publications = ['personAPI', 'personActiveDirectory',
  'personScoldap', 'personLdap'] as const;
type PublicationName = typeof publications[number];

/**
 * React “use” hook to reactively obtain the sole entry with a given SCIPER
 * in the Persons collection
 *
 * @param sciper           The user to search for, or `null` if you don't want
 *                         to make a query after all.
 *
 * @param ...subscriptions Meteor DDP publications to subscribe to.
 *
 * @locus Client
 */
export function useQueryPerson (
  sciper : string | undefined,
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
      // changed our parameters inbetween re-renders:
      useSubscribe(undefined);
    }
  }

  const personOrPersons = useFind(
      () => (sciper && Persons ? Persons.find({ _id: sciper }) : null
    ),
    [ sciper ]
  );

  return {
    person: personOrPersons ? Object.values(personOrPersons)[0] : undefined,
    isLoading() : boolean {
      for (const l of isLoadings) {
        if (l()) { return true; }
      }
      return false;
    }
  }
}

export function useGlobalKeyboardEvent (
  keyName : string,
  watDo: (ev : KeyboardEvent) => void
) {
  // Praise be to https://dev.to/akumzy/managing-global-dom-events-in-react-with-hooks-3ckl
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === keyName) {
        watDo(ev);
      }
    };
    window.addEventListener("keyup", onKey, false);
    return () => {
      window.removeEventListener("keyup", onKey, false);
    };
  }, []);
}

/**
 * Call `idleCallback` after `delay` with the last set value (unless undefined).
 *
 * @return A callback function, typed `set(newVal : T | undefined) :
 * void` that the caller of `useDeadMansSwitch()` may invoke any
 * number of times. Invoking `set(undefined)` cancels the dead man's
 * switch; meaning nothing else will happen later, unless and until
 * one invokes `set()` again. Calling `set(newVal)` with any other
 * (non-`undefined`) value for `newVal`, arms the dead man's switch.
 * `idleCallback(newVal)` will be called after `delay` milliseconds,
 * unless the owner component unmaps or `set()` is invoked again
 * before the delay expires.
 */
export function useDeadMansSwitch<T> (idleCallback : (lastVal : T | undefined) => void, delay : number) {
  type State<T> = {
    lastVal?: T;
    timeout?: ReturnType<typeof setTimeout>;
    terminated?: boolean;
  }

  const { current } = useRef<State<T>>({});

  function set (newVal : T | undefined) {
    current.lastVal = newVal;
    cancelTimer();
    if (newVal !== undefined) startTimer();
  }

  function cancelTimer () {
    if (current.timeout !== undefined) clearTimeout(current.timeout);
    current.timeout = undefined;
  }

  function startTimer () {
    if (! current.terminated) {
      current.timeout = setTimeout(() => idleCallback(current.lastVal), delay);
    }
  }

  useEffect(() => function ownerComponentHasUnmapped() {
    current.terminated = true;
    cancelTimer();
  }, []);

  return set;
}
