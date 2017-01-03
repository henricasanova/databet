import { Courses } from '../../../api/databet_collections/Courses';
import { CurriculumMappings } from '../../../api/databet_collections/CurriculumMappings';
import { PerformanceIndicators } from '../../../api/databet_collections/PerformanceIndicators';
import { StudentOutcomes } from '../../../api/databet_collections/StudentOutcomes';
import { _ } from 'meteor/underscore';

Template.CourseInfo.onRendered(
  function() {
  }
);

Template.CourseInfo.onCreated( function() {


});

Template.CourseInfo.helpers({

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
