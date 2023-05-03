import { Meteor } from 'meteor/meteor';
import { DigestUser, DigestUsersCollection } from '../imports/api/DigestUser';

async function insertDigestUser({ first_name, last_name, phone_number, sciper, gaspar, mail }: Pick<DigestUser, 'first_name' | 'last_name' | 'phone_number' | 'sciper' | 'gaspar' | 'mail'>) {
  await DigestUsersCollection.insertAsync({ first_name, last_name, phone_number, sciper, gaspar, mail });
}

Meteor.startup(async () => {
  // If the DigestUser collection is empty, add some data.
  if (await DigestUsersCollection.find().countAsync() === 0) {
    await insertDigestUser({
      first_name: 'Toto',
      last_name: 'Le Poto',
      phone_number: '0788945231',
      sciper: '123456',
      gaspar: 'lepoto',
      mail: 'toto.lepoto@example.com',
    });

    await insertDigestUser({
      first_name: 'Tutu',
      last_name: 'La Tortue',
      phone_number: '0788945231',
      sciper: '654321',
      gaspar: 'latortue',
      mail: 'tutu.latortue@example.com',
    });

    await insertDigestUser({
      first_name: 'Paul',
      last_name: 'Le Poulpe',
      phone_number: '0788945231',
      sciper: '111111',
      gaspar: 'lepoulpe',
      mail: 'paul.lepoulpe@example.com',
    });

    await insertDigestUser({
      first_name: 'Gigi',
      last_name: 'La Girafe',
      phone_number: '0788945231',
      sciper: '222222',
      gaspar: 'lagirafe',
      mail: 'gigi.lagirafe@example.com',
    });
  }

  // We publish the entire DigestUser collection to all clients.
  // In order to be fetched in real-time to the clients
  publishUnderPolicy("digestusers", function () {
    return DigestUsersCollection.find();
  });
});


function publishUnderPolicy (name : string, publishFunc : Function) {
  Meteor.publish(name, function (...details) {
      if (! isAllowed(Meteor.user(), name, details)) return [];
      return publishFunc(...details);
  })
}

function isAllowed(subject, object, details) {
  return !! subject;
}
