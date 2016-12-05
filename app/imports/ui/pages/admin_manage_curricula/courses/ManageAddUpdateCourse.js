Template.ManageAddUpdateCourse.onRendered(function () {
});

Template.ManageAddUpdateCourse.onCreated(function () {

  this.missing_alphanumeric = new ReactiveVar();
  this.missing_title = new ReactiveVar();
  this.taken_alphanumeric = new ReactiveVar();

  Template.instance().missing_alphanumeric.set(false);
  Template.instance().missing_title.set(false);
  Template.instance().taken_alphanumeric.set(false);

});

Template.ManageAddUpdateCourse.events({

  'click #cancel': function (e) {
    e.preventDefault();
    Template.currentData().set_to_false_when_done.set(false);
    return false;
  },

  'keydown #alphanumeric': function (e) {
    Template.instance().missing_alphanumeric.set(false);
    Template.instance().taken_alphanumeric.set(false);
  },

  'keydown #title': function (e) {
    Template.instance().missing_title.set(false);
  },


  'click #submit': function (e) {
    e.preventDefault();

    var curriculumId = FlowRouter.getParam('_id');
    var alphanumeric = $('#alphanumeric').val();
    var title = $('#title').val();

    var allGood = true;

    if (!alphanumeric || alphanumeric.length < 3) {
      Template.instance().missing_alphanumeric.set(true);
      allGood = false;
    } else {
      if (Template.currentData().action == "add") {
        if (Courses.findOne({"alphanumeric": alphanumeric})) {
          Template.instance().taken_alphanumeric.set(true);
          allGood = false;
        }
      }
    }


    if (!title || title.length < 5) {
      Template.instance().missing_title.set(true);
      allGood = false;
    }


    if (!allGood)
      return false;

    if (Template.currentData().action == "add") {

      // At this point, we should be able to create a new course
      var course = {
        "alphanumeric": alphanumeric,
        "title": title,
        "curriculum": curriculumId
      };

      Meteor.call("insert_into_collection", "Courses", course);

      // Clear the fields
      $('#alphanumeric').val("");
      $('#title').val("");


    } else {
      console.log("UPDATING A COURSE");

      var courseId = Template.currentData().courseId;
      Meteor.call("update_in_collection", "Courses", courseId,
        {
          "alphanumeric": alphanumeric,
          "title": title
        });
    }


    // hide
    Template.currentData().set_to_false_when_done.set(false);

    return false;
  }

});

Template.ManageAddUpdateCourse.helpers({

  missing_alphanumeric: function () {
    return Template.instance().missing_alphanumeric.get();
  },
  missing_title: function () {
    return Template.instance().missing_title.get();
  },
  taken_alphanumeric: function () {
    return Template.instance().taken_alphanumeric.get();
  },

  is_add: function () {
    return (Template.currentData().action == "add");
  },
  is_update: function () {
    return (Template.currentData().action == "update");
  },

  courseToUpdate: function () {
    if (Template.currentData().courseId) {
      return Courses.findOne({"_id": Template.currentData().courseId});
    } else {
      return null;
    }
  }


});
