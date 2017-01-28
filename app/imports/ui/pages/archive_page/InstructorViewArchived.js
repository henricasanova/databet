import { OfferedCourses } from '../../../api/databet_collections/OfferedCourses';
import { Semesters } from '../../../api/databet_collections/Semesters';
import { Courses } from '../../../api/databet_collections/Courses';
import { AssessmentItems } from '../../../api/databet_collections/AssessmentItems';
import { _ } from 'meteor/underscore';
import { get_current_user } from '../../../api/global_helpers/users_and_usernames';
import { Meteor } from 'meteor/meteor';

Template.InstructorViewArchived.onCreated(function() {

  // var instructor = get_current_user();
  // console.log("SUBSCRIBING TO THE OFFERED COURSES as", instructor);
  // Tracker.autorun(function() {
  //   Meteor.subscribe("offered_courses_for_a_user", instructor, true,
  //     function() {
  //       var offered_courses = OfferedCourses.find({instructor: instructor, archived: true}).fetch();
  //       var list_of_semesters = _.map(offered_courses, function (e) {return e.semester;});
  //       list_of_semesters = _.uniq(list_of_semesters);
  //       var list_of_courses = _.map(offered_courses, function (e) {return e.course;});
  //       list_of_courses = _.uniq(list_of_courses);
  //       console.log("SUBSCRIBING TO THE SEMSTERS");
  //
  //       Meteor.subscribe("list_of_semesters", list_of_semesters);
  //
  //       console.log("SUBSCRIBING TO THE COURSES");
  //
  //       Meteor.subscribe("list_of_courses", list_of_courses);
  //     }
  //   );
  // });



  // if (sub1.ready()) {
  //   console.log("SUBSCRIBED TO THE OFFERED COURSES");
  //   var offered_courses = OfferedCourses.find({instructor: instructor, archived: true}).fetch();
  //   var list_of_semesters = _.map(offered_courses, function (e) {return e.semester;});
  //   list_of_semesters = _.uniq(list_of_semesters);
  //   var list_of_courses = _.map(offered_courses, function (e) {return e.course;});
  //   list_of_courses = _.uniq(list_of_courses);
  //   Meteor.subscribe("list_of_semesters", list_of_semesters);
  //   Meteor.subscribe("list_of_courses", list_of_courses);
  // }

});


Template.InstructorViewArchived.helpers({

  "listOfArchivedOfferedCourses": function () {

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

  "atLeastOneArchivedOfferedCourse": function () {
    var to_return = (OfferedCourses.find({"instructor": get_current_user(), "archived": true}).count() > 0);
    return to_return;
  },

});


Template.OfferedCourseRowArchived.onCreated(function () {
});


Template.OfferedCourseRowArchived.onRendered(function () {
  $('.buttonpopup')
    .popup();
});


Template.OfferedCourseRowArchived.events({

  "click .unarchive_course": function (e) {
    OfferedCourses.update_document(this._id, {"archived": false});
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
