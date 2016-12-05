// These are brute-force with redundancy (i.e, some calls will
// find everything removed already. But at least there is no
// infinite recursion :)

import '../../api/databet_collections';

var collection_dictionary = {};
collection_dictionary["Meteor.users"] = Meteor.users;
collection_dictionary["AssessmentItems"] = AssessmentItems;
collection_dictionary["Courses"] = Courses;
collection_dictionary["Curricula"] = Curricula;
collection_dictionary["CurriculumMappings"] = CurriculumMappings;
collection_dictionary["OfferedCourses"] = OfferedCourses;
collection_dictionary["PerformanceIndicators"] = PerformanceIndicators;
collection_dictionary["Semesters"] = Semesters;
collection_dictionary["StudentOutcomes"] = StudentOutcomes;
collection_dictionary["UploadedFiles"] = UploadedFiles;

Meteor.methods({

  insert_into_collection: function(collection_name, doc) {

    var collection = collection_dictionary[collection_name];

    if (collection == null) {
      throw new Meteor.Error("Unknown Collection "+collection_name);
    }
    console.log("Inserting new document", doc,"into collection", collection_name);
    collection.insert(doc);
  },

  update_in_collection: function(collection_name, doc_id, modifier) {
    var collection = collection_dictionary[collection_name];
    if (collection == null) {
      throw new Meteor.Error("Unknown Collection "+collection_name);
    }
    console.log("Updating document", doc_id, "in collection", collection_name);
    collection.update({"_id": doc_id}, {$set: modifier});
  },

  delete_from_collection: function(collection_name, doc_id) {
    var collection = collection_dictionary[collection_name];
    if (collection == null) {
      throw new Meteor.Error("Unknown Collection "+collection_name);
    }
    remove_from_collection(collection, doc_id);
  },
  
  remove_uploaded_file: function (filepath) {
    remove_uploaded_filepath(filepath);
  },

  get_list_of_uploaded_files: function (prefix) {

    if (Meteor.isServer) {
      var sys = Npm.require('sys');                                                                              // 3
      var path = Npm.require('path');                                                                            // 6
      var filesystem = Npm.require("fs");

      var dir = UploadServer.getOptions().uploadDir + "/" + prefix;
      return filesystem.readdirSync(dir);
    }
  },

  send_email: function (options) {
    if (Meteor.isServer) {
      Email.send(options);
    }
  },

  download_zipped_backup: function () {

    if (Meteor.server) {

      var sys = Npm.require('sys');                                                                              // 3
      var path = Npm.require('path');                                                                            // 6
      var filesystem = Npm.require("fs");

      var upload_root = UploadServer.getOptions().uploadDir;
      // Add all uploads to the archive
      var cwd = process.env.PWD;
      var imagedir = upload_root + "/assessment_uploads";
      var filelist = filesystem.readdirSync(imagedir);

      var now = new Date();
      var archive_name = "databet_archive_" + (now.getMonth() + 1) + "_" +
        (now.getDate()) + "_" + (now.getFullYear());

      console.log("filelist = ", filelist);
      console.log("archive_name = ", archive_name);

      var zipfile = new ZipZap();
      for (var i = 0; i < filelist.length; i++) {
        console.log("Archiving ", imagedir + "/" + filelist[i]);
        data = filesystem.readFileSync(imagedir + "/" + filelist[i]);
        zipfile.file(archive_name + '/assessment_uploads/' + filelist[i], data);
      }

      // Add the Collection dump to the archive
      zipfile.file(archive_name + "/collections.json", collections_2_string());

      // Add a REAME to the archive
      zipfile.file(archive_name + "/README.txt", "Snapshot date: " + now.toString() +
        "\n\nThis archive contains:\n\t- this README.txt file\n" +
        "\t- collections.json, which contains a JSON array that contains all collection content, which " +
        "can be uploaded back into the collections via the JSON upload feature on the admin panel.\n" +
        "\t- an assessment_uploads/ directory, which contains all uploaded files, which on the server is located in" +
        upload_root + "/assessment_uploads/\n");

      console.log("Saving archive to: " + upload_root + "/" + archive_name + ".zip");
      zipfile.saveAs(upload_root + "/" + archive_name + ".zip");

      // Note that this it "upload" (the route from the upload package), rather
      // than "uploads", the directory...
      return "upload/" + archive_name + ".zip";
    }
  },

  import_JSON: function (json_string, collections_to_update, update_existing) {
    if (Meteor.isServer) {

      // Parse json_string
      var data;
      try {
        data = JSON.parse(json_string);
      } catch (e) {
        throw new Meteor.Error("<b>JSON parse error:</b> <br>" + e);
      }

      var error_message = "";
      var i, j, k;
      var collection_name, collection;

      // Go through each collection specification and check validity
      for (i = 0; i < collections_to_update.length; i++) {
        for (j = 0; j < data.length; j++) {
          // If not the right collection, skip
          if (data[j][0] != collections_to_update[i]) {
            continue;
          }

          collection_name = data[j][0];
          collection = global_collection_dictionary[collection_name];

          // Deal with the case in which a single entry is entered
          if (data[j][1].length === undefined) {
            var tmp = data[j][1];
            data[j][1] = [];
            data[j][1][0] = tmp;
          }

          console.log("Processing ", data[j][1].length,
            "document for collection: ", collection_name);

          //Fixing dates, checking schemas...
          console.log("  Mapping dates back into strings and checking schemas...");
          for (k = 0; k < data[j][1].length; k++) {
            try {
              // fix date
              data[j][1][k] = fix_dates(collection_name, data[j][1][k]);

              // check against schema
              if ("SimpleSchema" in collection) {
                check_against_schema(data[j][1][k], collection.simpleSchema());
              }
            } catch (e) {
              error_message += "ERROR: Collection " + collection_name +
                ", Document #" + k + ":\n\t";
              error_message += e.toString() + "\n";
            }
          }
        }
      }

      if (error_message != "") {
        throw new Meteor.Error("<b>Import error:</b><br>" + error_message);
      }

      console.log("Updating collections...");
      // At this point it's safe to do the uploads!!
      for (i = 0; i < collections_to_update.length; i++) {
        for (j = 0; j < data.length; j++) {
          // If not the right collection, skip
          if (data[j][0] != collections_to_update[i]) {
            continue;
          }

          collection_name = data[j][0];
          collection = global_collection_dictionary[collection_name];

          console.log("  Updating collection ", collection_name);
          for (k = 0; k < data[j][1].length; k++) {
            var docId = data[j][1][k]._id;

            if ((!docId) || (collection.find({_id: docId}).count() == 0)) {
              console.log("    Inserting a new document");
              collection.insert(data[j][1][k]);
            } else if (update_existing) {
              console.log("    Updating an existing document");
              collection.remove({_id: docId});
              collection.insert(data[j][1][k]);
            } else {
              // do nothing
            }
          }
        }
      }
      return;
    }
  },

});


/***** HELPERS *****/


function remove_from_collection(collection, doc_id) {
  console.log("REMOVE_FROM_COLLECTION: ", collection._name, doc_id);
  // First remove all linked documents
  switch (collection) {
    case Meteor.users:
      remove_all_documents_referring_to_user(doc_id);
      break;
    case OfferedCourses:
      remove_all_documents_referring_to_offered_course(doc_id);
      break;
    case AssessmentItems:
      remove_all_documents_referring_to_assessment_item(doc_id);
      break;
    case Semesters:
      remove_all_documents_referring_to_semester(doc_id);
      break;
    case Curricula:
      remove_all_documents_referring_to_curriculum(doc_id);
      break;
    case StudentOutcomes:
      var curriculum_id = StudentOutcomes.findOne({"_id": doc_id}).curriculum;
      remove_all_documents_referring_to_student_outcome(doc_id);
      break;
    case Courses:
      remove_all_documents_referring_to_course(doc_id);
      break;
    case CurriculumMappings:
      remove_all_documents_referring_to_curriculum_mapping(doc_id);
      break;
    case PerformanceIndicators:
      var outcome_id = PerformanceIndicators.findOne({"_id": doc_id}).student_outcome;
      remove_all_documents_referring_to_performance_indicator(doc_id);
      break;
    case UploadedFiles:
      remove_all_documents_referring_to_uploaded_file(doc_id);
      break;
  }

  // Second, remove the document itself
  collection.remove({"_id": doc_id});

  // Third, do some collection-specific cleanup
  switch (collection) {
    case PerformanceIndicators:
      // Fix all orders
      var allPIs = PerformanceIndicators.find({"student_outcome": outcome_id}, {sort: {order: 1}}).fetch();
      for (var i = 0; i < allPIs.length; i++) {
        Meteor.call("update_performance_indicator", allPIs[i]._id, {"order": i});
      }
      break;
    case StudentOutcomes:
      // Fix all orders
      var allOutcomes = StudentOutcomes.find({"curriculum": curriculum_id}, {sort: {order: 1}}).fetch();
      for (var i = 0; i < allOutcomes.length; i++) {
        Meteor.call("update_student_outcome", allOutcomes[i]._id, {"order": i});
      }
      break;
    default:
      break;
  }
}

function remove_all_documents_referring_to_user(user_id) {
  var offered_courses = OfferedCourses.find({"instructor": user_id}).fetch();
  for (var i = 0; i < offered_courses.length; i++) {
    remove_from_collection(OfferedCourses, offered_courses[i]._id);
  }
}

function remove_all_documents_referring_to_offered_course(offered_course_id) {
  var assessment_items = AssessmentItems.find({"offered_course": offered_course_id}).fetch();
  for (var i = 0; i < assessment_items.length; i++) {
    remove_from_collection(AssessmentItems, assessment_items[i]._id);
  }
}

function remove_all_documents_referring_to_assessment_item(assessment_item_id) {
  var assessment_item = AssessmentItems.findOne({"_id": assessment_item_id});

  var assessment_question_file_id = assessment_item.assessment_question_file;
  if (assessment_question_file_id) {
    remove_from_collection(UploadedFiles, assessment_question_file_id);
  }

  var sample_poor_answer_file_id = assessment_item.sample_poor_answer_file;
  if (sample_poor_answer_file_id) {
    remove_from_collection(UploadedFiles, sample_poor_answer_file_id);
  }

  var sample_medium_answer_file_id = assessment_item.sample_medium_answer_file;
  if (sample_medium_answer_file_id) {
    remove_from_collection(UploadedFiles, sample_medium_answer_file_id);
  }

  var sample_good_answer_file_id = assessment_item.sample_good_answer_file;
  if (sample_good_answer_file_id) {
    remove_from_collection(UploadedFiles, sample_good_answer_file_id);
  }
}

function remove_all_documents_referring_to_semester(semester_id) {
  var offered_courses = OfferedCourses.find({"semester": semester_id}).fetch();
  for (var i = 0; i < offered_courses.length; i++) {
    remove_from_collection(OfferedCourses, offered_courses[i]._id);
  }
}

function remove_all_documents_referring_to_curriculum(curriculum_id) {

  // Student Outcomes
  var student_outcomes = StudentOutcomes.find({"curriculum": curriculum_id}).fetch();
  for (var i = 0; i < student_outcomes.length; i++) {
    remove_from_collection(StudentOutcomes, student_outcomes[i]._id);
  }

  // Courses
  var courses = Courses.find({"curriculum": curriculum_id}).fetch();
  for (i = 0; i < courses.length; i++) {
    remove_from_collection(Courses, courses[i]._id);
  }

  // CurriculumMappings
  var curriculum_mappings = CurriculumMappings.find({"curriculum": curriculum_id}).fetch();
  for (i = 0; i < curriculum_mappings.length; i++) {
    remove_from_collection(CurriculumMappings, curriculum_mappings[i]._id);
  }

  // Semesters
  var semesters = Semesters.find({"curriculum": curriculum_id}).fetch();
  for (i = 0; i < semesters.length; i++) {
    remove_from_collection(Semesters, semesters[i]._id);
  }
}

function remove_all_documents_referring_to_student_outcome(student_outcome_id) {
  var performance_indicators = PerformanceIndicators.find({"student_outcome": student_outcome_id}).fetch();
  for (var i = 0; i < performance_indicators.length; i++) {
    remove_from_collection(PerformanceIndicators, performance_indicators[i]._id);
  }
}

function remove_all_documents_referring_to_course(course_id) {

  // Offered Courses
  var offered_courses = OfferedCourses.find({"course": course_id}).fetch();
  for (var i = 0; i < offered_courses.length; i++) {
    remove_from_collection(OfferedCourses, offered_courses[i]._id);
  }

  //  CurriculumMappings
  var curriculum_mappings = CurriculumMappings.find({"course": course_id}).fetch();
  for (i = 0; i < curriculum_mappings.length; i++) {
    remove_from_collection(CurriculumMappings, curriculum_mappings[i]._id);
  }
}

function remove_all_documents_referring_to_curriculum_mapping(curriculum_mapping_id) {
  // Nothing to do
}

function remove_all_documents_referring_to_performance_indicator(performance_indicator_id) {
  // Assessment Items
  var assessment_items = AssessmentItems.find({"performance_indicator": performance_indicator_id}).fetch();
  for (var i = 0; i < assessment_items.length; i++) {
    remove_from_collection(AssessmentItems, assessment_items[i]._id);
  }
  // Curriculum Mappings
  var curriculum_mappings = CurriculumMappings.find({"performance_indicator": performance_indicator_id}).fetch();
  for (var i = 0; i < curriculum_mappings.length; i++) {
    remove_from_collection(CurriculumMappings, curriculum_mappings[i]._id);
  }
}

function remove_all_documents_referring_to_uploaded_file(uploaded_file_id) {
  var uploaded_file = UploadedFiles.findOne({"_id": uploaded_file_id});
  remove_uploaded_filepath(uploaded_file.fileinfo.path);

}

function remove_uploaded_filepath(filepath) {
  if (Meteor.isServer) {
    console.log("Removing file ", filepath);
    try {
      UploadServer.delete(filepath);
    } catch (e) {
      console.log("Trying to remove a file that's already gone... no biggy.");
    }
  }
}

function collections_2_string() {
  var string = "[ ";

  for (var collection_name in global_collection_dictionary) {
    if (global_collection_dictionary.hasOwnProperty(collection_name)) {
      string += ' [ "' + collection_name + '" , ' +
        collection_2_string(collection_name) + " ],";
    }
  }
  string = string.slice(0, -1); // Remove last comma
  string += "]\n";
  return string;
}


function collection_2_string(collection_name) {

  var cursor = global_collection_dictionary[collection_name].find();
  if (cursor.count() == 0) {
    return "[ ]";
  }
  var string = "[ ";

  var documents = cursor.fetch();
  for (var i = 0; i < documents.length; i++) {
    string += JSON.stringify(documents[i]);
    string += ",";
  }
  string = string.slice(0, -1); // Remove last comma
  string += " ]";

  return string;
}


// Fix dates in documents
function fix_dates(collection_name, doc) {
  try {
    for (var attribute in doc) {
      if (doc.hasOwnProperty(attribute)) {
        if ((collection_name == "AssessmentItems") && (attribute == "date_last_modified")) {
          doc.date_last_modified = new Date(doc.date_last_modified);
        }
        if ((collection_name == "Curricula") && (attribute == "date_created")) {
          doc.date_created = new Date(doc.date_created);
        }
      }
    }
  } catch (e) {
    throw e;
  }
  return doc;
}

// Check that the document is well-specified (with the extra _id check)
function check_against_schema(document, schema) {
  // Check that "_id" is provided
  if (!("_id" in document)) {
    throw {
      name: "Missing attribute",
      message: "Document must have an _id attribute",
      toString: function () {
        return this.name + ": " + this.message;
      }
    };
  }
  // Check against the schema
  check(document, schema);
}