import { OfferedCourses } from '../../../api/databet_collections/OfferedCourses';
import { Semesters } from '../../../api/databet_collections/Semesters';
import { Courses } from '../../../api/databet_collections/Courses';
import { AssessmentItems } from '../../../api/databet_collections/AssessmentItems';
import { _ } from 'meteor/underscore';
import { get_current_user } from '../../../ui/global_template_helpers/users_and_usernames';
import { Meteor } from 'meteor/meteor';

Template.InstructorViewArchived.helpers({

  "listOfOfferedCourses": function () {
    var offered_courses = OfferedCourses.find({"instructor": get_current_user(), "archived": true}).fetch();

    offered_courses.sort(function (a, b) {
      var semester_order_a = Semesters.findOne({"_id": a.semester}).order;
      var semester_order_b = Semesters.findOne({"_id": b.semester}).order;

      if (semester_order_a < semester_order_b) {
        return 1;
      } else if (semester_order_a > semester_order_b) {
        return -1;
      } else {
        var course_a = Courses.findOne({"_id": a.course}).alphanumeric;
        var course_b = Courses.findOne({"_id": b.course}).alphanumeric;
        if (course_a < course_b) {
          return 1;
        } else {
          return -1;
        }
      }
    });

    return offered_courses;
  },

  "atLeastOneOfferedCourse": function () {
    return (OfferedCourses.find({"instructor": get_current_user(), "archived": true}).count() > 0);
  },

});

Template.OfferedCourseRowArchived.onRendered(function () {
  $('.buttonpopup')
    .popup();
});


Template.OfferedCourseRowArchived.events({

  "click .unarchive_course": function (e) {
    Meteor.call("update_in_collection", "OfferedCourses", this._id, {"archived": false});
  }

});

Template.OfferedCourseRowArchived.helpers({

  "semester_string": function (e) {
    var semester_id = this.semester;
    var semester = Semesters.findOne({"_id": semester_id});
    return semester.session + " " + semester.year;
  },

  "course_alphanumeric": function (e) {
    var course_id = this.course;
    var course = Courses.findOne({"_id": course_id});
    return course.alphanumeric;
  },

  "num_assessment_items": function (e) {
    return AssessmentItems.find({"offered_course": this._id}).count();
  },

  "is_there_at_least_one_assessment_item": function (e) {
    return AssessmentItems.find({"offered_course": this._id}).count() > 0;
  },

  "popup_info": function (e) {
    var assessment_items = AssessmentItems.find({"offered_course": this._id}).fetch();
    return _.pluck(assessment_items, "assessment_type");
  }

});
