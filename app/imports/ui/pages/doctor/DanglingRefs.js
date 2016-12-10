import { collection_dictionary } from '../../../startup/both/collection_dictionary.js';
import { Meteor } from 'meteor/meteor';
import { object_to_json_html } from '../../../ui/global_helpers/object_to_json';

Template.DanglingRefs.helpers({

  list_of_dangling_refs: function () {
    return get_dangling_refs();
  },

});

Template.DanglingRefRow.helpers({

  collection_name: function () {
    return this.collection_name;
  },

  doc_id: function () {
    return this.doc._id;
  },

  error_message: function () {
    var error_messages = this.error_message.split("\n");

    var html_error_message = "<ul class=\"ui list\">\n";
    for (var i = 0; i < error_messages.length; i++) {
      if (error_messages[i] != "") {
        html_error_message += "<li class=\"item\"> " + error_messages[i] + " </li>\n";
      }
    }
    html_error_message += "</ul>\n";
    return html_error_message;

  },

  object_json: function () {

    return object_to_json_html(this.doc);
  }

});

Template.DanglingRefRow.onRendered(function () {
  $('.buttonpopup')
    .popup({lastResort: 'bottom right'})
  ;
});

Template.DanglingRefRow.events({

  "click .manage_delete_item": function (e) {
    collection_dictionary[this.collection_name].remove_document(this.doc._id);
  },

});


// Returns documents that reference non-existing items

export var get_dangling_refs = function () {

  var dangling_refs = [];

  // Assessment Items
  dangling_refs.push.apply(dangling_refs,
    get_dangling_refs_in_collection("AssessmentItems",
      [["offered_course", "OfferedCourses"],
        ["curriculum_mapping", "CurriculumMappings"],
        ["assessment_question_file", "UploadedFiles"],
        ["sample_poor_answer_file", "UploadedFiles"],
        ["sample_medium_answer_file", "UploadedFiles"],
        ["sample_good_answer_file", "UploadedFiles"]
      ]));


  // Courses
  dangling_refs.push.apply(dangling_refs,
    get_dangling_refs_in_collection("Courses",
      [["curriculum", "Curricula"]]));

  // Curricula
  // nothing to do

  // CurriculumMapping
  dangling_refs.push.apply(dangling_refs,
    get_dangling_refs_in_collection("CurriculumMappings",
      [["curriculum", "Curricula"],
        ["course", "Courses"],
        ["performance_indicator", "PerformanceIndicators"]]));

  // OfferedCourses
  dangling_refs.push.apply(dangling_refs,
    get_dangling_refs_in_collection("OfferedCourses",
      [["course", "Courses"],
        ["semester", "Semesters"],
        ["instructor", "MeteorUsers"]]));

  // PerformanceIndicators
  dangling_refs.push.apply(dangling_refs,
    get_dangling_refs_in_collection("PerformanceIndicators",
      [["student_outcome", "StudentOutcomes"]]));

  // Semesters
  dangling_refs.push.apply(dangling_refs,
    get_dangling_refs_in_collection("Semesters",
      [["curriculum", "Curricula"]]));

  // StudentOutcomes
  dangling_refs.push.apply(dangling_refs,
    get_dangling_refs_in_collection("StudentOutcomes",
      [["curriculum", "Curricula"]]));

  return dangling_refs;

};

// Generic method that returns an error message
function not_in_collection(doc, field_name, target_collection_name) {

  // If the document has an null field, we say it's fine
  //  (it's not a Bogus ID, it's just a non-ID)
  if (doc[field_name] == null) {
    return "";
  }

  var target_doc = collection_dictionary[target_collection_name].find_document(doc[field_name]);

  if (!target_doc) {
    return "References non-existing "+field_name+" ("+doc[field_name]+") " +
      "in collection " + target_collection_name +"\n";
  } else {
    return ""
  }
}

// Generic method that looks for dangling references
function get_dangling_refs_in_collection(source_collection, reference_specs) {
  var dangling_refs = [];

  var docs = collection_dictionary[source_collection].find({}).fetch();
  for (var i=0; i < docs.length; i++) {
    var error_message = "";
    var doc = docs[i];
    for (var ref=0; ref < reference_specs.length; ref++) {
      var field_name = reference_specs[ref][0];
      var target_collection_name = reference_specs[ref][1];
      error_message += not_in_collection(doc,field_name, target_collection_name);
    }
    if (error_message != "") {
      dangling_refs.push({"collection_name": source_collection, "doc": doc, "error_message":error_message});
    }
  }
  return dangling_refs;

}
