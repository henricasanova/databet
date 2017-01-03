import { set_current_user } from '../../api/global_helpers/users_and_usernames';
import { set_current_semester } from '../../api/global_helpers/semesters';
import { Globals } from '../../api/databet_collections/Globals';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});

Accounts.onLogin(function() {

  // // Subscribe to collections: TODO stop getting everything!
  // Meteor.subscribe("Meteor.users");
  // Meteor.subscribe("Semesters");
  // Meteor.subscribe("Curricula");
  // Meteor.subscribe("StudentOutcomes");
  // Meteor.subscribe("PerformanceIndicators");
  // Meteor.subscribe("Courses");
  // Meteor.subscribe("CurriculumMappings");
  // Meteor.subscribe("OfferedCourses");
  // Meteor.subscribe("AssessmentItems");
  // Meteor.subscribe("UploadedFiles");

  // Purge globals (not sure if this is necessary)
  Globals.remove({});

  // Setting the current user
  set_current_user(Meteor.userId());

  // Setting the current semester
  set_current_semester(null);

  // Go to the Home page if this is a fresh login
  // This is a bad hack to avoid unwanted "go to home page"
  // behavior in case the user hacks the URL or hits reload on the browser

  if ((FlowRouter.getRouteName() == "Home_Page") || (FlowRouter.getRouteName() == "NonCasLogin")) {
    FlowRouter.go('Home_Page');
  }

});

