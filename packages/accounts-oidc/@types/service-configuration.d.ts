declare module 'meteor/service-configuration' {
  // Cherry-picked from https://github.com/meteor/meteor/blob/master/packages/service-configuration/service-configuration.d.ts

  import { Mongo } from 'meteor/mongo';

  interface Configuration {
    appId: string;
    secret: string;
  }

  namespace ServiceConfiguration {
    declare const configurations: InstanceType<Mongo.CollectionStatic<Configuration>>;
    declare class ConfigError extends Error {
      constructor(serviceName?: string);
      message: string;
    }
  }
}
