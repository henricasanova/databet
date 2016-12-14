import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Curricula } from '../../../../api/databet_collections/Curricula';

Template.EditCurriculum.onRendered(function () {
  $('.tabular.menu .item').tab();

});

Template.EditCurriculum.onCreated(function () {

  this.missing_curriculum_description = new ReactiveVar();
  this.curriculum_already_exists = new ReactiveVar();

  Template.instance().missing_curriculum_description.set(false);
  Template.instance().curriculum_already_exists.set(false);

});

Template.EditCurriculum.events({

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
        Curricula.update_document(curriculumId, {"locked": false});
        return true;
      }
    }).modal('show');
  },

  'click #button_lock': function (e) {
    var curriculumId = FlowRouter.getParam('_id');
    Curricula.update_document(curriculumId, {"locked": true});
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
    Curricula.update_document(curriculumId, {"description": description});

    return false;
  }
});

Template.EditCurriculum.helpers({

  "curriculum_description": function () {
    var curriculumId = FlowRouter.getParam('_id');
    var curriculum = Curricula.findOne({"_id": curriculumId});
    if (curriculum) {
      return curriculum.description;
    } else {
      return null;
    }
  },

  "curriculum_id": function() {
    return FlowRouter.getParam('_id');
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

