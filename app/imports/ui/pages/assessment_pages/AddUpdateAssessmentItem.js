import { OfferedCourses } from '../../../api/databet_collections/OfferedCourses';
import { Semesters } from '../../../api/databet_collections/Semesters';
import { Courses } from '../../../api/databet_collections/Courses';
import { StudentOutcomes } from '../../../api/databet_collections/StudentOutcomes';
import { AssessmentItems } from '../../../api/databet_collections/AssessmentItems';
import { CurriculumMappings } from '../../../api/databet_collections/CurriculumMappings';
import { UploadedFiles } from '../../../api/databet_collections/UploadedFiles';
import { PerformanceIndicators } from '../../../api/databet_collections/PerformanceIndicators';
import { Meteor } from 'meteor/meteor';
import { semesterid_to_semesterstring } from '../../../api/global_helpers/semesters';
import { Random } from 'meteor/random';
import { get_current_username } from '../../../api/global_helpers/users_and_usernames';
import { get_current_user } from '../../../api/global_helpers/users_and_usernames';

Template.AddUpdateAssessmentItem.onRendered(function () {
  // Initialize dropdown
  $('.ui.dropdown')
    .dropdown();

  //console.log("UPLOADED FILES", UploadedFiles.find({}).fetch());

  // Initialize radio and standard checkboxes
  $('.ui.radio.checkbox').checkbox();
  $('.ui.checkbox').checkbox();

  // Initialize tabs
  $('.tabular.menu .item').tab();

});

list_of_assessment_types = [
  "Exam question",
  "Quiz question",
  "Homework assignment question",
  "Individual project",
  "Group project",
  "In-class presentation",
  "In-class participation",
  "Written report",
  "Web artifact",
  "On-line participation"
];

Template.AddUpdateAssessmentItem.onCreated(function () {

  /*** ReactiveVar to make the whole page visible or not */

  this.is_visible = new ReactiveVar();
  Template.instance().is_visible.set(true);

  /*** Get the relevant info from the current URL */

  // Existing assessment item (in case of update)
  if (Template.currentData().action == "update") {
    this.existing_assessment_item = AssessmentItems.findOne({"_id": FlowRouter.getParam("_id")});
  } else {
    this.existing_assessment_item = null;
  }

  // Relevant offered_course
  if (Template.currentData().action == "update") {
    this.offered_course = OfferedCourses.findOne({"_id": Template.instance().existing_assessment_item.offered_course});
  } else {
    this.offered_course = OfferedCourses.findOne({"_id": FlowRouter.getParam("_id")});
  }


  /*** Create ReactiveVars for missing content warnings on the HTML ***/

  this.missing_content_reactive_vars = {};
  const missing_content_names = [
    "curriculum_mapping",
    "assessment_item_type",
    "custom_assessment_item_type",
    "assessment_question_text",
    "assessment_question_file",
    "grades",
    "maximum_grade",
    "sample_poor_answer_text",
    "sample_poor_answer_file",
    "sample_medium_answer_text",
    "sample_medium_answer_file",
    "sample_good_answer_text",
    "sample_good_answer_file"];

  for (let i = 0; i < missing_content_names.length; i++) {
    const missing_content_name = missing_content_names[i];
    Template.instance().missing_content_reactive_vars[missing_content_name] = new ReactiveVar();
    Template.instance().missing_content_reactive_vars[missing_content_name].set(false);
  }

  /*** ReactiveVar to control whether the assessment type is "other" ***/

  this.type_is_other = new ReactiveVar();

  if (Template.currentData().action == "add") {
    Template.instance().type_is_other.set(false);
  } else {
    // Check if we're in the list of non-other assessment types
    if (list_of_assessment_types.indexOf(Template.instance().existing_assessment_item.assessment_type) == -1) {
      Template.instance().type_is_other.set(true);
    }
  }

  /*** ReactiveVars to warn user of invalid (numerical) values ***/

  this.invalid_grades = new ReactiveVar();
  Template.instance().invalid_grades.set(false);
  this.invalid_maximum_grade = new ReactiveVar();
  Template.instance().invalid_maximum_grade.set(false);

  /*** ReactiveVar to see whether the "Save" button has been clicked **/
  this.save_has_been_clicked_once = new ReactiveVar();
  Template.instance().save_has_been_clicked_once.set(false);

  /*** ReactiveVar to see whether help is enabled **/
  this.help_is_enabled = new ReactiveVar();
  Template.instance().help_is_enabled.set(true);

  /*** Variables for file upload book-keeping ***/

  this.file_uploads = {};
  Template.instance().file_uploads["assessment_question"] = {
    "is_file": null,
    "text_area_id": null,
    "file": null,
  };
  Template.instance().file_uploads["sample_poor_answer"] = {
    "is_file": null,
    "text_area_id": null,
    "file": null,
  };
  Template.instance().file_uploads["sample_medium_answer"] = {
    "is_file": null,
    "text_area_id": null,
    "file": null,
  };
  Template.instance().file_uploads["sample_good_answer"] = {
    "is_file": null,
    "text_area_id": null,
    "file": null,
  };

});


Template.AddUpdateAssessmentItem.helpers({

  "is_add": function () {
    return (Template.currentData().action == "add");
  },

  "is_update": function () {
    return (Template.currentData().action == "update");
  },

  "is_visible": function () {
    return Template.instance().is_visible.get();
  },

  "help_is_enabled": function() {
    return Template.instance().help_is_enabled.get();
  },

  "course_string": function () {
    let course = Courses.findOne({"_id": Template.instance().offered_course.course});
    return course.alphanumeric;

  },

  "semester_string": function () {
    return semesterid_to_semesterstring(Template.instance().offered_course.semester);
  },

  "save_has_been_clicked_once": function() {
    return Template.instance().save_has_been_clicked_once.get();
  },

  "get_offered_course_id": function () {

    return Template.instance().offered_course._id;
  },

  // "list_of_curriculum_mappings": function () {
  //
  //   let offered_course = Template.instance().offered_course;
  //   console.log("LIST OF CURR MAPING: ", CurriculumMappings.find({"course": offered_course.course}).fetch() );
  //   return CurriculumMappings.find({"course": offered_course.course}).fetch();
  // },

  "list_of_curriculum_mappings": function () {
    const critical_marker =   "<div class=\"ui label red\"> CRITICAL </div>";
    const desirable_marker =  "<div class=\"ui label blue\">DESIRABLE</div>";

    let offered_course = Template.instance().offered_course;
    let list_of_curriculum_mappings =  CurriculumMappings.find({"course": offered_course.course}).fetch();

    // Initialize order, scores and markers
    for (let i=0; i < list_of_curriculum_mappings.length; i++) {
      list_of_curriculum_mappings[i].order = 0;
      list_of_curriculum_mappings[i].critical_score = 0;
      list_of_curriculum_mappings[i].desirable_score = 0;
      list_of_curriculum_mappings[i].critical_marker = "";
      list_of_curriculum_mappings[i].desirable_marker = "";
    }

    // Compute critical_score
    let no_critical = true;
    for (let i=0; i < list_of_curriculum_mappings.length; i++) {
      const curriculum_mapping = list_of_curriculum_mappings[i];
      const performance_indicator = PerformanceIndicators.findOne({"_id": curriculum_mapping.performance_indicator});
      const student_outcome = StudentOutcomes.findOne({"_id": performance_indicator.student_outcome});

      if (student_outcome.critical) {
        list_of_curriculum_mappings[i].critical_score = 1;
        no_critical = false;
      }
    }

    // Compute the desirable score
    let max_desirable_score = 0;

    // Don't even think about "desirable" if things are critical"
    if (no_critical) {

      // Compute desirable_score
      for (let i = 0; i < list_of_curriculum_mappings.length; i++) {
        let score = mappingDesirableScore(offered_course, list_of_curriculum_mappings[i]);
        list_of_curriculum_mappings[i].desirable_score = score;
        if (score > max_desirable_score) {
          max_desirable_score = score;
        }
      }
    }

    // Set the critical markers and order
    for (let i=0; i < list_of_curriculum_mappings.length; i++) {
      if (list_of_curriculum_mappings[i].critical_score > 0) {
        list_of_curriculum_mappings[i].critical_marker = critical_marker;
        list_of_curriculum_mappings[i].order = 2;
      }
    }

    if (no_critical && (max_desirable_score > 0)) {
      for (let i = 0; i < list_of_curriculum_mappings.length; i++) {
        if ((list_of_curriculum_mappings[i].desirable_score >= max_desirable_score) &&
          (list_of_curriculum_mappings[i].critical_score == 0)) {
          list_of_curriculum_mappings[i].desirable_marker = desirable_marker;
          list_of_curriculum_mappings[i].order = 1;
        }
      }
    }

    // Sort the desirable mappings by order
    list_of_curriculum_mappings.sort(function(a,b) { return b.order - a.order;});

    return list_of_curriculum_mappings;
  },

  "curriculum_mapping_is_selected": function () {
    if (Template.instance().existing_assessment_item) {
      if (Template.instance().existing_assessment_item.curriculum_mapping == this._id) {
        return true;
      }
    }
    return false;
  },

  "assessment_type_is_selected": function () {
    if (Template.instance().existing_assessment_item) {
      if (Template.instance().existing_assessment_item.assessment_type.valueOf() == this.valueOf()) {
        return true;
      }
    }
    return false;
  },

  "existing_item_content": function (name) {

    // In case this is called by mistake in "add" mode
    let existing_assessment_item = Template.instance().existing_assessment_item;

    if (!existing_assessment_item) {
      return "";
    }

    switch (name) {
      case "upload_method_is_file":
        return (existing_assessment_item.assessment_question_is_file);
      case "upload_method_is_text":
        return (!existing_assessment_item.assessment_question_is_file);
      case "assessment_question_text":
        return (existing_assessment_item.assessment_question_text);
      case "uploaded_question_file":
        return (existing_assessment_item.assessment_question_file == "null" ? null : existing_assessment_item.assessment_question_file);
      case "grades":
        return existing_assessment_item.grades;
      case "max_grade":
        return existing_assessment_item.max_grade;
      case "comments":
        return existing_assessment_item.comments;
      case "uploaded_sample_poor_answer":
        return (existing_assessment_item.sample_poor_answer == "null" ? null : existing_assessment_item.sample_poor_answer);
      case "uploaded_sample_medium_answer":
        return (existing_assessment_item.sample_medium_answer == "null" ? null : existing_assessment_item.sample_medium_answer);
      case "uploaded_sample_good_answer":
        return (existing_assessment_item.sample_good_answer == "null" ? null : existing_assessment_item.sample_good_answer);
      default:
        return "[INTERNAL ERROR - existing_item_content]";
    }
  },

  "assessment_type_other_is_selected": function () {
    if (Template.instance().existing_assessment_item) {
      if (list_of_assessment_types.indexOf(Template.instance().existing_assessment_item.assessment_type) == -1) {
        return "selected";
      }
    }
    return "";
  },

  "type_other_value": function () {
    return Template.instance().existing_assessment_item.assessment_type;
  },

  "curr_mapping_description": function () {
    let performance_indicator = PerformanceIndicators.findOne({"_id": this.performance_indicator});
    //let score = (Random.fraction() * 4) | 0;

    return performance_indicator.description;
  },

  "curr_mapping_level": function () {
    return this.level.toUpperCase();
  },

  "curr_mapping_critical": function () {
    return this.critical_marker;
  },

  "curr_mapping_desirable": function () {
    return this.desirable_marker;
  },




  "are_there_errors": function() {
    for (let error_var in Template.instance().missing_content_reactive_vars) {
      if (Template.instance().missing_content_reactive_vars.hasOwnProperty(error_var)) {
        if (Template.instance().missing_content_reactive_vars[error_var].get() == true) {
          return true;
        }
      }
    }
    return false;
  },

  "are_there_errors_in_poor_tab": function() {
    return (Template.instance().missing_content_reactive_vars["sample_poor_answer_text"].get() ||
    Template.instance().missing_content_reactive_vars["sample_poor_answer_file"].get())
  },
  "are_there_errors_in_medium_tab": function() {
    return (Template.instance().missing_content_reactive_vars["sample_medium_answer_text"].get() ||
    Template.instance().missing_content_reactive_vars["sample_medium_answer_file"].get())
  },
  "are_there_errors_in_good_tab": function() {
    return (Template.instance().missing_content_reactive_vars["sample_good_answer_text"].get() ||
    Template.instance().missing_content_reactive_vars["sample_good_answer_file"].get())
  },

  "missing_content": function (content_name) {
    return Template.instance().missing_content_reactive_vars[content_name].get();
  },

  "some_missing_sample_answers": function () {
    var missing_poor = Template.instance().missing_content_reactive_vars["sample_poor_answer_text"].get() ||
      Template.instance().missing_content_reactive_vars["sample_poor_answer_file"].get();
    var missing_medium = Template.instance().missing_content_reactive_vars["sample_medium_answer_text"].get() ||
      Template.instance().missing_content_reactive_vars["sample_medium_answer_file"].get();
    var missing_good = Template.instance().missing_content_reactive_vars["sample_good_answer_text"].get() ||
      Template.instance().missing_content_reactive_vars["sample_good_answer_file"].get();

    return (missing_poor || missing_medium || missing_good);
  },

  "some_missing_sample_answers_warning": function () {
    var missing_poor = Template.instance().missing_content_reactive_vars["sample_poor_answer_text"].get() ||
      Template.instance().missing_content_reactive_vars["sample_poor_answer_file"].get();
    var missing_medium = Template.instance().missing_content_reactive_vars["sample_medium_answer_text"].get() ||
      Template.instance().missing_content_reactive_vars["sample_medium_answer_file"].get();
    var missing_good = Template.instance().missing_content_reactive_vars["sample_good_answer_text"].get() ||
      Template.instance().missing_content_reactive_vars["sample_good_answer_file"].get();

    var string = "";
    if (missing_poor || missing_medium || missing_good) {
      string += "You must enter data in the above tabs: ";
      if (missing_poor) {
        string += "[Poor Answer]";
        if (missing_medium || missing_good) {
          string += ", ";
        }
      }

      if (missing_medium) {
        string += "[Mid-Range Answer]";
        if (missing_good) {
          string += ", ";
        }
      }
      if (missing_good) {
        string += "[Good Answer]";
      }
    }
    string += ".";
    return string;
  },


  "invalid_grades": function () {
    return Template.instance().invalid_grades.get();
  },

  "invalid_maximum_grade": function () {
    return Template.instance().invalid_maximum_grade.get();
  },

  "list_of_assessment_item_types": function () {
    return list_of_assessment_types;
  },

  "type_is_other": function () {
    return Template.instance().type_is_other.get();
  },

  "assessment_question_upload_context": function () {
    return generic_upload_context("assessment_question");
  },

  "sample_poor_answer_upload_context": function () {
    return generic_upload_context("sample_poor_answer");
  },

  "sample_medium_answer_upload_context": function () {
    return generic_upload_context("sample_medium_answer");
  },

  "sample_good_answer_upload_context": function () {
    return generic_upload_context("sample_good_answer");
  },

});


function generic_upload_context(name) {
  return {
    "my_name": name,
    "action": Template.currentData().action,
    "initial_method_is_file": ((Template.instance().existing_assessment_item != null) ?
      Template.instance().existing_assessment_item[name + "_is_file"] : true),
    "initial_file": (Template.instance().existing_assessment_item &&
    Template.instance().existing_assessment_item[name + "_is_file"] ?
      Template.instance().existing_assessment_item[name + "_file"] : null),
    "initial_text": (Template.instance().existing_assessment_item && !Template.instance().existing_assessment_item[name + "_is_file"] ?
      Template.instance().existing_assessment_item[name + "_text"] : ""),
    "final_state": Template.instance().file_uploads[name],
    "text_area_id": name + "_text_area",
    "missing_text_reactive_var": Template.instance().missing_content_reactive_vars[name + "_text"],
    "missing_file_reactive_var": Template.instance().missing_content_reactive_vars[name + "_file"],
  };
}


Template.AddUpdateAssessmentItem.events({

  // Events that react to input modification by users

  "change #enable_help": function(e) {
    //console.log("CHANGE = ", $('#enable_help').is(":checked"));
    Template.instance().help_is_enabled.set($('#enable_help').is(":checked"));
  },

  "change #curriculum_mapping": function (e) {
    Template.instance().missing_content_reactive_vars["curriculum_mapping"].set(false);
  },

  "change #assessment_item_type": function (e) {
    Template.instance().missing_content_reactive_vars["assessment_item_type"].set(false);

    let assessment_type = $('#assessment_item_type').val();
    if (assessment_type == "other") {
      Template.instance().type_is_other.set(true);
    } else {
      Template.instance().type_is_other.set(false);
      Template.instance().missing_content_reactive_vars["custom_assessment_item_type"].set(false);
    }
  },

  "keydown #custom_assessment_item_type_input": function (e) {
    Template.instance().missing_content_reactive_vars["custom_assessment_item_type"].set(false);

  },

  "keydown #assessment_grades": function (e) {
    Template.instance().missing_content_reactive_vars["grades"].set(false);
    Template.instance().invalid_grades.set(false);
  },

  "keydown #maximum_grade": function (e) {
    Template.instance().missing_content_reactive_vars["maximum_grade"].set(false);
    Template.instance().invalid_maximum_grade.set(false);
  },

  "click #cancel": function (e) {

    // Go back
    if (Template.currentData().action == "add") {
      Template.currentData().set_to_false_when_done.set(false);
    } else {
      FlowRouter.go('/assessment_items/' + Template.instance().offered_course._id);
    }
  },

  "click #submit": function (e) {

    let allGood = true;

    Template.instance().save_has_been_clicked_once.set(true);

    // Build a tentative object based on what's been entered
    let tentative_doc = {};

    // Curriculum mapping
    tentative_doc.curriculum_mapping_id = $('#curriculum_mapping').val();
    if (tentative_doc.curriculum_mapping_id == "") {
      Template.instance().missing_content_reactive_vars["curriculum_mapping"].set(true);
      allGood = false;
    }

    // Assessment item type
    tentative_doc.assessment_item_type = $('#assessment_item_type').val();
    if (tentative_doc.assessment_item_type == "") {
      Template.instance().missing_content_reactive_vars["assessment_item_type"].set(true);
      allGood = false;
    }

    if (tentative_doc.assessment_item_type == "other") {
      let entered_string = $('#custom_assessment_item_type_input').val();
      if (entered_string.length < 5) {
        Template.instance().missing_content_reactive_vars["custom_assessment_item_type"].set(true);
        allGood = false;
      } else {
        tentative_doc.assessment_type = entered_string;
      }
    }


    // Grades
    tentative_doc.grades = $('#assessment_grades').val();
    if (tentative_doc.grades.length < 1) {
      Template.instance().missing_content_reactive_vars["grades"].set(true);
      allGood = false;
    } else {
      // Replace white spaces by commas
      tentative_doc.grades = tentative_doc.grades.replace(/ /g, ",");
      // Replace carriage returns by commas
      tentative_doc.grades = tentative_doc.grades.replace(/\n/g, ",");
      // Replace sequences of commas by one comma
      tentative_doc.grades = tentative_doc.grades.replace(/,+/g, ",");
      // Remove all training commas
      tentative_doc.grades = tentative_doc.grades.replace(/,+$/, "");
      // Get numerical grades
      const grades = tentative_doc.grades.split(",");
      for (let i = 0; i < grades.length; i++) {
        if (isNaN(grades[i])) {
          Template.instance().invalid_grades.set(true);
          allGood = false;
          break;
        } else {
        }
      }
    }

    // Maximum grade
    tentative_doc.max_grade = $('#maximum_grade').val();
    if (tentative_doc.max_grade.length < 1) {
      Template.instance().missing_content_reactive_vars["maximum_grade"].set(true);
      allGood = false;
    }
    if (isNaN(tentative_doc.max_grade)) {
      Template.instance().invalid_maximum_grade.set(true);
      allGood = false;
    }

    // Comments
    tentative_doc.comments = $('#comments').val();


    // File/text input

    let list_of_file_or_text_names = ["assessment_question", "sample_poor_answer", "sample_medium_answer", "sample_good_answer"];
    for (let i = 0; i < list_of_file_or_text_names.length; i++) {
      const name = list_of_file_or_text_names[i];
      const final_state = Template.instance().file_uploads[name];
      if (!final_state.is_file) {  // Text
        tentative_doc[name + "_is_file"] = false;
        tentative_doc[name + "_file"] = null;
        tentative_doc[name + "_text"] = $('#' + final_state.text_area_id).val();
        if (tentative_doc[name + "_text"].length < 10) {
          Template.instance().missing_content_reactive_vars[name + "_text"].set(true);
          allGood = false;
        }
      } else {  // Uploaded file input
        tentative_doc[name + "_is_file"] = true;
        tentative_doc[name + "_text"] = "";
        if (final_state.file == null) {
          if (Template.currentData().action == "add") {
            Template.instance().missing_content_reactive_vars[name + "_file"].set(true);
            allGood = false;
          } else {
            if (Template.instance().existing_assessment_item[name + "_file"] == null) {
              Template.instance().missing_content_reactive_vars[name + "_file"].set(true);
              allGood = false;
            }
          }
        }
        tentative_doc[name + "_file"] = final_state["file"];  // perhaps null
      }
    }

    if (!allGood) {
      return false;
    }

    console.log("ALL GOOD, LET'S DO IT!!!");

    console.log("TENTATIVE DOC = ", tentative_doc);

    // console.log("*** ALL GOOD!!! ***");
    /**** After this point, we know we will successfully add the item ****/

    // disable the template to avoid race conditions
    Template.instance().is_visible.set(false);

    /**** Deal with files ****/

    list_of_file_or_text_names = ["assessment_question", "sample_poor_answer", "sample_medium_answer", "sample_good_answer"];

    for (let i = 0; i < list_of_file_or_text_names.length; i++) {
      const name = list_of_file_or_text_names[i];


      // console.log("TENTATIVE DOC NAME: ", name, "  ", tentative_doc[name + "_file"]);
      // Remove the old file if necessary

      let there_was_a_previously_uploaded_file;
      let we_are_now_uploading_text;
      let we_are_uploading_a_new_file;
      let id_of_previously_uploaded_file = null;
      let new_file_object = null;

      there_was_a_previously_uploaded_file =
        (Template.instance().existing_assessment_item != null) &&
        (Template.instance().existing_assessment_item[name + "_is_file"] == true);
      if (there_was_a_previously_uploaded_file) {
        id_of_previously_uploaded_file = Template.instance().existing_assessment_item[name + "_file"];
      }

      we_are_now_uploading_text = (tentative_doc[name + "_is_file"] == false);
      we_are_uploading_a_new_file = (!we_are_now_uploading_text) &&
        (tentative_doc[name + "_file"] != null);
      if (we_are_uploading_a_new_file) {
        new_file_object = tentative_doc[name + "_file"];
      }

      // Removing an old file?
      if ( (there_was_a_previously_uploaded_file && we_are_now_uploading_text) ||
        (there_was_a_previously_uploaded_file && we_are_uploading_a_new_file) ) {
        // console.log("   REMOVING FILE EXISTING ", id_of_previously_uploaded_file);
        UploadedFiles.remove_document(id_of_previously_uploaded_file);
        // UploadedFiles.remove({meta: {"databet_id": id_of_previously_uploaded_file}});
      }

      // Dealing with a new file?
      if (we_are_uploading_a_new_file) {
        // console.log("I SHOULD CREATE A NEW FILE for ", name, " ", new_file_object);
        var fileObj = new_file_object;
        tentative_doc[name + "_file"] = Random.id(); // fake it as an id

        var semester_string = semesterid_to_semesterstring(Template.instance().offered_course.semester);
        semester_string = semester_string.replace(/ /g,'_');
        var course_alpha = Courses.findOne({"_id": Template.instance().offered_course.course}).alphanumeric;
        course_alpha = course_alpha.replace(/ /g,'_');
        var username =get_current_username();

        var prefix = semester_string+":"+course_alpha+":"+username;
        //console.log("PREFIX = ", prefix);
        UploadedFiles.insert_document(fileObj, tentative_doc[name + "_file"], prefix);
      }

      // Are we simply faking the previous file (doing a useless overwrite, but allowing us
      // to use the same code for add and update
      if (!we_are_now_uploading_text && there_was_a_previously_uploaded_file && !we_are_uploading_a_new_file) {
        tentative_doc[name + "_file"] = id_of_previously_uploaded_file;
      }
    }

    console.log("FINAL TENTATIVE DOC=", tentative_doc);
    if (Template.currentData().action == "add") {

      console.log("I AM DOING AN ADD!!!!");
      // Create the assessment item
      var assessment_item = {
        instructor: get_current_user(),
        offered_course: Template.instance().offered_course._id,
        curriculum_mapping: tentative_doc.curriculum_mapping_id,
        date_last_modified: new Date(),
        assessment_type: tentative_doc.assessment_item_type,
        assessment_question_is_file: tentative_doc.assessment_question_is_file,
        assessment_question_text: tentative_doc.assessment_question_text,
        assessment_question_file: tentative_doc.assessment_question_file,
        grades: tentative_doc.grades,
        max_grade: Number(tentative_doc.max_grade),
        comments: tentative_doc.comments,
        sample_poor_answer_is_file: tentative_doc.sample_poor_answer_is_file,
        sample_poor_answer_file: tentative_doc.sample_poor_answer_file,
        sample_poor_answer_text: tentative_doc.sample_poor_answer_text,
        sample_medium_answer_is_file: tentative_doc.sample_medium_answer_is_file,
        sample_medium_answer_file: tentative_doc.sample_medium_answer_file,
        sample_medium_answer_text: tentative_doc.sample_medium_answer_text,
        sample_good_answer_is_file: tentative_doc.sample_good_answer_is_file,
        sample_good_answer_file: tentative_doc.sample_good_answer_file,
        sample_good_answer_text: tentative_doc.sample_good_answer_text,
      };

      // console.log("CREATING ASSESSMENT ITEM ", assessment_item);
      AssessmentItems.insert_document(assessment_item);

      Template.currentData().set_to_false_when_done.set(false);

    } else {

      console.log("I AM DOING AN UPDATE");

      // Everything but files
      var modifier = {
        //offered_course: existing_assessment_item.offered_course,
        instructor: get_current_user(),
        curriculum_mapping: tentative_doc.curriculum_mapping_id,
        date_last_modified: new Date(),
        assessment_type: tentative_doc.assessment_item_type,
        assessment_question_is_file: tentative_doc.assessment_question_is_file,
        assessment_question_file: tentative_doc.assessment_question_file,
        assessment_question_text: tentative_doc.assessment_question_text,
        grades: tentative_doc.grades,
        max_grade: Number(tentative_doc.max_grade),
        comments: tentative_doc.comments,
        sample_poor_answer_is_file: tentative_doc.sample_poor_answer_is_file,
        sample_poor_answer_file: tentative_doc.sample_poor_answer_file,
        sample_poor_answer_text: tentative_doc.sample_poor_answer_text,
        sample_medium_answer_is_file: tentative_doc.sample_medium_answer_is_file,
        sample_medium_answer_file: tentative_doc.sample_medium_answer_file,
        sample_medium_answer_text: tentative_doc.sample_medium_answer_text,
        sample_good_answer_is_file: tentative_doc.sample_good_answer_is_file,
        sample_good_answer_file: tentative_doc.sample_good_answer_file,
        sample_good_answer_text: tentative_doc.sample_good_answer_text,
      };


      // Somehow, putting the FlowRouter.go() statement in the callback makes it all work...
      // without seeing annoying (but harmless) exceptions in helpers that should no longer
      // be rendered anyway... Looks like some kind of race condition...


      const url_to_return_to = "/assessment_items/" + Template.instance().offered_course._id;
      console.log("URL=", url_to_return_to);
      AssessmentItems.update_document(Template.instance().existing_assessment_item._id, modifier, function () {
        FlowRouter.go(url_to_return_to);
      });
    }

    return false;
  },

});

/** Helpers **/

// TODO: Do something real
function mappingDesirableScore(offered_course, pi) {
  let score = Random.fraction() * 100 | 0;
  // return score;
  return 0;
}





