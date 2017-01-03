
Template.CourseInfo.onRendered(
  function() {
  }
);

Template.CourseInfo.onCreated( function() {



});

Template.AddSemester.helpers({

  foo: function() {
    return "Foo_helper: " + FlowRouter.getParam('_id');
  },


});
