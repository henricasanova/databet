
Accounts.onLogin(function() {
  // Setting the current user
  set_current_user(Meteor.userId());

  // Setting the current semester
  /* TODO RE-ENABLE
  set_current_semester(null);
  */

  FlowRouter.go('Home');
});

Meteor.startup(function() {

  // SUPER IMPORTANT TO ALLOW meteor-uploads TO WORK WITH A CUSTOM ROOT_URL
  // Note that if meteor-uploads changes the route to something
  // other than "upload", this will have to be updated

  /* TODO RE-ENABLE
  Uploader.uploadUrl = Meteor.absoluteUrl("upload");


  // Customize file uploader aspect
  Uploader.localisation = {
    browse: "Choose",
    cancelled: "Cancelled",
    remove: "Remove",
    upload: "Upload",
    done: "Done",
    cancel: "Cancel"
  }

  */


});
