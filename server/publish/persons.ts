/**
 * DDP API for persons
 */

import { Meteor } from 'meteor/meteor'
import { Person } from '/imports/api/persons'
import { fetchEPFLAPI } from '/imports/server/epfl_api'
import { Client as LDAPClient } from 'ldapts'
import { ensure, canQueryPersons } from "/server/policy"

const personSearchStringRegExp = /^[\p{Script=Latin}' -]+$/u,
      sciperRegExp = /^G?[0-9]+$/;

Meteor.publish("searchPersons", async function (personSearchString) {
  await ensure(canQueryPersons);
  ensureValidPersonSearchString(personSearchString);

  const response = await fetchEPFLAPI(`/v1/persons?query=${personSearchString}`);
  for (const person of response.persons) {
    this.added("persons", person.id, { ...person, searchResultFor: personSearchString });
  }
  this.ready();
})

function ensureValidPersonSearchString (personSearchString : string) {
  if (personSearchString.match(personSearchStringRegExp)) {
    return;
  } else if (personSearchString.match(sciperRegExp)) {
    return;
  } else {
    throw new Error("Bad search string");
  }
}

Meteor.publish("personAPI", async function (sciper : string) {
  await ensure(canQueryPersons);
  ensureValidSciper(sciper);

  const { authorizations } = await fetchEPFLAPI(
            `/v1/authorizations?persid=${sciper}&type=property&authid=11`);

  const person : Person =
        { ... await fetchEPFLAPI(`/v1/persons/${sciper}`),
          accreds: (await fetchEPFLAPI(`/v1/accreds?persid=${sciper}`)).accreds,
          ownEmailAddrAuth: authorizations.find((auth) => auth.status === 'active'),
        };

  this.added("persons", sciper, person as any);
  this.ready();
})

function ensureValidSciper (sciper : string) {
  if (! sciper.match(sciperRegExp)) {
    throw new Error("Bad SCIPER");
  }
}

Meteor.publish("personActiveDirectory", async function (sciper : string) {
  await ensure(canQueryPersons);
  ensureValidSciper(sciper);

  this.added("persons", sciper, { activeDirectory : await queryEPFLActiveDirectory(sciper) });
  this.ready();
});

async function queryEPFLActiveDirectory (sciper : string) {
  const bindDN = Meteor.settings.ad.username;
  const password = Meteor.settings.ad.password;
  const searchDN = 'dc=intranet,dc=epfl,dc=ch';

  let adResults:any = [];

  for (const ad of ["ad1", "ad2", "ad3", "ad5", "ad6"]) {
    const url = `ldap://${ad}.epfl.ch`;
    const client = new LDAPClient({ url });
    await client.bind(bindDN, password);
    const { searchEntries } = await client.search(searchDN, {
      scope: 'sub',
      filter: `(&(objectClass=organizationalPerson)(employeeID=${sciper})`,
    });

    adResults.push({
      adName: ad,
      adUrl: url,
      result: searchEntries
    })
  }

  let allBadPasswordTime : number[] = []
  let allBadPasswordCount : number[] = []

  adResults.forEach(ad => {
    if(ad?.result[0]?.badPasswordTime) {
      allBadPasswordTime.push(parseInt(ad.result[0].badPasswordTime))
    }
    if(ad.result[0]?.badPwdCount) {
      allBadPasswordCount.push(parseInt(ad.result[0].badPwdCount))
    }
  })

  const retval = adResults[0].result[0]
  if (allBadPasswordTime.length !== 0) {
    retval.badPasswordTime = Math.max(...allBadPasswordTime)
  }
  if (allBadPasswordCount.length !== 0) {
    retval.badPwdCount = Math.max(...allBadPasswordCount)
  }

  if (retval) {
    retval.baseUserAccountControl = retval.userAccountControl
    if(((retval.userAccountControl) & 0x00000002) !== 0) {
      retval.userAccountControl = 'Compte désactivé'
    } else if(((retval.userAccountControl) & 0x00000200) !== 0) {
      retval.userAccountControl = 'Compte activé'
    } else {
      retval.userAccountControl = 'Type de compte inconnu'
    }
  }

  return retval;
}

Meteor.publish("personScoldap", async function (sciper : string) {
  await ensure(canQueryPersons);
  ensureValidSciper(sciper);

  this.added("persons", sciper, { scoldap: await queryScoldap(sciper) });
  this.ready();
});

async function queryScoldap (sciper : string) {
  const client = new LDAPClient({ url: 'ldap://scoldap.epfl.ch' });
  const { searchEntries } = await client.search('o=epfl,c=ch', {
    scope: 'sub',
    filter: `(&(objectclass=EPFLorganizationalPerson)(uniqueIdentifier=${sciper}))`,
  });
  await client.unbind();

  return searchEntries[0];
}

Meteor.publish("personLdap", async function (sciper : string) {
  await ensure(canQueryPersons);
  ensureValidSciper(sciper);

  const ldap = await queryLdap(sciper);
  const person : Partial< Pick<Person, "ldap" | "automap"> > = { ldap };
  if (ldap.homeDirectory) {
    person.automap = await queryHomeAutomap(ldap.homeDirectory);
  }
  this.added("persons", sciper, person);
  this.ready();
});

async function queryLdap (sciper : string) {
  const client = new LDAPClient({ url : 'ldap://ldap.epfl.ch' });
  const { searchEntries } = await client.search(
    'o=epfl,c=ch', {
      scope: 'sub',
      filter: `(&(objectclass=EPFLorganizationalPerson)(uniqueIdentifier=${sciper}))`,
    });

  return searchEntries[0] as Person["ldap"];
}

async function queryHomeAutomap (homedir : string) {
  const client = new LDAPClient({ url : 'ldap://ldap.epfl.ch' });
  const { searchEntries } = await client.search(
    'ou=automaps,o=epfl,c=ch', {
      scope: 'sub',
      filter: `(cn=${homedir.split('/')[2]})`,
    });
  return searchEntries[0] as unknown as Person["automap"];
}
