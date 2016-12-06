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

FlowRouter.route('/manage_statistics', {
  name: 'ManageStatistics',
  action() {
    BlazeLayout.render("App_Body", {main: "ManageStatistics"});
  },
});

FlowRouter.route('/manage_doctor', {
  name: 'ManageDoctor',
  action() {
    BlazeLayout.render("App_Body", {main: "ManageDoctor"});
  },
});

FlowRouter.route('/manage_reports', {
  name: 'ManageReports',
  action() {
    BlazeLayout.render("App_Body", {main: "ManageReports"});
  },
});

FlowRouter.route('/manage_doctor', {
  name: 'ManageDoctor',
  action() {
    BlazeLayout.render("App_Body", {main: "ManageDoctor"});
  },
});

FlowRouter.route('/manage_backups', {
  name: 'ManageBackups',
  action() {
    BlazeLayout.render("App_Body", {main: "ManageBackups"});
  },
});

FlowRouter.route('/manage_curricula', {
  name: 'ManageCurricula',
  action() {
    BlazeLayout.render("App_Body", {main: "ManageCurricula"});
  },
});

FlowRouter.route('/manage_edit_curriculum/:_id', {
  name: 'ManageEditCurriculum',
  action() {
    BlazeLayout.render("App_Body", {main: "ManageEditCurriculum"});
  },
});

FlowRouter.route('/manage_semesters', {
  name: 'ManageSemesters',
  action() {
    BlazeLayout.render("App_Body", {main: "ManageSemesters"});
  },
});

FlowRouter.route('/manage_edit_semester/:_id', {
  name: 'ManageEditSemester',
  action() {
    BlazeLayout.render("App_Body", {main: "ManageEditSemester"});
  },
});

FlowRouter.route('/manage_semester_email/:_id', {
  name: 'ManageSemesterEmailInstructors',
  action() {
    BlazeLayout.render("App_Body", {main: "ManageSemesterEmailInstructors"});
  },
});

FlowRouter.route('/assessments_items/:_id', {
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
