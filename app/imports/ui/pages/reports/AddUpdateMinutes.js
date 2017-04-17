/**
 * Created by casanova on 4/12/17.
 */
import { Minutes } from '../../../api/databet_collections/Minutes';
import { Meteor } from 'meteor/meteor';

Template.AddUpdateMinutes.onRendered(function () {
  // Initialize dropdown
  $('.ui.dropdown')
    .dropdown();

  $('#date').calendar({type: 'date'});


});

list_of_minutes_types  = [
  "General",
  "Student Outcomes",
  "Curriculum Map",
  "Program Educational Objectives",
  "Assessment",
  "Other"
];

Template.AddUpdateMinutes.onCreated(function () {

  // console.log("IN ON CREATED ADDUPDATE  =====> ", Template.currentData());

  /*** ReactiveVar to make the whole page visible or not */

  this.is_visible = new ReactiveVar();
  Template.instance().is_visible.set(true);

  /*** Get the relevant info from the current URL */
  this.action = Template.currentData().action;

  // Existing assessment item (in case of update)
  if (Template.instance().action == "update") {
    this.existing_minutes = Template.currentData().minutes;
  } else {
    this.existing_minutes = null;
  }

  // console.log("IN ON CREATED EXISTING  =====> ", Template.instance().existing_minutes);

  /*** Create ReactiveVars for missing content warnings on the HTML ***/

  this.missing_content_reactive_dict = new ReactiveDict();
  Template.instance().missing_content_reactive_dict.set("type", false);
  Template.instance().missing_content_reactive_dict.set("date", false);
  Template.instance().missing_content_reactive_dict.set("participants", false);
  Template.instance().missing_content_reactive_dict.set("minutes", false);


  /*** ReactiveVar to see whether the "Save" button has been clicked **/
  this.save_has_been_clicked_once = new ReactiveVar();
  Template.instance().save_has_been_clicked_once.set(false);

});


Template.AddUpdateMinutes.helpers({

  "todays_date": function () {
    return new Date();
  },

  "is_add": function () {
    return (Template.instance().action == "add");
  },

  "is_update": function () {
    return (Template.instance().action == "update");
  },

  "is_visible": function () {
    return Template.instance().is_visible.get();
  },


  "save_has_been_clicked_once": function() {
    return Template.instance().save_has_been_clicked_once.get();
  },

  "list_of_minutes_types": function () {
    return list_of_minutes_types;
  },

  "existing_content": function (name) {

    // In case this is called by mistake in "add" mode
    let existing_minutes = Template.instance().existing_minutes;
    //console.log("EXISTING MINUTES=", existing_minutes);

    if (!existing_minutes) {
      return "";
    }

    switch (name) {
      case "date":
        return (existing_minutes.date);
      case "type":
        return (!existing_minutes.type);
      case "participants":
        return (existing_minutes.participants);
      case "minutes":
        return (existing_minutes.minutes);
      default:
        return "[INTERNAL ERROR - existing_minutes_content]";
    }
  },

  "are_there_errors": function() {
    return (Template.instance().missing_content_reactive_dict.get("type") ||
            Template.instance().missing_content_reactive_dict.get("date") ||
            Template.instance().missing_content_reactive_dict.get("participants") ||
            Template.instance().missing_content_reactive_dict.get("minutes"));
  },

  "missing_content": function (content_name) {
    return Template.instance().missing_content_reactive_dict.get(content_name);
  },

  "is_selected_type": function() {
    return (Template.instance().existing_minutes.type == this);
  },

});



Template.AddUpdateMinutes.events({

  // Events that react to input modification by users

  "change #minutes_type": function (e) {
    Template.instance().missing_content_reactive_dict.set("type", false);
  },

  "keydown #minutes_participants": function (e) {
    Template.instance().missing_content_reactive_dict.set("participants", false);
  },

  "click #date": function (e) {
    Template.instance().missing_content_reactive_dict.set("date", false);

  },

  "keydown #minutes_minutes": function (e) {
    Template.instance().missing_content_reactive_dict.set("minutes", false);
  },


  "click #cancel": function (e) {
    Template.currentData().set_to_false_when_done.set(false);
    Template.instance().is_visible.set(false);
  },

  "click #submit": function (e) {

    let allGood = true;

    Template.instance().save_has_been_clicked_once.set(true);

    // Build a tentative object based on what's been entered
    let tentative_doc = {};

    // Minutes type
    tentative_doc.type = $('#minutes_type').val();
    if (tentative_doc.type == "") {
      Template.instance().missing_content_reactive_dict.set("type", true);
      allGood = false;
    }

    // Minutes date
    tentative_doc.date = $('#date').calendar("get date");
    if ((tentative_doc.date == undefined) || (tentative_doc.date=="")) {
      Template.instance().missing_content_reactive_dict.set("date", true);
      allGood = false;
    }

    // Minutes participants
    tentative_doc.participants = $('#minutes_participants').val();
    if (tentative_doc.participants == "") {
      Template.instance().missing_content_reactive_dict.set("participants", true);
      allGood = false;
    }

    // Minutes minutes
    tentative_doc.minutes = $('#minutes_minutes').val();
    if (tentative_doc.minutes == "") {
      Template.instance().missing_content_reactive_dict.set("minutes", true);
      allGood = false;
    }

    if (!allGood) {
      return false;
    }

    console.log("TENTATIVE DOC = ", tentative_doc);

    /**** After this point, we know we will successfully add the minute ****/

    // disable the template to avoid race conditions
    Template.instance().is_visible.set(false);

    if (Template.instance().action == "add") {

      Minutes.insert_document(tentative_doc);
      Template.currentData().set_to_false_when_done.set(false);

    } else {

      let set_to_false_when_done = Template.currentData().set_to_false_when_done;
      Minutes.update_document(Template.instance().existing_minutes._id, tentative_doc , function () {
        set_to_false_when_done.set(false);
      });
    }

    return false;
  },
});



