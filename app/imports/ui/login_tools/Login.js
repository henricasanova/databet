import { Template } from 'meteor/templating';
import { AccountsTemplates } from 'meteor/useraccounts:core';

Template.Login.events({

  'click .cas-login': function(e) {
    e.preventDefault();
    var callback = function loginCallback(error){
      if (error) {
        console.log(error.reason);
        alert(error.reason);
      }
    };
    Meteor.loginWithCas(callback);
    return false;
  }
});

AccountsTemplates.configure({
  texts: {
    title: {
      //changePwd: "Password Title",
      //enrollAccount: "Enroll Title",
      //forgotPwd: "Forgot Pwd Title",
      //resetPwd: "Reset Pwd Title",
      signIn: "Sign in with preset account",
      //signUp: "Sign Up Title STUFF",
      //verifyEmail: "Verify Email Title",
    }
  }
});

