const ldap = require('ldapjs');
const client = ldap.createClient({
    url: 'ldap://ldap.epfl.ch'
});

const opts = {
    filter: `(&(objectclass=EPFLorganizationalPerson)(uniqueIdentifier=*))`,
    scope: 'sub',
    timeLimit: 60000
};

let usernamesList = []
let fullFirstNamesList = []
let mailsList = []
let fullLastNamesList = []
let fullDisplayNamesList = []
    
client.search('o=epfl,c=ch', opts, (err, res) => {
    res.on('searchEntry', async (entry) => {
        // Find all usernames
        let username = entry.pojo.attributes.find(obj => obj.type == 'uid').values.filter((value) => !value.includes('@'))
        if(username.length !== 0) {
            usernamesList.push(username[0])
        }

        // Find all full first names (can have multiple first names)
        let fullFirstName = entry.pojo.attributes.find(obj => obj.type == 'givenName').values[0]
        fullFirstNamesList.push(fullFirstName)

        // Find all mails
        if(entry.pojo.attributes.find(obj => obj.type == 'mail')) {
            let mail = entry.pojo.attributes.find(obj => obj.type == 'mail').values[0]
            mailsList.push(mail)
        }

        // Find all last names (can have multiple last names)
        let fullLastName = entry.pojo.attributes.find(obj => obj.type == 'sn').values[0]
        fullLastNamesList.push(fullLastName)

        // Find all full names (full first name + full last name)
        let fullDisplayName = entry.pojo.attributes.find(obj => obj.type == 'displayName').values[0]
        fullDisplayNamesList.push(fullDisplayName)
    })

    res.on('end', async() => {
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

    })
});