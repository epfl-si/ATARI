import { Meteor } from 'meteor/meteor';
import { Link, LinksCollection } from '/imports/api/links';

async function insertLink({ title, url }: Pick<Link, 'title' | 'url'>) {
  await LinksCollection.insertAsync({ title, url, createdAt: new Date() });
}

Meteor.startup(async () => {
  // If the Links collection is empty, add some data.
  if (await LinksCollection.find().countAsync() === 0) {
    await insertLink({
      title: 'Do the Tutorial',
      url: 'https://www.meteor.com/tutorials/react/creating-an-app',
    });

    await insertLink({
      title: 'Follow the Guide',
      url: 'https://guide.meteor.com',
    });

    await insertLink({
      title: 'Read the Docs',
      url: 'https://docs.meteor.com',
    });

    await insertLink({
      title: 'Discussions',
      url: 'https://forums.meteor.com',
    });
  }

  // We publish the entire Links collection to all clients.
  // In order to be fetched in real-time to the clients
  publishUnderPolicy("links", function () {
    return LinksCollection.find();
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
