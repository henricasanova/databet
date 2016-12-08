import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Courses } from '../../../../api/databet_collections/Courses';
import { OfferedCourses } from '../../../../api/databet_collections/OfferedCourses';
import { AssessmentItems } from '../../../../api/databet_collections/AssessmentItems';

Template.EditCurriculumCourses.onCreated(function () {

  this.add_course_mode = new ReactiveVar();

  Template.instance().add_course_mode.set(false);

});


Template.EditCurriculumCourses.events({

  'click #button_add_course': function (e) {
    Template.instance().add_course_mode.set(true);
    return false;
  },

});


Template.EditCurriculumCourses.helpers({

  "list_of_courses": function () {
    var curriculumId = FlowRouter.getParam('_id');
    return Courses.find({"curriculum": curriculumId}, {sort: {alphanumeric: 1}});
  },

  "at_least_one_course": function () {
    var curriculumId = FlowRouter.getParam('_id');
    return Courses.find({"curriculum": curriculumId}).count() > 0;
  },


  "add_course_mode": function () {
    return Template.instance().add_course_mode.get();
  },

  get_reference_to_reactive_var_add_course_mode: function () {
    return Template.instance().add_course_mode;
  }

});


/* Course Row */


Template.courseRow.onCreated(function () {

  this.update_course_mode = new ReactiveVar();
  this.missing_alphanumeric = new ReactiveVar();
  this.missing_course_title = new ReactiveVar();

  Template.instance().update_course_mode.set(false);
  Template.instance().missing_alphanumeric.set(false);
  Template.instance().missing_course_title.set(false);

});

Template.courseRow.events({

  "click .course_delete": function (e) {
    var courseId = this._id;

    $('#modal_delete_course_' + courseId).modal({
      onDeny: function () {
        return true;
      },
      onApprove: function () {
        $('#modal_delete_course_' + courseId).modal('hide');
        Courses.remove_document(courseId);
        //Meteor.call("delete_from_collection", "Courses", courseId);
        return true;
      }
    }).modal('show');
  },

  "click .course_edit": function (e) {
    Template.instance().update_course_mode.set(true);
  },

});


Template.courseRow.helpers({
  update_course_mode: function () {
    return Template.instance().update_course_mode.get();
  },

  get_reference_to_reactive_var_update_course_mode: function () {
    return Template.instance().update_course_mode;
  },

  courseId: function () {
    return this._id;
  },

  num_offered_courses: function () {
    return OfferedCourses.find({"course": this._id}).count();
  },

  num_assessment_items: function () {
    var offered_courses = OfferedCourses.find({"course": this._id}).fetch();
    var num_assessment_items = 0;
    for (var i = 0; i < offered_courses.length; i++) {
      num_assessment_items += AssessmentItems.find({"offered_course": offered_courses[i]._id}).count();
    }
    return num_assessment_items;
  }

});
