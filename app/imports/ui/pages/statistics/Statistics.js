import { AssessmentItems } from '../../../api/databet_collections/AssessmentItems';
import { Courses } from '../../../api/databet_collections/Courses';
import { Curricula } from '../../../api/databet_collections/Curricula';
import { OfferedCourses } from '../../../api/databet_collections/OfferedCourses';
import { Semesters } from '../../../api/databet_collections/Semesters';
import { UploadedFiles } from '../../../api/databet_collections/UploadedFiles';
import { trim_date } from '../../../ui/global_helpers/trim_date';

Template.Statistics.helpers({
  num_users: function() {
    return Meteor.users.find({}).count();
  },

  num_admin_users: function() {
    return Meteor.users.find({"is_admin": true}).count();
  },

  num_curricula: function() {
    return Curricula.find({}).count();
  },

  num_semesters: function() {
    return Semesters.find({}).count();
  },

  num_assessment_items: function() {
    return AssessmentItems.find({}).count();
  },

  num_uploaded_files: function() {
    return UploadedFiles.find({}).count();
  },

  list_of_curricula: function() {
    return Curricula.find({},{sort: {data_created: -1}});
  },

  date_created: function() {
    return trim_date(this.date_created);
  },

  num_semesters_for_curriculum: function() {
    return Semesters.find({"curriculum": this._id}).count();
  },

  num_courses_for_curriculum: function() {
    return Courses.find({"curriculum": this._id}).count();
  },

  list_of_semesters: function() {
    return Semesters.find({}, {sort: {order: -1}});
  },

  num_offered_courses_for_semester: function() {
    return OfferedCourses.find({"semester": this._id}).count();
  },

  num_assessment_items_for_semester: function() {
    var offered_courses = OfferedCourses.find({"semester": this._id}).fetch();
    var num = 0;
    for (var i=0; i < offered_courses.length; i++) {
      num += AssessmentItems.find({"offered_course": offered_courses[i]._id}).count();
    }
    return num;
  },

  list_of_users: function() {
    return Meteor.users.find({});
  },

  num_offered_courses_for_user: function() {
    return OfferedCourses.find({"instructor": this._id}).count();
  },

  num_assessment_items_for_user: function() {
    var offered_courses = OfferedCourses.find({"instructor": this._id}).fetch();
    var num = 0;
    for (var i=0; i < offered_courses.length; i++) {
      num += AssessmentItems.find({"offered_course": offered_courses[i]._id}).count();
    }
    return num;
  }






});