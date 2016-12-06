import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { PerformanceIndicators } from '../../../../api/databet_collections/PerformanceIndicators';
import { StudentOutcomes } from '../../../../api/databet_collections/StudentOutcomes';
import { _ } from 'meteor/underscore';

Template.ManageAddUpdateOutcome.onRendered(function () {
});

Template.ManageAddUpdateOutcome.onCreated(function () {

  this.missing_description = new ReactiveVar();
  this.taken_description = new ReactiveVar();

  Template.instance().missing_description.set(false);
  Template.instance().taken_description.set(false);

});

Template.ManageAddUpdateOutcome.events({

  'click #cancel': function (e) {
    e.preventDefault();
    Template.currentData().set_to_false_when_done.set(false);
    return false;
  },

  'keydown .input_description': function (e) {
    Template.instance().missing_description.set(false);
    Template.instance().taken_description.set(false);
  },

  'click .button_remove_pi': function(e) {
    e.preventDefault();
    var piId = e.currentTarget.id;
    piId = piId.split("_")[2];


    console.log("SHOULD DO A POPUP");

    Meteor.call("delete_from_collection", "PerformanceIndicators", piId);
    return false;
  },

  "click .pi_up": function(e) {
    var outcomeId = Template.currentData().outcomeId;
    var piId = e.currentTarget.id;

    piId = piId.split("_")[2];

    var allPIs = PerformanceIndicators.find({"student_outcome": outcomeId}, {sort: {order:1}}).fetch();

    if (allPIs[0]._id == piId) {
      return false;
    }

    for (var i=1; i < allPIs.length; i++) {
      if (allPIs[i]._id == piId) {
        var i_order = allPIs[i].order;
        var i_minus_1_order = allPIs[i-1].order;

        Meteor.call("update_in_collection", "PerformanceIndicators",  allPIs[i]._id, {"order": i_minus_1_order});
        Meteor.call("update_in_collection", "PerformanceIndicators", allPIs[i-1]._id, {"order": i_order});
        break;
      }
    }
    return false;
  },

  "click .pi_down": function(e) {
    var outcomeId = Template.currentData().outcomeId;
    var piId = e.currentTarget.id;

    piId = piId.split("_")[2];

    var allPIs = PerformanceIndicators.find({"student_outcome": outcomeId}, {sort: {order:1}}).fetch();

    if (allPIs[allPIs.length-1]._id == piId) {
      return false;
    }

    for (var i=0; i < allPIs.length-1; i++) {
      if (allPIs[i]._id == piId) {
        var i_order = allPIs[i].order;
        var i_plus_1_order = allPIs[i+1].order;

        Meteor.call("update_in_collection", "PerformanceIndicators", allPIs[i]._id, {"order": i_plus_1_order});
        Meteor.call("update_in_collection", "PerformanceIndicators", allPIs[i+1]._id, {"order": i_order});
        break;
      }
    }
    return false;
  },



  'click .button_add_pi': function (e) {
    e.preventDefault();

    var outcomeId = Template.currentData().outcomeId;

    var pi_description = $('#new_pi_description_'+outcomeId).val();

    if (!pi_description || pi_description.length < 1) {
      return false;
    }

    var order = PerformanceIndicators.find({"student_outcome": outcomeId}).count();

    var pi = {
      "description": pi_description,
      "student_outcome": outcomeId,
      "order": order
    };

    Meteor.call("insert_into_collection", "PerformanceIndicators", pi);
    $('#new_pi_description_'+outcomeId).val("");

    return false;

  },

  'click #submit': function (e) {
    e.preventDefault();

    var curriculumId = FlowRouter.getParam('_id');
    var description;
    var outcomeId = Template.currentData().outcomeId;
    var pis = PerformanceIndicators.find({"student_outcome":outcomeId}).fetch();


    if (Template.currentData().action == "add") {
      description = $('#description_new').val();
    } else {
      description = $('#description_'+outcomeId).val();
    }

    var allGood = true;

    // Deal with the description
    if (!description || description.length < 10) {
      Template.instance().missing_description.set(true);
      allGood = false;
    } else {
      if (Template.currentData().action == "add") {
        if (StudentOutcomes.findOne({"description": description})) {
          Template.instance().taken_description.set(true);
          allGood = false;
        }
      }
    }

    if (!allGood)
      return false;

    if (Template.currentData().action == "add") {

      var order = StudentOutcomes.find({"curriculum": curriculumId}).count();

      // At this point, we should be able to create a new Outcome
      var outcome = {
        "description": description,
        "curriculum": curriculumId,
        "order": order
      };

      Meteor.call("insert_into_collection", "StudentOutcomes", outcome);

      // Clear the fields
      $('#description_new').val("");

    } else {
      // Update the outcome
      Meteor.call("update_in_collection", "StudentOutcomes", outcomeId,
        {"description": description});

      // Update the PIs

      _.forEach(pis, function(doc) {
        var description = $('#pi_' + doc._id).val();

        if (description) {
          Meteor.call("update_in_collection", "PerformanceIndicators", doc._id,
            {"description": description});
        } else {
          // If the user erased the description, then we remove the whole thing!
          Meteor.call("delete_from_collection", "PerformanceIndicators", doc._id);
        }
      });
    }

    // hide
    Template.currentData().set_to_false_when_done.set(false);

    return false;
  }

});

Template.ManageAddUpdateOutcome.helpers({

  missing_description: function () {
    return Template.instance().missing_description.get();
  },

  taken_description: function () {
    return Template.instance().taken_description.get();
  },

  is_add: function () {
    return (Template.currentData().action == "add");
  },
  is_update: function () {
    return (Template.currentData().action == "update");
  },

  listOfPerformanceIndicators: function() {
    if (Template.currentData().outcomeId) {
      return PerformanceIndicators.find({"student_outcome":Template.currentData().outcomeId}, {sort: {order:1}});
    } else {
      return null;
    }
  },

  outcomeToUpdate: function () {
    if (Template.currentData().outcomeId) {
      return StudentOutcomes.findOne({"_id": Template.currentData().outcomeId});
    } else {
      return null;
    }
  }

});
