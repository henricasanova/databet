import { Template } from 'meteor/templating';

/* eslint-disable object-shorthand, no-unused-vars */

/*
get_root_url = function () {
	  return  Meteor.absoluteUrl("");
};
*/

Template.Home_Page.helpers({

	  get_root_url() {
	      return "ROOT_URL";
        },

	crap() {
		return "CRAP";
	}
});


