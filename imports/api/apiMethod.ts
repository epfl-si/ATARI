import { Meteor } from 'meteor/meteor';
import { ensure, canQueryPersons, canQueryUnits } from "/server/policy";
import { fetchEPFLAPI } from "/imports/server/epfl_api";

Meteor.methods({
    'getUser.sciper': async function(sciper) {
      await ensure(canQueryPersons);
      return await fetchEPFLAPI(`/v1/persons/${sciper}`);
    },
    'getUser.query': async function(query) {
      await ensure(canQueryPersons);
      return await fetchEPFLAPI(`/v1/persons?query=${query}`);
    },
    'getAccreds.sciper': async function(sciper) {
      await ensure(canQueryPersons);
      return await fetchEPFLAPI(`/v1/accreds?persid=${sciper}`);
    },
    'getAdminsIT.unit': async function(unitid) {
      await ensure(canQueryUnits);
      return await fetchEPFLAPI(`/v1/authorizations?resid=${unitid}&authid=adminit&type=role&alldata=1`);
    },
    'getOwnEmailAddressProperty.user': async function(sciper) {
      await ensure(canQueryPersons);
      return await fetchEPFLAPI(`/v1/authorizations?persid=${sciper}&type=property&authid=11`);
    }
})
