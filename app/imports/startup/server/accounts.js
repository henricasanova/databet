import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// /* eslint-disable no-console */
//
// /* When running app for first time, pass a settings file to set up a default user account. */
// if (Meteor.users.find().count() === 0) {
//   if (!!Meteor.settings.defaultAccount) {
//     Accounts.createUser({
//       username: Meteor.settings.defaultAccount.username,
//       password: Meteor.settings.defaultAccount.password,
//     });
//     console.log("Created default user");
//   } else {
//     console.log('No default user!  Please invoke meteor with a settings file.');
//   }
// }


Accounts.validateLoginAttempt(function (user) {

  //console.log("IN VALIDATE LOGIN ATTEMPT: USER=", user);

  if ("error" in user) {
    throw new Meteor.Error(403, "Invalid login (perhaps you never asked the DataBET admin for an account?)");
  }

  var userId = user.user._id;

  if (Meteor.users.find({_id: userId}).count() < 1) {
    throw new Meteor.Error(403, "Unknown user login");
  }

  // set roles
  var roles = [];
  roles.push('standard-user');
  if (user.user.is_admin) {
    roles.push('admin');
  }
  Roles.setUserRoles(userId, roles);

  return true;

});


// Most new users must be created from within the App
// Exceptions:
//     admin@
//     testuser@
Accounts.validateNewUser(function (user) {

  // console.log("IN VALIDATE NEW USER: USER=", user);

  var is_CAS = 'cas' in user.services;
  var username;

  if (is_CAS) {
    username = user.services.cas.id;
  } else {
    username = user.emails[0].address;
  }
  console.log("USERNAME = " + username);
  if (is_CAS || (!(username in Meteor.settings.authorized_nonCAS_users))) {
    console.log("** Rejecting creation of non-CAS account **");
    // Weirdly enough, this no longer works...
    //throw new Meteor.error(403, "Ask the DATABET admin for an account!");
    return false;

  }

  // Set properties
  var authorized_nonCAS_user = Meteor.settings.authorized_nonCAS_users[username];

  user.username = authorized_nonCAS_user.username;
  user.name = authorized_nonCAS_user.name;
  user.is_admin = authorized_nonCAS_user.is_admin;
  user.is_CAS = authorized_nonCAS_user.is_CAS;

  return true;

});

