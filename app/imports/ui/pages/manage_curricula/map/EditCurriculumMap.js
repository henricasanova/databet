import { Template } from 'meteor/templating';
import { StudentOutcomes } from '../../../../api/databet_collections/StudentOutcomes';
import { Courses } from '../../../../api/databet_collections/Courses';
import { PerformanceIndicators } from '../../../../api/databet_collections/PerformanceIndicators';
import { CurriculumMappings } from '../../../../api/databet_collections/CurriculumMappings';
import { Meteor } from 'meteor/meteor';

Template.EditCurriculumMap.helpers({
  "list_of_outcomes": function () {
    var curriculumId = FlowRouter.getParam('_id');
    return StudentOutcomes.find({"curriculum": curriculumId}, {sort: {order: 1}});
  },

  "at_least_one_outcome": function() {
    var curriculumId = FlowRouter.getParam('_id');
    return StudentOutcomes.find({"curriculum": curriculumId}).count() > 0;
  },

  "at_least_one_course": function() {
    var curriculumId = FlowRouter.getParam('_id');
    return Courses.find({"curriculum": curriculumId}).count() > 0;
  },

  "at_least_one_pi": function() {
    var curriculumId = FlowRouter.getParam('_id');
    var student_outcomes = StudentOutcomes.find({"curriculum": curriculumId}).fetch();
    for (var i=0; i < student_outcomes.length; i++) {
      var student_outcome_id = student_outcomes[i]._id;
      if (PerformanceIndicators.find({"student_outcome": student_outcome_id}).count() > 0) {
        return true;
      }
    }
    return false;
  }
});


Template.OutcomeRows.helpers({
  "listOfPerformanceIndicators": function () {
    return PerformanceIndicators.find({"student_outcome": this._id}, {sort: {order: 1}});
  }

});


Template.PerformanceIndicatorRow.helpers({
  "row_label": function () {
    var outcomeId = this.student_outcome;
    return "SO#" + (StudentOutcomes.findOne({"_id": outcomeId}).order + 1) + "/" + "PI#" + (this.order + 1);
  },

  "listOfCourses": function () {
    var curriculumId = FlowRouter.getParam('_id');
    return Courses.find({"curriculum": curriculumId}, {sort: {alphanumeric: 1}});
  },

  "outcome_description": function () {
    var outcomeId = this.student_outcome;
    return StudentOutcomes.findOne({"_id": outcomeId}).description;
  },

  "this_id": function () {
    return this._id;
  }

});


Template.CheckBoxes.helpers({

  "pi_id": function () {
    return Template.parentData().pi_id;
  },

  "this_id": function () {
    return this._id;
  },

  "elementary": function () {
    return "elementary";
  },

  "proficient": function () {
    return "proficient";
  },

  "listOfCourses": function () {
    var curriculumId = FlowRouter.getParam('_id');
    return Courses.find({"curriculum": curriculumId}, {sort: {alphanumeric: 1}});
  },

  "is_checked": function (courseId, piId, level) {

    var mapping = CurriculumMappings.findOne({
      "course": courseId,
      "performance_indicator": piId,
      "level": level
    });

    if (mapping) {
      return "checked";
    } else {
      return "unchecked";
    }
  }

});


Template.CheckBoxes.events({

  "change .mapcheckbox": function (e) {
    let curriculumId = FlowRouter.getParam('_id');

    let tokens = e.currentTarget.id.split("_");
    let level = tokens[1];
    let courseId = tokens[2];
    let piId = tokens[3];
    let checked = $("#" + e.currentTarget.id).is(":checked");

    let mapping = {
      "curriculum": curriculumId,
      "level": level,
      "course": courseId,
      "performance_indicator": piId
    };

    if (checked) {
      // Create mapping
      if (!CurriculumMappings.findOne(mapping)) {
        CurriculumMappings.insert_document(mapping);
      }

    } else {
      // Remove mapping
      let to_remove = CurriculumMappings.findOne(mapping);
      CurriculumMappings.remove_document(to_remove._id);

    }

    return false;
  }

});


Template.CurriculumMapTableHeadCell.onRendered(function () {
    $('.buttonpopup')
      .popup()
    ;
  }
);

Template.CurriculumMapTableHead.helpers({
  "listOfCourses": function () {
    var curriculumId = FlowRouter.getParam('_id');
    return Courses.find({"curriculum": curriculumId}, {sort: {alphanumeric: 1}});
  },
});
