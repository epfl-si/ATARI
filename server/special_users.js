const { Client } = require('ldapts');

const url = 'ldap://ldap.epfl.ch';
const searchDN = 'o=epfl,c=ch';

const client = new Client({
  url
});

let usernamesList = []
let fullFirstNamesList = []
let mailsList = []
let fullLastNamesList = []
let fullDisplayNamesList = []

async function generateUsersList() {
    const { searchEntries, searchReferences } = await client.search(searchDN, {
        scope: 'sub',
        filter: '(&(objectclass=EPFLorganizationalPerson)(uniqueIdentifier=*))',
        timeLimit: 60000
    });

    searchEntries.map(user => {
        // Find all usernames
        let username;
        if(typeof(user['uid']) == 'object') {
            username = user['uid'].filter((value) => !value.includes('@'))
            if(username.length !== 0) {
                usernamesList.push(username[0])
            }
        }

        // Find all full first names (can have multiple first names)
        let fullFirstName;
        if(typeof(user['givenName']) == 'object') {
            fullFirstName = user['givenName'][user['givenName'].length -1]
        } else {
            fullFirstName = user['givenName']
        }
        fullFirstNamesList.push(fullFirstName)

        // Find all mails
        if(user['mail']) {
            let mail = user['mail']
            mailsList.push(mail)
        }

        // Find all last names (can have multiple last names)
        let fullLastName;
        if(typeof(user['sn']) == 'object') {
            fullLastName = user['sn'][user['sn'].length -1]
        } else {
            fullLastName = user['sn']
        }
        fullLastNamesList.push(fullLastName)

        // Find all full names (full first name + full last name)
        let fullDisplayName = user['displayName']
        fullDisplayNamesList.push(fullDisplayName)
    })

    const longestUsername = usernamesList.reduce(function(a, b) { return a.length > b.length ? a : b })
    const shortestUsername = usernamesList.reduce(function(a, b) { return a.length <= b.length ? a : b })

    const longestFullFirstName = fullFirstNamesList.reduce(function(a, b) { return a.length > b.length ? a : b })
    const shortestFullFirstName = fullFirstNamesList.reduce(function(a, b) { return a.length <= b.length ? a : b })

    const longestMail = mailsList.reduce(function(a, b) { return a.length > b.length ? a : b })
    const shortestMail = mailsList.reduce(function(a, b) { return a.length <= b.length ? a : b })

    const longestFullLastName = fullLastNamesList.reduce(function(a, b) { return a.length > b.length ? a : b })
    const shortestFullLastName = fullLastNamesList.reduce(function(a, b) { return a.length <= b.length ? a : b })

    const longestFullDisplayName = fullDisplayNamesList.reduce(function(a, b) { return a.length > b.length ? a : b })
    const shortestFullDisplayName = fullDisplayNamesList.reduce(function(a, b) { return a.length <= b.length ? a : b })

    console.log
(`
1) Prénom complet le plus long : ${longestFullFirstName}
2) Prénom complet le plus court : ${shortestFullFirstName}
2) Nom de famille complet le plus long : ${longestFullLastName}
3) Nom de famille complet le plus court : ${shortestFullLastName}
4) Nom complet le plus long : ${longestFullDisplayName}
5) Nom complet le plus court : ${shortestFullDisplayName}
6) Email le plus long : ${longestMail}
7) Email le plus court : ${shortestMail}
8) Username le plus long : ${longestUsername}
9) Username le plus court : ${shortestUsername}
`)

}

generateUsersList()
