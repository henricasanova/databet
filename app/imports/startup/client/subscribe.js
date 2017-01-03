import { Meteor } from 'meteor/meteor';


// Subscribe to collections: TODO stop getting everything!
Meteor.subscribe("Meteor.users");
Meteor.subscribe("Semesters");
Meteor.subscribe("Curricula");
Meteor.subscribe("StudentOutcomes");
Meteor.subscribe("PerformanceIndicators");
Meteor.subscribe("Courses");
Meteor.subscribe("CurriculumMappings");
Meteor.subscribe("OfferedCourses");
Meteor.subscribe("AssessmentItems");
Meteor.subscribe("UploadedFiles");