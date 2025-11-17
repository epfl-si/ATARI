import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

export interface InventoryEntry {
  header: string;
  softwareStatus: string;
  purchaseDate: Date;
  features: any;
};

/**
 * Client-only collection for subscription results
 *
 * @locus Client
 */
export const Inventory : Mongo.Collection<InventoryEntry> | null = Meteor.isServer ? null :
  new Mongo.Collection("inventory");
