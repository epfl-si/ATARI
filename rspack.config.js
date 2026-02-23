import { defineConfig } from "@meteorjs/rspack";
import { TsCheckerRspackPlugin } from "ts-checker-rspack-plugin";

/**
 * Rspack configuration for Meteor projects.
 */
export default defineConfig((/* Meteor */) => {
  return {
    plugins: [
      // Provide typed flags on the `Meteor` object, such as:
      //
      // - `Meteor.isClient` / `Meteor.isServer`
      // - `Meteor.isDevelopment` / `Meteor.isProduction`
      //
      // and more:
      new TsCheckerRspackPlugin()
    ],
  };
});
