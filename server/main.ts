import { Meteor } from 'meteor/meteor';
import '../imports/api/checkLDAPMethod';
import '../imports/api/inventoryMethod';
import '../imports/api/ADMethod';
import '../imports/api/apiMethod';

export function publishUnderPolicy (name : string, publishFunc : Function) {
  Meteor.publish(name, function (...details) {
      if (! isAllowed(Meteor.user(), name, details)) return [];
      return publishFunc.apply(this, details);
  })
}

function isAllowed(subject, object, details) {
  return !! subject;
}
