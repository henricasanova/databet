/**
 * Created by casanova on 3/14/17.
 */
import { StudentOutcomes } from '../../api/databet_collections/StudentOutcomes';
import { AssessmentItems } from '../../api/databet_collections/AssessmentItems';
import { CurriculumMappings } from '../../api/databet_collections/CurriculumMappings';
import { PerformanceIndicators } from '../../api/databet_collections/PerformanceIndicators';
import { OfferedCourses } from '../../api/databet_collections/OfferedCourses';
import { Semesters } from '../../api/databet_collections/Semesters';
import {get_session_for_date} from "./semesters";

export function is_so_critical(student_outcome) {
  // TODO: Test

  // Find ALL Assessment Items for the SO (over multiple curricula!!)
  const so_description = student_outcome.description;
  const sos = StudentOutcomes.find({}).fetch();

  let num_assessments = 0;
  for (let i=0; i < sos.length; i++) {
    const so = sos[i];
    if (so.description === so_description) {
      // console.log("Found an SO with this same description");
      num_assessments += num_assessments_in_last_semesters(so._id, 6);
    }
  }

  const return_value = (num_assessments < 2);

  if (return_value) {
    console.log("Determined that  student outcome with description \"", so_description, "\" is critical");
  }

  return return_value;
}

function num_assessments_in_last_semesters(so_id, num_semesters) {
  const assessments = AssessmentItems.find({}).fetch();

  // This is cumbersome/slow because we don't have a so foreign key in assessment_item
 let  num_assessments = 0;
  for (let i=0; i < assessments.length; i++) {
    if (is_assessment_in_last_semesters(assessments[i], num_semesters)) {
      const curriculum_mapping = CurriculumMappings.findOne({"_id": assessments[i].curriculum_mapping});
      const performance_indicator = PerformanceIndicators.findOne({"_id": curriculum_mapping.performance_indicator});
      const so = StudentOutcomes.findOne({"_id": performance_indicator.student_outcome});
      if (so._id == so_id) {
        num_assessments++;
      }
    }
  }
  return num_assessments;
}

function is_assessment_in_last_semesters(assessment, num_semesters) {
  // find the offered_course of the assessment
  const offered_course = OfferedCourses.findOne({"_id": assessment.offered_course});
  // find the semester
  const semester_id = offered_course.semester;
  const semester = Semesters.findOne({"_id": semester_id});
  // Get the session and the year
  const assessment_session = semester.session;
  const assessment_year = semester.year;

  // Get the current year and semester
  const current_year = new Date().getFullYear();
  const current_session = get_session_for_date(new Date());

  // Check sessions going backward for the specified number of semesters
  const session_strings = ["Fall", "Summer", "Spring"];
  let session_index = session_strings.indexOf(current_session);
  let year = current_year;
  for (let i=num_semesters; i >= 0; i--) {
    session_index -= 1;
    if (session_index < 0) {
      session_index = session_strings.length-1;
      year -= 1;
    }
    // console.log("Is the assessment (",assessment_session, ",", assessment_year," in Semester ", session_strings[session_index], year, "?");
    if ((year == assessment_year) && (session_strings[session_index] == assessment_session)) {
      // console.log("YES");
      return true;
    }
  }

  // console.log("NO");
  return false;
}