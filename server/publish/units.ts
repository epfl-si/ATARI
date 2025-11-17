import { Meteor } from 'meteor/meteor';
import { ensure, canQueryUnits } from "/server/policy";
import { fetchEPFLAPI } from "/imports/server/epfl_api";

Meteor.publish("unitAdminIT", async function(unitId : number) {
  await ensure(canQueryUnits);
  ensureValidUnitID(unitId);

  const { authorizations } = await fetchEPFLAPI(`/v1/authorizations?resid=${unitId}&authid=adminit&type=role&alldata=1`);
  if (authorizations) {
    this.added("units", String(unitId), { authorizations });
  }
  this.ready();
});

function ensureValidUnitID (unitId : number) {
  if (typeof(unitId) !== "number") {
    throw new Error("Bad unit ID");
  }
}
