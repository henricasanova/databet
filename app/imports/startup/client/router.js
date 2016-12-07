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

FlowRouter.route('/statistics', {
  name: 'Statistics',
  action() {
    BlazeLayout.render("App_Body", {main: "Statistics"});
  },
});

FlowRouter.route('/doctor', {
  name: 'Doctor',
  action() {
    BlazeLayout.render("App_Body", {main: "Doctor"});
  },
});

FlowRouter.route('/reports', {
  name: 'Reports',
  action() {
    BlazeLayout.render("App_Body", {main: "Reports"});
  },
});

FlowRouter.route('/backups', {
  name: 'Backups',
  action() {
    BlazeLayout.render("App_Body", {main: "Backups"});
  },
});

FlowRouter.route('/manage_curricula', {
  name: 'ManageCurricula',
  action() {
    BlazeLayout.render("App_Body", {main: "ManageCurricula"});
  },
});

FlowRouter.route('/edit_curriculum/:_id', {
  name: 'EditCurriculum',
  action() {
    BlazeLayout.render("App_Body", {main: "EditCurriculum"});
  },
});

FlowRouter.route('/manage_semesters', {
  name: 'ManageSemesters',
  action() {
    BlazeLayout.render("App_Body", {main: "ManageSemesters"});
  },
});

FlowRouter.route('/edit_semester/:_id', {
  name: 'EditSemester',
  action() {
    BlazeLayout.render("App_Body", {main: "EditSemester"});
  },
});

FlowRouter.route('/semester_email/:_id', {
  name: 'SemesterEmailInstructors',
  action() {
    BlazeLayout.render("App_Body", {main: "SemesterEmailInstructors"});
  },
});

FlowRouter.route('/assessment_items/:_id', {
  name: 'AssessmentItems',
  action() {
    BlazeLayout.render("App_Body", {main: "AssessmentItems"});
  },
});

FlowRouter.route('/edit_assessment_item/:_id', {
  name: 'EditAssessmentItem',
  action() {
    BlazeLayout.render("App_Body", {main: "EditAssessmentItem"});
  },
});
