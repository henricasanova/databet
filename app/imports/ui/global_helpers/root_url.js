import { Template } from 'meteor/templating';


/* Global helper to find the root URL */
get_root_url = function () {
	  return  Meteor.absoluteUrl("");
};

Template.registerHelper('get_root_url', function () {
	  return get_root_url();
});

