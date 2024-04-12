import { Meteor } from 'meteor/meteor';
const { Client } = require('ldapts');


Meteor.methods({
    'checkLDAP.user': async function(sciper) {
        const url = 'ldap://ldap.epfl.ch';
        const searchDN = 'o=epfl,c=ch';
        
        const client = new Client({
          url
        });

        const { searchEntries, searchReferences } = await client.search(searchDN, {
            scope: 'sub',
            filter: `(&(objectclass=EPFLorganizationalPerson)(uniqueIdentifier=${sciper}))`,
        });

        await client.unbind();

        return searchEntries;
    },
    'scoLDAP.user': async function(sciper) {
        const url = 'ldap://scoldap.epfl.ch';
        const searchDN = 'o=epfl,c=ch';
        
        const client = new Client({
            url
        });

        const { searchEntries, searchReferences } = await client.search(searchDN, {
            scope: 'sub',
            filter: `(&(objectclass=EPFLorganizationalPerson)(uniqueIdentifier=${sciper}))`,
        });

        await client.unbind();

        return searchEntries;
    },
    'homedir.user': async function(username) {
        const url = 'ldap://ldap.epfl.ch';
        const searchDN = 'ou=automaps,o=epfl,c=ch';
        
        const client = new Client({
            url
        });

        const { searchEntries, searchReferences } = await client.search(searchDN, {
            scope: 'sub',
            filter: `(cn=${username})`,
        });

        await client.unbind();

        return searchEntries;
    }
})
