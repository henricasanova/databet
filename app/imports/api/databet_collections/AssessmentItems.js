import { Meteor } from 'meteor/meteor';
import { DatabetCollection} from './DatabetCollection';
import { UploadedFiles } from './UploadedFiles';
import { CurriculumMappings } from './CurriculumMappings';
import { StudentOutcomes } from './StudentOutcomes';
import { PerformanceIndicators } from './PerformanceIndicators';

class AssessmentItemsCollection extends DatabetCollection {

  // Overriding the original remove
  remove_document(doc_id, callback) {

    // Remove referenced Uploaded Files!
    const doc = this.findOne({"_id": doc_id});
    if (doc) {
      if (doc.assessment_question_is_file) {
        UploadedFiles.remove_document(doc.assessment_question_file);
      }
      if (doc.sample_poor_answer_is_file) {
        UploadedFiles.remove_document(doc.sample_poor_answer_is_file);
      }
      if (doc.sample_medium_answer_is_file) {
        UploadedFiles.remove_document(doc.sample_medium_answer_is_file);
      }
      if (doc.sample_good_answer_is_file) {
        UploadedFiles.remove_document(doc.sample_good_answer_is_file);
      }
    }

    // Get the SO for the assessment item
    const curriculum_mapping = CurriculumMappings.findOne({"_id": doc.curriculum_mapping});
    const performance_indicator = PerformanceIndicators.findOne(
      {"_id": curriculum_mapping.performance_indicator});
    const student_outcome_id = StudentOutcomes.findOne({"_id": performance_indicator.student_outcome})._id;

    // Remove the document itself
    super.remove_document(doc_id, callback);

    // Update the critical status of the student outcome
    Meteor.call("update_student_outcome_critical", student_outcome_id);
  }

  insert_document(doc, callback) {

    // Insert the document
    super.insert_document(doc,callback);

    // Get the SO for the assessment item
    const curriculum_mapping = CurriculumMappings.findOne({"_id": doc.curriculum_mapping});
    const performance_indicator = PerformanceIndicators.findOne(
      {"_id": curriculum_mapping.performance_indicator});
    const student_outcome_id = StudentOutcomes.findOne({"_id": performance_indicator.student_outcome})._id;

    // Update the critical status of the student outcome
    Meteor.call("update_student_outcome_critical", student_outcome_id);

  }

  update_document(doc_id, modifier, callback) {

    console.log("IN UPDATE DOCUMENT FOR ASSESSMENT ITEM", doc_id);

    let old_curriculum_mapping = null;

    if (modifier.hasOwnProperty("curriculum_mapping")) {
      old_curriculum_mapping = AssessmentItems.findOne({"_id": doc_id}).curriculum_mapping;
      // console.log("OLD: ", old_curriculum_mapping, "NEW: ", modifier.curriculum_mapping);
    }

    // Update the document
    super.update_document(doc_id, modifier, callback);

    // Get the new version of the document
    let doc = AssessmentItems.findOne({"_id": doc_id});

    // Get the new SO for the assessment item
    const curriculum_mapping = CurriculumMappings.findOne({"_id": doc.curriculum_mapping});
    // console.log("curriculum_mapping = ", curriculum_mapping);
    const performance_indicator = PerformanceIndicators.findOne(
      {"_id": curriculum_mapping.performance_indicator});
    const student_outcome_id = StudentOutcomes.findOne({"_id": performance_indicator.student_outcome})._id;
    // Update the critical status of the student outcome
    Meteor.call("update_student_outcome_critical", student_outcome_id);


    // Was there an old SO to update as well? (which could now become critical?)
    if (old_curriculum_mapping) {
      const curriculum_mapping = CurriculumMappings.findOne({"_id": old_curriculum_mapping});
      const performance_indicator = PerformanceIndicators.findOne({"_id": curriculum_mapping.performance_indicator});
      const student_outcome_id = StudentOutcomes.findOne({"_id": performance_indicator.student_outcome})._id;
      // Update the critical status of the student outcome
      Meteor.call("update_student_outcome_critical", student_outcome_id);
    }

  }

}

export const AssessmentItems = new AssessmentItemsCollection("AssessmentItems");


AssessmentItems.attachSchema(new SimpleSchema({

  _id: {
    type: String,
    optional: false
  },

  offered_course: {
    type: String,
    optional: false,
  },

  curriculum_mapping: {
    type: String,
    optional: false,
  },

  date_last_modified: {
    type: Date,
    optional: false
  },

  instructor: {
    type: String,
    optional: false
  },

  // Below are the real Data Fields

  assessment_type: {    // exam question, homework assignment, quiz,
    type: String,
    optional: false
  },

  assessment_question_is_file: {
    type: Boolean,
    optional: false
  },

  assessment_question_text: { // file
    type: String,
    optional: true
  },

  assessment_question_file: { // file
    type: String,
    optional: true
  },

  grades: {   // comma-separated list
    type: String,
    optional: false
  },

  max_grade: {
    type: Number,
    optional: false
  },


  comments: {
    type: String,
    optional: true
  },


  sample_poor_answer_is_file: {
    type: Boolean,
    optional: false
  },

  sample_medium_answer_is_file: {
    type: Boolean,
    optional: false
  },

  sample_good_answer_is_file: {
    type: Boolean,
    optional: false
  },

  sample_poor_answer_file: {
    type: String, // _id of UploadedFile
    optional: true
  },

  sample_medium_answer_file: {
    type: String, // _id of UploadedFile
    optional: true
  },

  sample_good_answer_file: {
    type: String, // _id of UploadedFile
    optional: true
  },

  sample_poor_answer_text: {
    type: String,
    optional: true
  },

  sample_medium_answer_text: {
    type: String,
    optional: true
  },

  sample_good_answer_text: {
    type: String,
    optional: true
  },

}));





