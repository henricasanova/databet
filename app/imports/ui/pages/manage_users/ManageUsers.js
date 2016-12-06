import { Template } from 'meteor/templating';
import { OfferedCourses } from '../../../api/databet_collections/OfferedCourses';
import { AssessmentItems } from '../../../api/databet_collections/AssessmentItems';
import { Meteor } from 'meteor/meteor';
import { userid_to_username } from '../../../ui/global_helpers/users_and_usernames';

Template.ManageUsers.onCreated(function () {

  this.add_user_mode = new ReactiveVar();
  Template.instance().add_user_mode.set(false);
  this.update_user_mode = new ReactiveVar();
  Template.instance().update_user_mode.set(false);

});

Template.ManageUsers.helpers({

  listOfUsers: function () {
    return Meteor.users.find().fetch();
  },

  add_user_mode: function () {
    return Template.instance().add_user_mode.get();
  },

  get_reference_to_reactive_var_add_user_mode: function () {
    return Template.instance().add_user_mode;
  },

  get_reference_to_reactive_var_update_user_mode: function () {
    return Template.instance().update_user_mode;
  }

});


//noinspection JSUnusedLocalSymbols
Template.ManageUsers.events({

  'click #button_add_user': function (e) {
    Template.instance().add_user_mode.set(true);
  }

});


/*  USER ROW */

Template.userRow.onRendered(function () {

  this.$('.ui.checkbox').checkbox();

  // TODO: FIX the closure problem below
  Tracker.autorun(function () {
    this.$('.ui.checkbox').checkbox();

  });

});

Template.userRow.onCreated(function () {


  this.edit_user_mode = new ReactiveVar();

  Template.instance().edit_user_mode.set(false);

});

Template.userRow.events({

  'click .delete_user': function (e) {
    e.preventDefault();

    var userId = this._id;

    $('#modal_' + userId).modal({
        onDeny: function () {
          return true;
        },
        onApprove: function () {
          $('#modal_' + userId).modal('hide');
          Meteor.call("delete_from_collection", "Meteor.users", userId);
          return true;
        }
      })
      .modal('show')
    ;


    return false;
  },

  'click .edit_user': function (e) {
    e.preventDefault();
    Template.instance().edit_user_mode.set(true);
  },

});

Template.userRow.helpers({

  userId: function () {
    return this._id;
  },

  userName: function () {
    return userid_to_username(this._id);
  },

  userType: function () {
    if (this.is_CAS) {
      return "CAS"
    } else {
      return "Preset";
    }
  },

  isAdmin: function () {
    if (this.is_admin) {
      return "Yes";
    } else {
      return "No";
    }
  },

  name: function () {
    if (this.name) {
      return this.name;
    } else {
      return "-";
    }
  },

  num_offered_courses: function () {
    return OfferedCourses.find({"instructor": this._id}).count();
  },

  num_assessment_items: function () {
    var offered_courses = OfferedCourses.find({"instructor": this._id}).fetch();

    var num_assessment_items = 0;
    for (var i = 0; i < offered_courses.length; i++) {
      num_assessment_items += AssessmentItems.find({"offered_course": offered_courses[i]}).count();
    }

    return num_assessment_items;
  },

  not_this_user: function () {
    return (this._id != Meteor.userId());
  },

  edit_user_mode: function () {
    return Template.instance().edit_user_mode.get();
  },

  get_reference_to_reactive_var_update_user_mode: function () {
    return Template.instance().edit_user_mode;
  }

});
