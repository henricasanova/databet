Template.ManageEditCurriculumMap.helpers({
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
    var curriculumId = FlowRouter.getParam('_id');

    var tokens = e.currentTarget.id.split("_");
    var level = tokens[1];
    var courseId = tokens[2];
    var piId = tokens[3];
    var checked = $("#" + e.currentTarget.id).is(":checked");

    var mapping = {
      "curriculum": curriculumId,
      "level": level,
      "course": courseId,
      "performance_indicator": piId
    };

    if (checked) {
      // Create mapping
      if (!CurriculumMappings.findOne(mapping)) {
        Meteor.call("insert_into_collection", "CurriculumMappings", mapping);
      }

    } else {
      // Remove mapping
      var to_remove = CurriculumMappings.findOne(mapping);
      Meteor.call("delete_from_collection", "CurriculumaMappings", to_remove._id);

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
