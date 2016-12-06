// These are brute-force with redundancy (i.e, some calls will
// find everything removed already. But at least there is no
// infinite recursion :)

import '../../api/databet_collections';

export var collection_dictionary = {};
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

