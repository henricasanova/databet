import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

Template.AddUpdateUser.onRendered(function () {
  $('.ui.radio.checkbox').checkbox();
});

Template.AddUpdateUser.onCreated(function () {

  this.missing_name = new ReactiveVar();
  this.missing_username = new ReactiveVar();
  this.taken_username = new ReactiveVar();
  this.send_email = new ReactiveVar();

  Template.instance().missing_name.set(false);
  Template.instance().missing_username.set(false);
  Template.instance().taken_username.set(false);
  Template.instance().send_email.set(false);

});

//noinspection JSUnusedLocalSymbols,JSUnusedLocalSymbols,JSUnusedLocalSymbols,JSUnusedLocalSymbols
Template.AddUpdateUser.events({

  'click .cancel': function (e) {
    e.preventDefault();
    Template.currentData().set_to_false_when_done.set(false);
    return false;
  },

  'keydown #name': function (e) {
    Template.instance().missing_name.set(false);
  },

  'keydown #username': function (e) {
    Template.instance().missing_username.set(false);
    Template.instance().taken_username.set(false);
  },

  'click #sendEmailButton': function (e) {
    Template.instance().send_email.set(true);
  },

  'click #dontSendEmailButton': function (e) {
    Template.instance().send_email.set(false);
  },


  'click .submit': function (e) {
    e.preventDefault();


    var name = $('#name').val();
    var username = $('#username').val();
    var isAdmin = $('#isAdmin').is(":checked");
    var email = $('#email').val();
    var sendNotification = $('#sendEmail').is(":checked");

    var emailAddress = username + "@hawaii.edu";
    if (email != "") {
      emailAddress = email;
    }

    //console.log("NAME=", name);
    //console.log("USERNAME=", username);
    //console.log("isAdmin=", isAdmin);
    //console.log("email=", email);
    //console.log("sendNotification=", sendNotification);

    var allGood = true;

    if (!name || name.length < 5) {
      Template.instance().missing_name.set(true);
      allGood = false;
    }
    if (!username || username.length < 3) {
      Template.instance().missing_username.set(true);
      allGood = false;
    } else {
      if (Template.currentData().action == "add") {
        if (Meteor.users.findOne({"services.cas.id": username})) {
          Template.instance().taken_username.set(true);
          allGood = false;
        }
      }
    }


    if (!allGood)
      return false;


    if (Template.currentData().action == "add") {

      // At this point, we should be able to create a new user
      // We only Create CAS user

      var user = {
        createdAt: (new Date()).toString(),
        _id: Random.id(),
        services: {cas: {id: username}},
        profile: {name: username},
        username: username,
        name: name,
        email: emailAddress,
        is_admin: isAdmin,
        is_CAS: true
      };

      console.log("CREATING USER: ", user);
      Meteor.call("insert_into_collection", "Meteor.users", user);


      // Send e-mail notification
      if (sendNotification) {
        console.log("SENDING E_MAIL");
        Meteor.call("send_email", {
          to: emailAddress,
          from: "donotreply@databet.hawaii.edu",
          subject: "Welcome to DataBET",
          text: $('#notification_text').val()
        });
      }

    } else {
      console.log("UPDATING A USER");

      var userId = Template.currentData().userId;
      Meteor.call("update_in_collection", "Meteor.users", userId,
        {
          "name": name,
          "is_admin": isAdmin,
          "email": email
        });
    }

    // hide
    Template.currentData().set_to_false_when_done.set(false);

    return false;
  }

});

Template.AddUpdateUser.helpers({

  missing_name: function () {
    return Template.instance().missing_name.get();
  },
  missing_username: function () {
    return Template.instance().missing_username.get();
  },
  taken_username: function () {
    return Template.instance().taken_username.get();
  },
  send_email: function () {
    return Template.instance().send_email.get();
  },
  is_add: function () {
    return (Template.currentData().action == "add");
  },
  is_update: function () {
    return (Template.currentData().action == "update");
  },

  userToUpdate: function () {
    if (Template.currentData().userId) {
      return Meteor.users.findOne({"_id": Template.currentData().userId});
    } else {
      return null;
    }
  }


});
