import { Meteor } from 'meteor/meteor';
import { fetch } from 'meteor/fetch';
import settings from '../../settings.json';

Meteor.methods({
    'getUser.sciper': async function(sciper) {
        const auth = Buffer.from(`${settings.api.username}:${settings.api.password}`).toString("base64");
        return fetch(`https://api.epfl.ch/v1/persons/${sciper}`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Basic ${auth}`,
          },
        })
        .then((response) => response.json())
        .then((response) => {
            return response;
        });
        
    },
    'getUser.query': async function(query) {
      const auth = Buffer.from(`${settings.api.username}:${settings.api.password}`).toString("base64");
      return fetch(`https://api-preprod.epfl.ch/v1/persons?query=${query}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Basic ${auth}`,
        },
      })
      .then((response) => response.json())
      .then((response) => {
          return response;
      });
    
    },
    'getAccreds.sciper': async function(sciper) {
      const auth = Buffer.from(`${settings.api.username}:${settings.api.password}`).toString("base64");
      return fetch(`https://api.epfl.ch/v1/accreds?persid=${sciper}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Basic ${auth}`,
        },
      })
      .then((response) => response.json())
      .then((response) => {
          return response;
      });
    
    },
    'getAdminsIT.unit': async function(unitid) {
      const auth = Buffer.from(`${settings.api.username}:${settings.api.password}`).toString("base64");
      return fetch(`https://api.epfl.ch/v1/authorizations?resid=${unitid}&authid=adminit&type=role`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Basic ${auth}`,
        },
      })
      .then((response) => response.json())
      .then((response) => {
          return response;
      });
    
    }
})
