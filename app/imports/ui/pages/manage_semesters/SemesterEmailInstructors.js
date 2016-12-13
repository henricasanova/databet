import { _ } from 'meteor/underscore';
import { OfferedCourses } from '../../../api/databet_collections/OfferedCourses.js';
import { Meteor } from 'meteor/meteor';
import { semesterid_to_semesterstring } from '../../../ui/global_helpers/semesters';

Template.SemesterEmailInstructors.onCreated(function () {
  this.email_has_been_sent = new ReactiveVar();

  Template.instance().email_has_been_sent.set(false);
});


Template.SemesterEmailInstructors.helpers({

  "email_has_been_sent": function() {
    return Template.instance().email_has_been_sent.get();
  },

  "default_cc_list": function() {
    return "Henri Casanova <henric@hawaii.edu>";
  },

  "semester_id": function() {
    return FlowRouter.getParam("_id");
  },

  "semester_string": function() {
    var semester_id = FlowRouter.getParam("_id");
    return semesterid_to_semesterstring(semester_id);
  }

});

//noinspection JSUnusedLocalSymbols
Template.SemesterEmailInstructors.events({

  "click #button_send_email": function(e) {
    var subject_line = $('#email_subject').val();
    var cc = $('#cc').val();
    var body = $('#email_body').val();

    var semester_id = FlowRouter.getParam("_id");
    var offered_courses = OfferedCourses.find({"semester": semester_id}).fetch();
    var user_list = _.map(offered_courses, function(e) {return Meteor.users.findOne({"_id": e.instructor});});
    var email_list = compute_email_list(user_list);

    for (var i=0; i < email_list.length; i++) {
      Meteor.call("send_email", {
        to: email_list[i],
        from: "donotreply@databet.hawaii.edu",
        cc: cc,
        subject: subject_line,
        text: body
      });
    }

    Template.instance().email_has_been_sent.set(true);
  }

});

Template.ListOfUsersEmails.helpers({

  "list_of_user_emails": function () {
    var semester_id = FlowRouter.getParam("_id");

    var offered_courses = OfferedCourses.find({"semester": semester_id}).fetch();
    var user_list = _.map(offered_courses, function(e) {console.log(e.instructor);return Meteor.users.findOne({"_id": e.instructor});});
    return compute_email_list(user_list);
  },
});


/*** Helper function ***/

function compute_email_list(user_array) {

  var e_mail_list =  _.map(user_array, function(e) {
                      if (e.emails) { return e.name + " <" + e.emails[0].address + ">  ";}
                      if (e.email) { return e.name + " <" + e.email + "> ";}
                      return ""; });
  var uniq_list = [];
  for (var i=0; i < e_mail_list.length; i++) {
    if ((e_mail_list[i] != "") && (uniq_list.indexOf(e_mail_list[i]) == -1)) {
      uniq_list.push(e_mail_list[i]);
    }
  }
  return uniq_list;
}
