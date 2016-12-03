import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/', {
  name: 'Home_Page',
  action() {
    BlazeLayout.render('App_Body', { main: 'Home_Page' });
  },
});

FlowRouter.route('/FAQ', {
  name: 'FAQ',
  action() {
    BlazeLayout.render("App_Body", {main: "FAQ"});
  },
});


FlowRouter.route('/InstructorViewArchived', {
  name: 'InstructorViewArchived',
  action() {
    BlazeLayout.render("App_Body", {main: "InstructorViewArchived"});
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_Body', { main: 'App_Not_Found' });
  },
};
