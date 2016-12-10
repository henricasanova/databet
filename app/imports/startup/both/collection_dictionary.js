// These are brute-force with redundancy (i.e, some calls will
// find everything removed already. But at least there is no
// infinite recursion :)

import { AssessmentItems } from '../../api/databet_collections/AssessmentItems';
import { Courses } from '../../api/databet_collections/Courses';
import { Curricula } from '../../api/databet_collections/Curricula';
import { CurriculumMappings } from '../../api/databet_collections/CurriculumMappings';
import { OfferedCourses } from '../../api/databet_collections/OfferedCourses';
import { PerformanceIndicators } from '../../api/databet_collections/PerformanceIndicators';
import { Semesters } from '../../api/databet_collections/Semesters';
import { StudentOutcomes } from '../../api/databet_collections/StudentOutcomes';

import { UploadedFiles } from '../../api/databet_collections/UploadedFiles';
import { MeteorUsers } from '../../api/databet_collections/MeteorUsers';

export var collection_dictionary = {};
collection_dictionary["AssessmentItems"] = AssessmentItems;
collection_dictionary["Courses"] = Courses;
collection_dictionary["Curricula"] = Curricula;
collection_dictionary["CurriculumMappings"] = CurriculumMappings;
collection_dictionary["OfferedCourses"] = OfferedCourses;
collection_dictionary["PerformanceIndicators"] = PerformanceIndicators;
collection_dictionary["Semesters"] = Semesters;
collection_dictionary["StudentOutcomes"] = StudentOutcomes;
collection_dictionary["UploadedFiles"] = UploadedFiles;
collection_dictionary["MeteorUsers"] = MeteorUsers;


