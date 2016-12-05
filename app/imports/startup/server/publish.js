import '../../api/databet_collections/';

// Publish the Meteor.user collection
Meteor.publish("Meteor.users", function() {
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return Meteor.users.find({});
  } else {
    return Meteor.users.find({_id: this.userId});
  }
});

// Publish the Semesters collection
Meteor.publish("Semesters", function() {
  return Semesters.find({});
});

// Publish the Curricula collection
Meteor.publish("Curricula", function() {
  return Curricula.find({});
});

// Publish the StudentOutcomes collection
Meteor.publish("StudentOutcomes", function() {
  return StudentOutcomes.find({});
});

// Publish the PerformanceIndicators collection
Meteor.publish("PerformanceIndicators", function() {
  return PerformanceIndicators.find({});
});

// Publish the Courses collection
Meteor.publish("Courses", function() {
  return Courses.find({});
});

// Publish the OfferedCourses collection
Meteor.publish("OfferedCourses", function() {
  return OfferedCourses.find({});
});

// Publish the CurriculumMappings collection
Meteor.publish("CurriculumMappings", function() {
  return CurriculumMappings.find({});
});

// Publish the AssessmentItems collection
Meteor.publish("AssessmentItems", function() {
  return AssessmentItems.find({});
});

// Publish the UploadedFiles collection
Meteor.publish("UploadedFiles", function() {
  return UploadedFiles.find({});
});
