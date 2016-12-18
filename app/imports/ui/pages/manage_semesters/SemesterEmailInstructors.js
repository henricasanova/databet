import { _ } from 'meteor/underscore';
import { OfferedCourses } from '../../../api/databet_collections/OfferedCourses.js';
import { Meteor } from 'meteor/meteor';
import { semesterid_to_semesterstring } from '../../../api/global_helpers/semesters';

Template.SemesterEmailInstructors.onCreated(function () {
  this.email_has_been_sent = new ReactiveVar();

  Template.instance().email_has_been_sent.set(false);
});


Template.SemesterEmailInstructors.helpers({

  "is_before": function() {
    return (Template.currentData().type == "before");
  },

  "is_after": function() {
    return (Template.currentData().type == "after");
  },

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
  },

  "are_there_recipients": function() {
    var distribution_list = compute_distribution_list();
    return (distribution_list.length > 0);
  }

});

//noinspection JSUnusedLocalSymbols
Template.SemesterEmailInstructors.events({

  "click #button_send_email": function(e) {
    var subject_line = $('#email_subject').val();
    var cc = $('#cc').val();
    var body = $('#email_body').val();



    var distribution_list = compute_distribution_list();
    console.log("DISTRIBUTION_LIST = ", distribution_list);

    for (var i=0; i < distribution_list[0].length; i++) {
      var processed_body = process_body(body, distribution_list[0][i]);
      // Meteor.call("send_email", {
      console.log("EMAIL TO BE SENT: ", {
        to: distribution_list[1][i],
        from: "donotreply@databet.hawaii.edu",
        cc: cc,
        subject: subject_line,
        text: processed_body
      });
    }

    Template.instance().email_has_been_sent.set(true);
  }

});


Template.ListOfUsersEmails.helpers({

  "list_of_user_emails": function () {
    return compute_distribution_list()[1];
  },
});


/*** Helper function ***/

function process_body(original_body, user_id) {
  var processed_body;
  var course_info = "TO_IMPLEMENT";

  processed_body = original_body.replace(/COURSE_INFO/, course_info);

  return processed_body;

}




function compute_distribution_list() {

  var semester_id = FlowRouter.getParam("_id");
  var offered_courses = OfferedCourses.find({"semester": semester_id, "archived": false}).fetch();
  var user_ids = _.map(offered_courses, function(e) {return e.instructor;});
  var user_ids = _.uniq(user_ids);
  var user_list = Meteor.users.find({_id: {$in: user_ids}}).fetch();
  user_list = _.uniq(user_list);


  var e_mail_list =  _.map(user_list, function(e) {
                      if (e.emails) { return e.name + " <" + e.emails[0].address + ">  ";}
                      if (e.email) { return e.name + " <" + e.email + "> ";}
                      return ""; });

  return [user_ids, e_mail_list];
}
