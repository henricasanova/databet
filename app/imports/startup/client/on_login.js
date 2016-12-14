import { Meteor } from 'meteor/meteor';
import { set_current_user } from '../../api/global_helpers/users_and_usernames';
import { set_current_semester } from '../../api/global_helpers/semesters';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});

Accounts.onLogin(function() {

  // Subscribe to collections
  Meteor.subscribe("Meteor.users");
  Meteor.subscribe("Semesters");
  Meteor.subscribe("Curricula");
  Meteor.subscribe("StudentOutcomes");
  Meteor.subscribe("PerformanceIndicators");
  Meteor.subscribe("Courses");
  Meteor.subscribe("CurriculumMappings");
  Meteor.subscribe("OfferedCourses");
  Meteor.subscribe("AssessmentItems");
  Meteor.subscribe("UploadedFiles");

  // Setting the current user
  set_current_user(Meteor.userId());

  // Setting the current semester
  set_current_semester(null);

  // Go to the Home page
  FlowRouter.go('Home_Page');
});

