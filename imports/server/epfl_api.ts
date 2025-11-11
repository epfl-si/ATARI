import { Meteor } from 'meteor/meteor';

export async function fetchEPFLAPI (uri : string) {
  const auth = Buffer.from(`${Meteor.settings.api.username}:${Meteor.settings.api.password}`).toString("base64");
  const response = await fetch(encodeURI(`https://api.epfl.ch${uri}`), {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Basic ${auth}`,
    },
  })
  return await response.json();
}
