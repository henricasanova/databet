import '../../api/databet_collections/';
import { Meteor } from 'meteor/meteor';
import { AssessmentItems } from '../../api/databet_collections/AssessmentItems';
import { Courses } from '../../api/databet_collections/Courses';
import { Curricula } from '../../api/databet_collections/Curricula';
import { CurriculumMappings } from '../../api/databet_collections/CurriculumMappings';
import { OfferedCourses } from '../../api/databet_collections/OfferedCourses';
import { PerformanceIndicators } from '../../api/databet_collections/PerformanceIndicators';
import { Semesters } from '../../api/databet_collections/Semesters';
import { StudentOutcomes } from '../../api/databet_collections/StudentOutcomes';
import { Minutes } from '../../api/databet_collections/Minutes';
import { UploadedFiles } from '../../api/databet_collections/UploadedFiles';


// Meteor.publish("roomAndMessages", function (roomId) {
//   check(roomId, String);
//   return [
//     Rooms.find({_id: roomId}),
//     Messages.find({roomId: roomId})
//   ];
// });

//  Meteor.subscribe("counts-by-room", Session.get("roomId"));



Meteor.publish("offered_courses_for_a_user", function (instructor, archived) {
  check(instructor, String);
  check(archived, Boolean);
  return [
    OfferedCourses.find({instructor: instructor, archived: archived}),
  ]
});

Meteor.publish("list_of_semesters", function (list_of_semesters) {
  return [
    Semesters.find({_id: {$in: list_of_semesters}})
  ]
});


Meteor.publish("list_of_courses", function (list_of_courses) {
  return [
    Courses.find({_id: {$in: list_of_courses}})
  ]
});




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
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return OfferedCourses.find({});
  } else {
    return OfferedCourses.find({instructor: this.userId});
  }
});

// Publish the CurriculumMappings collection
Meteor.publish("CurriculumMappings", function() {
  return CurriculumMappings.find({});
});

// Publish the AssessmentItems collection
Meteor.publish("AssessmentItems", function() {
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return AssessmentItems.find({});
  } else {
    return AssessmentItems.find({instructor: this.userId});
  }
});

// Publish the UploadedFiles collection
Meteor.publish("UploadedFiles", function() {
    return UploadedFiles.find().cursor;  // Note the cursor here, as this is not
                                         // a MongoDB collection (but looks like one)
});

// Publish the Minutes collection
Meteor.publish("Minutes", function() {
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return Minutes.find({});
  } else {
    return Minutes.find({"_id": "none"});
  }
});
