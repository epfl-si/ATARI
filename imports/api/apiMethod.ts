import { Meteor } from 'meteor/meteor';
import { ensure, canQueryPersons, canQueryUnits } from "/server/policy";
import { fetchEPFLAPI } from "/imports/server/epfl_api";

Meteor.methods({
    'getUser.query': async function(query) {
      await ensure(canQueryPersons);
      return await fetchEPFLAPI(`/v1/persons?query=${query}`);
    },
    'getAdminsIT.unit': async function(unitid) {
      await ensure(canQueryUnits);
      return await fetchEPFLAPI(`/v1/authorizations?resid=${unitid}&authid=adminit&type=role&alldata=1`);
    },
});
