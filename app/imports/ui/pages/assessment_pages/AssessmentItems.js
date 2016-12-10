import { Template } from 'meteor/templating';
import { OfferedCourses } from '../../../api/databet_collections/OfferedCourses';
import { Courses } from '../../../api/databet_collections/Courses';
import { Semesters } from '../../../api/databet_collections/Semesters';
import { AssessmentItems } from '../../../api/databet_collections/AssessmentItems';
import { Meteor } from 'meteor/meteor';
import { trim_date } from '../../../ui/global_helpers/trim_date';

Template.AssessmentItems.onRendered(function () {

});

Template.AssessmentItems.onCreated(function () {

  this.add_assessment_item_mode = new ReactiveVar();

  Template.instance().add_assessment_item_mode.set(false);

  this.for_modal = new ReactiveVar();
  Template.instance().for_modal.set([]);

});

Template.AssessmentItems.helpers({

  "for_modal": function () {
    return Template.instance().for_modal;
  },

  "course_offering_string": function () {
    var offered_course_id = FlowRouter.getParam("_id");
    var offered_course = OfferedCourses.findOne({"_id": offered_course_id});
    if (offered_course) {

      return Courses.findOne({"_id": offered_course.course}).alphanumeric + " (" +
        Semesters.findOne({"_id": offered_course.semester}).session + " " +
        Semesters.findOne({"_id": offered_course.semester}).year + ")";
    } else {
      return "ERROR";
    }
  },

  "list_of_assessment_items": function () {
    var offered_course_id = FlowRouter.getParam("_id");
    return AssessmentItems.find({"offered_course": offered_course_id});
  },

  "at_least_one_assessment_item": function () {
    var offered_course_id = FlowRouter.getParam("_id");
    return AssessmentItems.find({"offered_course": offered_course_id}).count() > 0;
  },

  "add_assessment_item_mode": function () {
    return Template.instance().add_assessment_item_mode.get();
  },

  "get_reference_to_reactive_var_add_assessment_item_mode": function () {
    return Template.instance().add_assessment_item_mode;
  },

  "add_mode": function () {
    return Template.instance().add_assessment_item_mode.get();
  },

});

Template.AssessmentItems.events({

  "click #button_add_assessment_item": function (e) {
    Template.instance().add_assessment_item_mode.set(true);
  },

});


Template.AssessmentItemRow.helpers({
  "date_last_modified": function (e) {

    var assessment_item_id = Template.currentData().assessment_item;
    var assessment_item = AssessmentItems.findOne({"_id": assessment_item_id});

    return trim_date(assessment_item.date_last_modified);
  },

  "assessment_type": function (e) {
    var assessment_item_id = Template.currentData().assessment_item;
    var assessment_item = AssessmentItems.findOne({"_id": assessment_item_id});
    return assessment_item.assessment_type;
  },

  "assessment_id": function (e) {
    return Template.currentData().assessment_item;
  },

});

Template.AssessmentItemRow.onCreated(function () {
  this.edit_assessment_item_mode = new ReactiveVar();

  Template.instance().edit_assessment_item_mode.set(false);

});

Template.AssessmentItemRow.events({

  "click #button_delete_assessment_item": function (e) {

    var assessment_item_id = Template.currentData().assessment_item;
    var assessment_item = AssessmentItems.findOne({"_id": assessment_item_id});

    Template.currentData().set_to_modal_content.set([
      "It was last modified on " + trim_date(assessment_item.date_last_modified),
      "It is of type " + assessment_item.assessment_type
    ]);

    $('#delete_assessment_item_modal').modal({
      onDeny: function () {
        return true;
      },
      onApprove: function () {
        AssessmentItems.remove_document(assessment_item_id);
        return true;
      }
    })
      .modal('show');

    return false;
  },

  "click #button_edit_assessment_item": function (e) {
    Template.instance().edit_assessment_item_mode.set(true);
    return false;
  }

});

Template.DeleteAssessmentItemModal.helpers({

  "modal_content": function () {
    return Template.currentData().modal_content.get();
  }

});





