import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.notFound = {
  action() {
    conditional_render(false, false, "NotAuthorized");

  },
};

FlowRouter.route('/', {
  name: 'Home_Page',
  action() {
    conditional_render(true, false, "Home_Page");
  },
});

FlowRouter.route('/not_authorized', {
  name: 'NotAuthorized',
  action() {
    conditional_render(false, false, "NotAuthorized");
  },
});

FlowRouter.route('/NonCasLogin', {
  name: 'NonCasLogin',
  action() {
    conditional_render(false, false, "NonCasLogin");
  },
});

FlowRouter.route('/FAQ', {
  name: 'FAQ',
  action() {
    conditional_render(true, false, "FAQ");

  },
});

FlowRouter.route('/archived', {
  name: 'InstructorViewArchived',
  action() {
    conditional_render(true, false, "InstructorViewArchived");

  },
});

FlowRouter.route('/manage_users', {
  name: 'ManageUsers',
  action() {
    conditional_render(true, true, "ManageUsers");

  },
});

FlowRouter.route('/statistics', {
  name: 'Statistics',
  action() {
    conditional_render(true, true, "Statistics");

  },
});

FlowRouter.route('/doctor', {
  name: 'Doctor',
  action() {
    conditional_render(true, true, "Doctor");

  },
});

FlowRouter.route('/reports', {
  name: 'Reports',
  action() {
    conditional_render(true, true, "Reports");

  },
});

FlowRouter.route('/backups', {
  name: 'Backups',
  action() {
    conditional_render(true, true, "Backups");

  },
});

FlowRouter.route('/manage_curricula', {
  name: 'ManageCurricula',
  action() {
    conditional_render(true, true, "ManageCurricula");

  },
});

FlowRouter.route('/edit_curriculum/:_id', {
  name: 'EditCurriculum',
  action() {
    conditional_render(true, true, "EditCurriculum");

  },
});

FlowRouter.route('/manage_semesters', {
  name: 'ManageSemesters',
  action() {
    conditional_render(true, true, "ManageSemesters");

  },
});

FlowRouter.route('/edit_semester/:_id', {
  name: 'EditSemester',
  action() {
    conditional_render(true, true, "EditSemester");
  },
});

FlowRouter.route('/semester_email_before/:_id', {
  name: 'SemesterEmailInstructorsBefore',
  action() {
    conditional_render(true, true, "SemesterEmailInstructorsBefore");
  },
});


FlowRouter.route('/semester_email_after/:_id', {
  name: 'SemesterEmailInstructorsAfter',
  action() {
    conditional_render(true, true, "SemesterEmailInstructorsAfter");
  },
});

FlowRouter.route('/assessment_items/:_id', {
  name: 'AssessmentItems',
  action() {
    conditional_render(true, false, "AssessmentItems");
  },
});

FlowRouter.route('/edit_assessment_item/:_id', {
  name: 'EditAssessmentItem',
  action() {
    conditional_render(true, false, "EditAssessmentItem");
  },
});


FlowRouter.route('/course_info/:_id', {
  name: 'CourseInfo',
  action() {
    conditional_render(false, false, "CourseInfo");
  },
});


function conditional_render(must_be_logged_in, must_be_admin, template_name) {

  // console.log("Conditional rendering of " + template_name,  must_be_logged_in, must_be_admin);

  var what_to_show = template_name;

  if (must_be_logged_in && (Meteor.userId() ==  null)) {
    if (FlowRouter.getRouteName() != "Home_Page") {
      what_to_show = "NotAuthorized";
    } else {
      what_to_show = "Login";
    }
  }

  if (must_be_logged_in && Meteor.userId() && must_be_admin && (!Roles.userIsInRole(Meteor.userId(), 'admin'))) {
      what_to_show = "NotAuthorized";
  }


  BlazeLayout.render("App_Body", {main: what_to_show});

}
