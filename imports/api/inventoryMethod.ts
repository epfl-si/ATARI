import { Meteor } from 'meteor/meteor';
import { fetch } from 'meteor/fetch';
import { ensure, canQueryInventory } from "/server/policy";

Meteor.methods({
    'checkInventory.inventoryNumber': async function(inventoryNumber) {
        await ensure(canQueryInventory);
        const viewstate = '/wEPDwULLTE3NDI5NTY5MjEPZBYCZg9kFgICAQ9kFgQCAw8PFgIeBFRleHQFBDIwMTlkZAIFDw8WAh8ABRImbmJzcDsmbmJzcDsmbmJzcDtkZGQnjKQXSJB9+8frbaKVFavOwPeEdQ=='
        const viewstateGenerator = '82FF7E29'
        const eventval = '/wEWAwLz84SMBgLc3uCnBAKA4sljyHPDmcQFnRVpw78LCG65+A618GI='
        const payload = {'ctl00$ContentPlaceHolder1$TextBox1' : inventoryNumber, 'ctl00$ContentPlaceHolder1$Button1':'OK',
            '__EVENTVALIDATION' : eventval, '__VIEWSTATE' : viewstate, '__VIEWSTATEGENERATOR' : viewstateGenerator,
            '__LASTFOCUS' : '', '__EVENTTARGET' : '', '__EVENTARGUMENT' : ''
        }

        var formBody:any = [];
        for (var property in payload) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(payload[property])
            formBody.push(`${encodedKey}=${encodedValue}`)
        }
        formBody = formBody.join("&");

        const response = await fetch('https://zzztools.epfl.ch/inventaire/default.aspx', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
        });
        const data = await response.text()
        return data;

    }
})
