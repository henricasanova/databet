import { Template } from 'meteor/templating';
import { Semesters } from '../../../api/databet_collections/Semesters.js';
import { Courses } from '../../../api/databet_collections/Courses.js';
import { OfferedCourses } from '../../../api/databet_collections/OfferedCourses.js';
import { AssessmentItems } from '../../../api/databet_collections/AssessmentItems.js';
import { Meteor } from 'meteor/meteor';


Template.EditSemester.onCreated(function() {
  this.missing_instructor = new ReactiveVar();
  this.missing_alphanumeric = new ReactiveVar();
  this.already_exists = new ReactiveVar();

  Template.instance().missing_instructor.set(false);
  Template.instance().missing_alphanumeric.set(false);
  Template.instance().already_exists.set(false);

});

Template.EditSemester.helpers({

  "missing_instructor": function() {
    return Template.instance().missing_instructor.get();
  },

  "missing_alphanumeric": function() {
    return Template.instance().missing_alphanumeric.get();
  },

  "already_exists": function() {
    return Template.instance().already_exists.get();
  },

  "semester_string": function() {
    var semester_id = FlowRouter.getParam('_id');
    var semester = Semesters.findOne({"_id": semester_id});
    return semester.session + " " + semester.year;
  },

  "semester_id": function() {
    return FlowRouter.getParam('_id');
  },

  "listOfCourses": function() {
    var semester_id = FlowRouter.getParam('_id');
    var semester = Semesters.findOne({"_id": semester_id});
    var curriculum_id = semester.curriculum;
    return Courses.find({"curriculum": curriculum_id}, {sort: {alphanumeric: 1}}).fetch();
  },

  "listOfUsers": function() {
    return Meteor.users.find({},{sort: {name: 1}});
  },

  "is_locked": function() {
    var semester_id = FlowRouter.getParam('_id');
    var semester = Semesters.findOne({"_id": semester_id});
    return semester.locked;
  },

  listOfCourseOfferings: function() {
    var semester_id = FlowRouter.getParam('_id');
    return OfferedCourses.find({"semester": semester_id}).fetch().sort(function(a,b) {
      let a_course = a.course;
      let b_course = b.course;
      let a_alpha = Courses.findOne({"_id": a_course}).alphanumeric;
      let b_alpha = Courses.findOne({"_id": b_course}).alphanumeric;
      if (a_alpha < b_alpha) {
        return -1;
      } else if (a_alpha > b_alpha) {
        return 1;
      } else {
        return 0;
      }
    });
  }
});

Template.EditSemester.events({

  'click #button_unlock': function (e) {

    var semester_id = FlowRouter.getParam('_id');

    $('#unlock_modal').
      modal({
        onDeny: function () {
          return true;
        },
        onApprove: function () {
			   Semesters.update_document(semester_id, {"locked": false});
          return true;
        }
      }).
      modal('show');
  },

  'click #button_lock': function (e) {
    var semester_id = FlowRouter.getParam('_id');
    Semesters.update_document(semester_id, {"locked": true});

  },

  'click #button_add_course_offering': function(e) {

    var course = $('#course_select').val();
    var instructor = $('#instructor_select').val();

    //console.log("COURSE = ", course);
    //console.log("INSTRUCTOR = ", instructor);

    var all_good = true;
    if (course.length == "") {
      Template.instance().missing_alphanumeric.set(true);
      all_good = false;
    }

    if (instructor == "") {
      Template.instance().missing_instructor.set(true);
      all_good = false;
    }

    if (!all_good) {
      return false;
    }

    var offered_course = {
      "course": course,
      "instructor": instructor,
      "semester": FlowRouter.getParam('_id'),
      "archived": false,
      "toassess": true,
      "syllabus": undefined
    };

    if (OfferedCourses.findOne(offered_course)) {
      Template.instance().already_exists.set(true);
      return false;
    }

    OfferedCourses.insert_document(offered_course);

    $('#course_select>option:eq(0)').prop('selected', true);
    $('#instructor_select>option:eq(0)').prop('selected', true);

    return false;
  },


  'change #course_select': function(e) {
    Template.instance().missing_alphanumeric.set(false);
    Template.instance().already_exists.set(false);

  },

  'change #instructor_select': function(e) {
    Template.instance().missing_instructor.set(false);
    Template.instance().already_exists.set(false);
  }

});



Template.CourseOfferingsRow.onCreated(function() {

  this.uploaded_syllabus = null;

});



Template.CourseOfferingsRow.helpers({

  "syllabus_upload_context": function () {
    return generic_file_upload_context("syllabus");
  },

  "course_alphanumeric": function() {
    return Courses.findOne({"_id": this.course}).alphanumeric;
  },

  "instructor_name": function() {
    return Meteor.users.findOne({"_id": this.instructor}).name;
  },

  "syllabus": function() {
    return this.syllabus;
  },

  "num_assessment_items": function() {
    return AssessmentItems.find({"offered_course": this._id}).count();
  },

  "semester_is_locked": function() {
    let semester = Semesters.findOne({"_id": this.semester});
    return semester.locked;
  },

  "to_assess": function() {
    return this.toassess;
  }
});

Template.CourseOfferingsRow.events({

  "change .assesscheckbox": function(e) {
    let course_offering_id = this._id;
    let checked = $("#" + e.currentTarget.id).is(":checked");

    OfferedCourses.update_document(course_offering_id, {"toassess": checked});

  },

  "click .delete_course_offering": function(e) {

    let course_offering_id = this._id;

    $('#delete_course_offering_modal').
      modal({
        onDeny: function () {
          return true;
        },
        onApprove: function () {
          $('#delete_course_offering_modal').modal('hide');
	  OfferedCourses.remove_document(course_offering_id);
          return true;
        }
      }).
      modal('show');

  }

});


