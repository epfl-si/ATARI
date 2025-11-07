declare module 'meteor/accounts-base' {
  import { Meteor } from 'meteor/meteor'
  namespace Accounts {
    // https://github.com/meteor/meteor/blob/master/packages/accounts-base/accounts_common.js
    declare class LoginCancelledError extends Error {
      static numericError : number;
    }

    // https://github.com/meteor/meteor/blob/master/packages/accounts-base/accounts_server.js
    function addAutopublishFields (
      opts: {
        forLoggedInUser: string[],
        forOtherUsers: string[]
      }
    )

    // https://github.com/meteor/meteor/blob/master/packages/accounts-base/accounts_client.js
    export function registerClientLoginFunction (
      funcName: string,
      func: Function
    )

    export function applyLoginFunction (
      funcName: string,
      args: any[]
    )

    export const oauth: {
      // https://github.com/meteor/meteor/blob/master/packages/accounts-oauth/oauth_common.js
      registerService(
        serviceName: string
      )

      // https://github.com/meteor/meteor/blob/master/packages/accounts-oauth/oauth_client.js
      tryLoginAfterPopupClosed (token: string, callback: (error : Error) => void)
    }
  }
}
