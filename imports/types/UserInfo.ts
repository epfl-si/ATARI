declare module "meteor/meteor" {
	module Meteor {
		interface User {
			given_name: String
			family_name: String
            groups: String[]   // Server only
            has_access_right: boolean  // Client only
		}
	}
}
