import { Template } from 'meteor/templating';
import { AccountsTemplates } from 'meteor/useraccounts:core';


Template.LogoutButton.events({

  'click .logout': function(e) {
    e.preventDefault();
    // CAS logout
    AccountsTemplates.logout();
    // Standard Logout (in case logged in as non-CAS)
    Meteor.logout(function () {FlowRouter.go('Home_Page');});

    return false;
  },

});
