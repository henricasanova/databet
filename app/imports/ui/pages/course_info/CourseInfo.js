import { Courses } from '../../../api/databet_collections/Courses';
import { CurriculumMappings } from '../../../api/databet_collections/CurriculumMappings';
import { PerformanceIndicators } from '../../../api/databet_collections/PerformanceIndicators';
import { StudentOutcomes } from '../../../api/databet_collections/StudentOutcomes';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';

Template.CourseInfo.onRendered(
  function() {
  }
);

Template.CourseInfo.onCreated( function() {


  // Somehow, couldn't get the Template.subscriptionReady stuff to work. This will do for now...

  this.subscription_readiness = new ReactiveVar();
  Template.instance().subscription_readiness.set(0);

  var increment_when_ready = Template.instance().subscription_readiness;

  Meteor.subscribe("StudentOutcomes", function() { increment_when_ready.set(increment_when_ready.get() + 1);});
  Meteor.subscribe("PerformanceIndicators", function() { increment_when_ready.set(increment_when_ready.get() + 1);});
  Meteor.subscribe("Courses", function() { increment_when_ready.set(increment_when_ready.get() + 1);});
  Meteor.subscribe("CurriculumMappings", function() { increment_when_ready.set(increment_when_ready.get() + 1);});

});

Template.CourseInfo.helpers({

  subscription_ready: function() {
    return (Template.instance().subscription_readiness.get() == 4);
  },

  course_exists: function() {
    var course_id = FlowRouter.getParam('_id');
    return (Courses.find({"_id": course_id}).count() > 0);
  },

  course_alpha: function() {
    var course_id = FlowRouter.getParam('_id');
    var course = Courses.findOne({"_id": course_id});
    return course.alphanumeric;
  },

  course_title: function() {
    var course_id = FlowRouter.getParam('_id');
    var course = Courses.findOne({"_id": course_id});
    return course.title;
  },

  listOfStudentOutcomes: function() {
    return StudentOutcomes.find({_id: {$in: get_list_of_so_ids()}}, {sort: {order: 1}});
  },

  numOfStudentOutcomes: function() {
    return get_list_of_so_ids().length;
  },

  listOfPerformanceIndicators: function() {
    var course_id = FlowRouter.getParam('_id');
    var course = Courses.findOne({"_id": course_id});
    var curriculum_id = course.curriculum;
    var curriculum_mappings = CurriculumMappings.find({"curriculum": curriculum_id}).fetch();
    var list_of_pi_ids = [];
    for (var i=0; i < curriculum_mappings.length; i++) {
      if (curriculum_mappings[i].course == course_id) {
        list_of_pi_ids.push(curriculum_mappings[i].performance_indicator);
      }
    }
    list_of_pi_ids = _.uniq(list_of_pi_ids);
    return PerformanceIndicators.find({_id: {$in: list_of_pi_ids}}, {sort: {order: 1}});
  }

});

function get_list_of_so_ids() {
  var course_id = FlowRouter.getParam('_id');
  var course = Courses.findOne({"_id": course_id});
  var curriculum_id = course.curriculum;
  var curriculum_mappings = CurriculumMappings.find({"curriculum": curriculum_id}).fetch();
  var list_of_so_ids = [];
  for (var i=0; i < curriculum_mappings.length; i++) {
    if (curriculum_mappings[i].course == course_id) {
      var pi = PerformanceIndicators.findOne(
        {"_id": curriculum_mappings[i].performance_indicator});
      list_of_so_ids.push(pi.student_outcome);
    }
  }
  return _.uniq(list_of_so_ids);
}
