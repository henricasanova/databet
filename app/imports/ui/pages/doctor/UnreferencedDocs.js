import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { UploadedFiles } from '../../../api/databet_collections/UploadedFiles';
import { AssessmentItems } from '../../../api/databet_collections/AssessmentItems';
import { object_to_json_html } from '../../../ui/global_helpers/object_to_json';

Template.UnreferencedDocs.onCreated(function () {

  this.download_error = new ReactiveVar();
  this.waiting_for_list_of_unreferenced_docs = new ReactiveVar();
  this.list_of_unreferenced_docs = new ReactiveVar();

  Template.instance().waiting_for_list_of_unreferenced_docs.set(true);
  Template.instance().download_error.set(false);
  Template.instance().list_of_unreferenced_docs.set([]);

});

Template.UnreferencedDocs.helpers({

  "construct_list_of_unreferenced_docs": function () {
    // var set_to_false_when_done = Template.instance().waiting_for_list_of_unreferenced_docs;
    // var set_to_true_if_error = Template.instance().download_error;
    // var set_to_results = Template.instance().list_of_unreferenced_docs;

    var list_of_unreferenced_docs = [];

    list_of_unreferenced_docs = list_of_unreferenced_docs.concat(get_unreferenced_in_collection(UploadedFiles,
      { "collection": AssessmentItems,
        "fields": ["assessment_question_file", "sample_poor_answer_file", "sample_medium_answer_file", "sample_good_answer_file"]}));

    Template.instance().list_of_unreferenced_docs.set(list_of_unreferenced_docs);
    Template.instance().waiting_for_list_of_unreferenced_docs.set(false);
    return "";
  },

  "list_of_unreferenced_docs": function () {
    return Template.instance().list_of_unreferenced_docs.get();
  },

});

Template.UnreferencedDocRow.helpers({

  this_collection: function () {
    if (this[0] == UploadedFiles) {
      return "UploadedFiles";
    } else {
      return this[0]._name;
    }
  },

  this_id: function () {
    if (this[0] == UploadedFiles) {
      return this[1].meta.databet_id + ": " + this[1].name;
    } else {
      return this[1]._id;
    }
  },

  object_json: function () {
    return object_to_json_html(this[1]);
  }
});


Template.UnreferencedDocRow.onRendered(function () {
  $('.buttonpopup')
    .popup({lastResort: 'bottom right'})
  ;
});


//noinspection JSUnusedLocalSymbols
Template.UnreferencedDocRow.events({

  "click .manage_delete_item": function (e) {
    if (this[0] == UploadedFiles) {
      this[0].remove_document(this[1].meta.databet_id);
    } else {
      this[0].remove_document(this[1]._id);
    }
  },

});

function get_unreferenced_in_collection(collection, potential_references) {

  // Construct the list of referenced items
  var list_of_references = [];
  var referencing_objects = potential_references.collection.find({}).fetch();
  for (var i=0; i < referencing_objects.length; i++) {
    for (var j = 0; j < potential_references.fields.length; j++) {
      var field = potential_references.fields[j];
      if (referencing_objects[i][field]) {
        list_of_references.push(referencing_objects[i][field]);
      }
    }
  }

  // Construct the list of unreferenced items
  var unreferenced_items = [];
  var docs = collection.find({}).fetch();
  for (var i=0; i < docs.length; i++) {
    var doc_id;
    if (collection == UploadedFiles) {
      doc_id = docs[i].meta.databet_id;
    } else {
      doc_id = docs[i]._id;
    }
    if (list_of_references.indexOf(doc_id) == -1) {
      unreferenced_items.push([collection, docs[i]]);
    } else {
    }
  }

  return unreferenced_items;
}