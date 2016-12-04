AssessmentItems = new Mongo.Collection("AssessmentItems");

AssessmentItems.attachSchema(new SimpleSchema({
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





