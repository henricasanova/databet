import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_Body', { main: 'App_Not_Found' });
  },
};

FlowRouter.route('/', {
  name: 'Home_Page',
  action() {
    BlazeLayout.render('App_Body', { main: 'Home_Page' });
  },
});

FlowRouter.route('/NonCasLogin', {
  name: 'NonCasLogin',
  action() {
    BlazeLayout.render("App_Body", {main: "NonCasLogin"});
  },
});

FlowRouter.route('/FAQ', {
  name: 'FAQ',
  action() {
    BlazeLayout.render("App_Body", {main: "FAQ"});
  },
});


FlowRouter.route('/archived', {
  name: 'InstructorViewArchived',
  action() {
    BlazeLayout.render("App_Body", {main: "InstructorViewArchived"});
  },
});

FlowRouter.route('/manage_users', {
  name: 'ManageUsers',
  action() {
    BlazeLayout.render("App_Body", {main: "ManageUsers"});
  },
});

