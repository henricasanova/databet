import { Template } from 'meteor/templating';
import { StudentOutcomes } from '../../../../api/databet_collections/StudentOutcomes';
import { PerformanceIndicators } from '../../../../api/databet_collections/PerformanceIndicators';
import { CurriculumMappings } from '../../../../api/databet_collections/CurriculumMappings';
import { OfferedCourses } from '../../../../api/databet_collections/OfferedCourses';
import { AssessmentItems } from '../../../../api/databet_collections/AssessmentItems';
import { Meteor } from 'meteor/meteor';


Template.ManageEditCurriculumOutcomes.onRendered(function() {

});

Template.ManageEditCurriculumOutcomes.onCreated(function() {

  this.add_outcome_mode = new ReactiveVar();

  Template.instance().add_outcome_mode.set(false);

});


//noinspection JSUnusedLocalSymbols
Template.ManageEditCurriculumOutcomes.events({

  'click #button_add_outcome': function(e) {
    Template.instance().add_outcome_mode.set(true);
    return false;
  },

});


Template.ManageEditCurriculumOutcomes.helpers({

  "list_of_outcomes": function() {
    var curriculumId = FlowRouter.getParam('_id');
    return StudentOutcomes.find({"curriculum": curriculumId}, {sort: {order:1}});
  },

  "at_least_one_outcome": function() {
    var curriculumId = FlowRouter.getParam('_id');
    return StudentOutcomes.find({"curriculum": curriculumId}).count() > 0;
  },

  "add_outcome_mode": function() {
    return Template.instance().add_outcome_mode.get();
  },

  get_reference_to_reactive_var_add_outcome_mode: function() {
    return Template.instance().add_outcome_mode;
  }

});



/* Outcome Row */

Template.OutcomeRow.onRendered(function() {
  $('.ui.dropdown')
    .dropdown()
  ;

  $('.buttonpopup')
    .popup()
  ;
});

Template.OutcomeRow.onCreated(function() {

  this.update_outcome_mode = new ReactiveVar();
  this.missing_alphanumeric = new ReactiveVar();
  this.missing_outcome_title = new ReactiveVar();

  Template.instance().update_outcome_mode.set(false);
  Template.instance().missing_alphanumeric.set(false);
  Template.instance().missing_outcome_title.set(false);

});

//noinspection JSUnusedLocalSymbols,JSUnusedLocalSymbols,JSUnusedLocalSymbols,JSUnusedLocalSymbols
Template.OutcomeRow.events({

  "click .outcome_delete": function(e) {
    var outcomeId = this._id;
    //var curriculumId = FlowRouter.getParam('_id');

    $('#modal_delete_outcome_'+outcomeId).
      modal({
        onDeny    : function(){
          return true;
        },
        onApprove : function() {
          $('#modal_delete_outcome_'+outcomeId).modal('hide');
          Meteor.call("delete_from_collection", "StudentOutcomes", outcomeId);

          return true;
        }
      }).
      modal('show');
  },

  "click .outcome_edit": function(e) {
    Template.instance().update_outcome_mode.set(true);
  },

  "click .outcome_up": function(e) {
    var curriculumId = FlowRouter.getParam('_id');
    var outcomeId = this._id;

    var allOutcomes = StudentOutcomes.find({"curriculum": curriculumId}, {sort: {order:1}}).fetch();


    if (allOutcomes[0]._id == outcomeId) {
      return false;
    }

    for (var i=1; i < allOutcomes.length; i++) {
      if (allOutcomes[i]._id == outcomeId) {
        var i_order = allOutcomes[i].order;
        var i_minus_1_order = allOutcomes[i-1].order;

        Meteor.call("update_in_collection", "StudentOutcomes", allOutcomes[i]._id, {"order": i_minus_1_order});
        Meteor.call("update_in_collection", "StudentOutcomes", allOutcomes[i-1]._id, {"order": i_order});
        break;
      }
    }
  },

  "click .outcome_down": function(e) {
    var curriculumId = FlowRouter.getParam('_id');
    var outcomeId = this._id;

    var allOutcomes = StudentOutcomes.find({"curriculum": curriculumId}, {sort: {order:1}}).fetch();

    if (allOutcomes[allOutcomes.length-1]._id == outcomeId) {
      return false;
    }

    for (var i=0; i < allOutcomes.length-1; i++) {
      if (allOutcomes[i]._id == outcomeId) {
        var i_order = allOutcomes[i].order;
        var i_plus_1_order = allOutcomes[i+1].order;

        Meteor.call("update_in_collection", "StudentOutcomes", allOutcomes[i]._id, {"order": i_plus_1_order});
        Meteor.call("update_in_collection", "StudentOutcomes", allOutcomes[i+1]._id, {"order": i_order});
        break;
      }
    }
  },


});


// Helper function
function get_courses_id_for_student_outcome(student_outcome_id) {
  var performance_indicators = PerformanceIndicators.find({"student_outcome": student_outcome_id}).fetch();
  var course_ids = [];
  for (var i=0; i < performance_indicators.length; i++) {
    var curriculum_mappings = CurriculumMappings.find({"performance_indicator": performance_indicators[i]._id}).fetch();
    for (var j=0; j < curriculum_mappings.length; j++) {
      var course_id = curriculum_mappings[j].course;
      if (course_ids.indexOf(course_id) == -1) {
        course_ids.push(course_id);
      }
    }
  }
  return course_ids;
}
Template.OutcomeRow.helpers({
  "update_outcome_mode": function() {
    return Template.instance().update_outcome_mode.get();
  },

  get_reference_to_reactive_var_update_outcome_mode: function() {
    return Template.instance().update_outcome_mode;
  },

  "outcomeId": function() {  // Needed to pass value to child templates
    return this._id;
  },

  "num_performance_indicators": function() {
     return PerformanceIndicators.find({"student_outcome": this._id}).count();
  },

  "num_courses": function() {
    var course_ids = get_courses_id_for_student_outcome(this._id);
    return course_ids.length;
  },

  "num_offered_courses": function() {
    var course_ids = get_courses_id_for_student_outcome(this._id);
    var num_offered_courses = 0;
    for (var i=0; i < course_ids.length; i++) {
      num_offered_courses += OfferedCourses.find({"course": course_ids[i]}).count();
    }
    return num_offered_courses;

  },

  "num_assessment_items": function() {
    var course_ids = get_courses_id_for_student_outcome(this._id);
    var num_assessment_items = 0;
    for (var i=0; i < course_ids.length; i++) {
      var offered_courses = OfferedCourses.find({"course": course_ids[i]}).fetch();
      for (var j=0; j < offered_courses.length; j++) {
        num_assessment_items += AssessmentItems.find({"offered_course": offered_courses[j]._id}).count();
      }
    }
    return num_assessment_items;
  },


});
