import { defineConfig } from "@meteorjs/rspack";
import { rspack } from '@rspack/core';
import { TsCheckerRspackPlugin } from "ts-checker-rspack-plugin";

/**
 * Rspack configuration for Meteor projects.
 */
export default defineConfig((Meteor) => {
  return {
    plugins: [
      !Meteor.isBuild && new TsCheckerRspackPlugin()
    ],
  };
});
