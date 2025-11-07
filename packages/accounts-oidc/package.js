Package.describe({
  name: "epfl:accounts-oidc",
  summary: "OpenID Connect (OIDC) for Meteor 3.x",
  version: "0.1.0",
//  git: "https://github.com/epfl-si/meteor-accounts-oidc.git",
});

Package.onUse(function(api) {
  api.versionsFrom('3.0');
  api.use('ecmascript');
  api.use('typescript');

  api.use('accounts-oauth');  // for Accounts.oauth.registerService
  api.use('oauth2');
  api.use('service-configuration');
  api.use('random');

  // These have the same effect as putting stuff under `server/` or
  // `client/` in your Meteor app, i.e. the corresponding files are
  // bundled (along with their tree-shaken dependencies), and also
  // executed at application startup time:
  api.addFiles(['accounts-oidc-server.ts'], 'server');
  api.addFiles(['accounts-oidc-client.ts'], 'client');

  // As per https://docs.meteor.com/packages/modules.html#modular-package-structure ,
  // this is the part that makes caller's
  //
  //     import { OIDC } from "meteor/epfl:accounts-oidc"
  //
  // work, as in, set `OIDC` to something else than `undefined`:
  api.use('modules');
  api.mainModule('index.ts');

  // This is the part that achieves same for TypeScript typings
  // (see the documentation thereof, and `./package-types.json`):
  api.use('zodern:types');
  // ... although (at least if the package is in-tree), you may need
  // to additionally rig your `tsconfig.json` with
  //
  //   "compilerOptions": {
  //     "paths": {
  //       "meteor/epfl:accounts-oidc": [
  //         "./.meteor/local/types/packages.d.ts"
  //       ]
  //     }
  //   }
  //
  // ⚠ Mind the `./` in `./.meteor`, as `"baseUri": "."` is out of
  // fashion these days.
});
