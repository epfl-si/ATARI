import { Meteor } from 'meteor/meteor';
import { DigestUser, DigestUsersCollection } from '../imports/api/DigestUser';
async function insertDigestUser({ first_name, last_name, phone_number, sciper, gaspar, email }: Pick<DigestUser, 'first_name' | 'last_name' | 'phone_number' | 'sciper' | 'gaspar' | 'email'>) {
  await DigestUsersCollection.insertAsync({ first_name, last_name, phone_number, sciper, gaspar, email });
}
import '../imports/api/checkLDAPMethod';
import '../imports/api/inventoryMethod';
import '../imports/api/ADMethod';

Meteor.startup(async () => {
  // if (await DigestUsersCollection.find().countAsync() !== 0) {
  //   DigestUsersCollection.remove({})
  // }
    // 
  // If the DigestUser collection is empty, add some data.
  // if (await DigestUsersCollection.find().countAsync() === 0) {
  //   await insertDigestUser({
  //     first_name: 'Toto',
  //     last_name: 'Le Poto',
  //     phone_number: '0788945231',
  //     sciper: '123456',
  //     gaspar: 'lepoto',
  //     email: 'toto.lepoto@example.com',
  //   });

  //   await insertDigestUser({
  //     first_name: 'Tutu',
  //     last_name: 'La Tortue',
  //     phone_number: '0788945231',
  //     sciper: '654321',
  //     gaspar: 'latortue',
  //     email: 'tutu.latortue@example.com',
  //   });

  //   await insertDigestUser({
  //     first_name: 'Paul',
  //     last_name: 'Le Poulpe',
  //     phone_number: '0788945231',
  //     sciper: '111111',
  //     gaspar: 'lepoulpe',
  //     email: 'paul.lepoulpe@example.com',
  //   });

  //   await insertDigestUser({
  //     first_name: 'Gigi',
  //     last_name: 'La Girafe',
  //     phone_number: '0788945231',
  //     sciper: '222222',
  //     gaspar: 'lagirafe',
  //     email: 'gigi.lagirafe@example.com',
  //   });
  // }

  

  // We publish the entire DigestUser collection to all clients.
  // In order to be fetched in real-time to the clients
  // publishUnderPolicy("digestusers", function () {
  //   return DigestUsersCollection.find();
  // });
});


export function publishUnderPolicy (name : string, publishFunc : Function) {
  Meteor.publish(name, function (...details) {
      if (! isAllowed(Meteor.user(), name, details)) return [];
      return publishFunc.apply(this, details);
  })
}

function isAllowed(subject, object, details) {
  return !! subject;
}
