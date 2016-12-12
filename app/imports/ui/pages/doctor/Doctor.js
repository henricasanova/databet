Template.Doctor.onCreated(function () {
  // Use this.subscribe inside onCreated callback
  this.subscribe("Meteor.users");
  this.subscribe("Semesters");
  this.subscribe("Curricula");
  this.subscribe("StudentOutcomes");
  this.subscribe("PerformanceIndicators");
  this.subscribe("Courses");
  this.subscribe("CurriculumMappings");
  this.subscribe("OfferedCourses");
  this.subscribe("AssessmentItems");
  this.subscribe("UploadedFiles");
});