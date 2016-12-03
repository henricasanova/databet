
Accounts.onLogin(function() {
  // Setting the current user
  set_current_user(Meteor.userId());

  // Setting the current semester
  set_current_semester(null);

  FlowRouter.go('Home_Page');
});
