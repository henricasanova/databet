
Meteor.startup(function() {

  // SUPER IMPORTANT TO ALLOW meteor-uploads TO WORK WITH A CUSTOM ROOT_URL
  // Note that if meteor-uploads changes the route to something
  // other than "upload", this will have to be updated

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

});
