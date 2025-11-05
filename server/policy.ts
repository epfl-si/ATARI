import { Meteor } from "meteor/meteor";

async function canUseApp() {
  const user = await Meteor.userAsync()
  return user?.services?.oidc?.claims?.groups?.some((g) => g === Meteor.settings.security.accessGroup)
}

export async function canQueryPersons() {
  return canUseApp()
}


export async function canQueryUnits() {
  return canUseApp()
}

export async function canQueryInventory() {
  return canUseApp()
}

export async function ensure (...cans: (() => boolean | Promise<boolean>)[]) {
  for (const can of cans) {
    if (! await can()) {
      throw new Meteor.Error("not-authorized");
    }
  }
}
