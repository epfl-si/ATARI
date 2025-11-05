import { Meteor } from 'meteor/meteor';
import { ensure, canQueryPersons } from "/server/policy";

const { Client } = require('ldapts');

Meteor.methods({
    'AD.user': async function(sciper) {
        await ensure(canQueryPersons);
        const bindDN = Meteor.settings.ad.username;
        const password = Meteor.settings.ad.password;
        const searchDN = 'dc=intranet,dc=epfl,dc=ch';

        let activeDirectories:any = [
            {
                "name": "ad1",
                "url": "ldap://ad1.epfl.ch"
            },
            {
                "name": "ad2",
                "url": "ldap://ad2.epfl.ch"
            },
            {
                "name": "ad3",
                "url": "ldap://ad3.epfl.ch"
            },
            {
                "name": "ad5",
                "url": "ldap://ad5.epfl.ch"
            },
            {
                "name": "ad6",
                "url": "ldap://ad6.epfl.ch"
            },
        ]

        let adResults:any = [];

        for (let index = 0; index < activeDirectories.length; index++) {
            const ad = activeDirectories[index];
            const client = new Client({
                url: ad.url
            });
            await client.bind(bindDN, password);
            const { searchEntries, searchReferences } = await client.search(searchDN, {
                scope: 'sub',
                filter: `(&(objectClass=organizationalPerson)(employeeID=${sciper})`,
            });
            
            adResults.push({
                adName: ad.name,
                adUrl: ad.url,
                result: searchEntries
            })

            if(index == activeDirectories.length - 1) {

                let allBadPasswordTime:any = []
                let allBadPasswordCount:any = []

                adResults.forEach(ad => {
                    if(ad.result[0]) {
                        if(ad.result[0].badPasswordTime) {
                            allBadPasswordTime.push(parseInt(ad.result[0].badPasswordTime))
                        }
                        if(ad.result[0].badPwdCount) {
                            allBadPasswordCount.push(parseInt(ad.result[0].badPwdCount))
                        }
                    }
                })
                if(allBadPasswordTime.length !== 0) {
                    adResults[0].result[0].badPasswordTime = allBadPasswordTime.sort((a,b)=>a-b).reverse()[0]
                }
                if(allBadPasswordCount.length !== 0) {
                    adResults[0].result[0].badPwdCount = allBadPasswordCount.sort((a,b)=>a-b).reverse()[0]
                }

                if(adResults[0].result[0]) {
                    adResults[0].result[0].baseUserAccountControl = adResults[0].result[0].userAccountControl
                    if(((adResults[0].result[0].userAccountControl) & 0x00000002) !== 0) {
                        adResults[0].result[0].userAccountControl = 'Compte désactivé'
                    } else if(((adResults[0].result[0].userAccountControl) & 0x00000200) !== 0) {
                        adResults[0].result[0].userAccountControl = 'Compte activé'
                    } else {
                        adResults[0].result[0].userAccountControl = 'Type de compte inconnu'
                    }
                }

                return adResults[0].result
            }
        }
    }
})
