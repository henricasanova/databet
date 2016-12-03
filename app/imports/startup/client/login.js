
Accounts.onLogin(function() {
  // Setting the current user
  set_current_user(Meteor.userId());

  // Setting the current semester
  /* TODO RE-ENABLE
  set_current_semester(null);
  */

  FlowRouter.go('Home');
});
