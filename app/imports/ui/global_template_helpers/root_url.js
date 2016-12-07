import { Template } from 'meteor/templating';

Template.registerHelper('get_root_url', function () {
	  return Meteor.absoluteUrl("");
});

