/**
 * DDP API for inventory
 */

import { Meteor } from 'meteor/meteor'
import { ensure, canQueryInventory } from "/server/policy"
import { InventoryEntry } from '/imports/api/inventory'
import { parse } from 'node-html-parser'

const zztoolsFormHome = 'https://zzztools.epfl.ch/inventaire/default.aspx';

Meteor.publish("inventory", async function (yellowStickerCode) {
  await ensure(canQueryInventory);
  ensureValidYellowStickercode(yellowStickerCode);

  const inventoryDocument : InventoryEntry | undefined =
        parseZztoolsResponse(await queryInventory(yellowStickerCode));

  if (inventoryDocument) {
    this.added("inventory", yellowStickerCode, inventoryDocument as Record<string, any>);
  }
  this.ready();
});

async function queryInventory (yellowStickerCode : string) : Promise<string> {
  const payload = {
    'ctl00$ContentPlaceHolder1$TextBox1': yellowStickerCode,
    'ctl00$ContentPlaceHolder1$Button1':  'OK',
    ...await getHiddenFields()
  };

  const response = await fetch(zztoolsFormHome, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: new URLSearchParams(payload).toString()
  });
  return await response.text();
}


const hiddenFieldRegex = /<input type="hidden"[^>]* name="([^"]*)"[^>]* value="([^"]*)"[^>]*\/>/g;
let hiddenFields : { [name : string] : string };

async function getHiddenFields () {
    if (hiddenFields === undefined) {
        hiddenFields = {};
        const blankForm = await (await fetch(zztoolsFormHome)).text();

        for (const [_, name, value] of blankForm.matchAll(hiddenFieldRegex)) {
            hiddenFields[name] = value;
        }
    }
    return hiddenFields;
}

const yellowStickerCodeRegexp = /^[A-Z][0-9]+$/;

function ensureValidYellowStickercode (yellowStickerCode : string) {
  if (! yellowStickerCode.match(yellowStickerCodeRegexp)) {
    throw new Error("Bad yellow sticker code");
  }
}

function parseZztoolsResponse (zzHTML : string) {
  const parsedHtml = parse(zzHTML);

  if (-1 != zzHTML.indexOf("AUCUN EQUIPEMENT NE CORRESPOND")) return undefined;

  const header = parsedHtml.querySelector('#ctl00_ContentPlaceHolder1_Label1')?.childNodes[0].childNodes[0].rawText;
  const softwareStatus = parsedHtml.querySelector('#ctl00_ContentPlaceHolder1_Label2')?.childNodes[0].childNodes[0].childNodes[0].rawText;

  let purchaseDate : Date;
  const features = parsedHtml.querySelector('#ctl00_ContentPlaceHolder1_Label1')?.childNodes.flatMap(e => {

    const nodeText = e.toString();
    if (nodeText.startsWith('<')) return [];

    let [key, value] = nodeText.split(' = ');
    if (! value) return [];
    key = key.replace(/^[ >]*/, "");

    if (key === 'ANSDT') {
      const dateArray = value.match(/^(\d{4})(\d{2})(\d{2})$/).slice(1);
      purchaseDate = new Date(parseInt(dateArray[0]), parseInt(dateArray[1]) - 1, parseInt(dateArray[2]));
      return [[key, purchaseDate]];
    } else {
      return [[key, value]];
    }
  });

  return { header, softwareStatus, purchaseDate, features: Object.fromEntries(features) }
}
