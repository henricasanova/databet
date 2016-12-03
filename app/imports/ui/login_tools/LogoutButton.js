import { Template } from 'meteor/templating';
import { AccountsTemplates } from 'meteor/useraccounts:core';

Template.LogoutButton.events({

  'click .logout': function(e) {
    console.log("LOG OUT!!!");
    e.preventDefault();
    // Standard Logout (in case logged in as non-CAS)
    Meteor.logout();
    // CAS logout
    AccountsTemplates.logout()
    // Go to homepage
    FlowRouter.go('Home');
    return false;
  },

});

