Template.ManageEditCurriculum.onRendered(function () {
  $('.tabular.menu .item').tab();

});

Template.ManageEditCurriculum.onCreated(function () {

  this.missing_curriculum_description = new ReactiveVar();
  this.curriculum_already_exists = new ReactiveVar();

  Template.instance().missing_curriculum_description.set(false);
  Template.instance().curriculum_already_exists.set(false);

});

Template.ManageEditCurriculum.events({

  'keydown #curriculum_description': function (e) {
    Template.instance().missing_curriculum_description.set(false);
    Template.instance().curriculum_already_exists.set(false);
  },

  'click #button_unlock': function (e) {

    var curriculumId = FlowRouter.getParam('_id');

    $('#unlock_modal').modal({
      onDeny: function () {
        return true;
      },
      onApprove: function () {
        $('#unlock_modal').modal('hide');
        Meteor.call("update_in_collection", "Curricula", curriculumId, {"locked": false});
        return true;
      }
    }).modal('show');
  },

  'click #button_lock': function (e) {
    var curriculumId = FlowRouter.getParam('_id');
    Meteor.call("update_in_collection", "Curricula", curriculumId, {"locked": true});
  },

  'click #curriculum_description_update': function (e) {
    e.preventDefault();

    var curriculumId = FlowRouter.getParam('_id');
    var allGood = true;

    var description = $('#curriculum_description').val();
    if (!description || (description.length < 5)) {
      Template.instance().missing_curriculum_description.set(true);
      allGood = false;
    }

    if (!allGood) {
      return false;
    }

    // Check that the description is unique
    if (Curricula.findOne({"description": description})) {
      Template.instance().curriculum_already_exists.set(true);
      return false;
    }

    // Update curriculum description
    Meteor.call("update_in_collection", "Curricula", curriculumId, {"description": description});

    return false;
  }
});

Template.ManageEditCurriculum.helpers({

  "curriculum_description": function () {
    var curriculumId = FlowRouter.getParam('_id');
    var curriculum = Curricula.findOne({"_id": curriculumId});
    if (curriculum) {
      return curriculum.description;
    } else {
      console.log("** WEIRD ERROR in Template.ManageEditCurriculum.helpers when going back to previous page...");
      return null;
    }
  },

  "is_locked": function () {
    var curriculumId = FlowRouter.getParam('_id');
    return Curricula.findOne({"_id": curriculumId}).locked;
  },

  "missing_curriculum_description": function () {
    return Template.instance().missing_curriculum_description.get();
  },

  "curriculum_already_exists": function () {
    return Template.instance().curriculum_already_exists.get();
  },


});


Template.ManageEditCurriculumOutcomes.onRendered(function () {
});

