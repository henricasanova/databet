import {_} from "meteor/underscore";
import {Curricula} from "../databet_collections/Curricula";
import {Courses} from "../databet_collections/Courses";
import {StudentOutcomes} from "../databet_collections/StudentOutcomes";
import {PerformanceIndicators} from "../databet_collections/PerformanceIndicators";
import {CurriculumMappings} from "../databet_collections/CurriculumMappings";
import {Semesters} from "../databet_collections/Semesters";
import {OfferedCourses} from "../databet_collections/OfferedCourses";
import {AssessmentItems} from "../databet_collections/AssessmentItems";

const curriculum_id = "BogusCurriculum";
const curriculum_description = "Bogus curriculum for testing purposes";
const num_courses = 10;
const max_num_courses_per_pi = 2;
const num_sos = 4;
const num_semesters = 10;
const min_num_offered_courses_per_semester = Math.trunc(num_courses/4);
const max_num_offered_courses_per_semester = num_courses;
const num_assessment_items_per_semesters = 20;

export function insert_bogus_database() {

  create_bogus_curriculum();
  create_bogus_courses();
  create_bogus_sos_and_pis();
  create_bogus_curriculum_map();
  create_bogus_semesters();
  create_bogus_offered_courses();
  create_bogus_assessment_items();
}

function create_bogus_curriculum() {

  if (Curricula.find_document(curriculum_id)) {
    console.log("Bogus curriculum already in DB... erasing it first");
    Curricula.remove_document(curriculum_id);
  }

  const doc = {
    "_id": curriculum_id,
    "description": curriculum_description,
    "date_created": new Date(),
    "locked": false
  };
  Curricula.insert_document(doc);
}

function create_bogus_courses() {
  for (let i = 0; i < num_courses; i++) {
    const course_id = "BogusCourse" + i;

    const doc = {
      _id: course_id,
      alphanumeric: "ICS " + ((100 + 100 * (i / 2) + (i % 3)) % 499),
      title: Fake.sentence(),
      curriculum: curriculum_id
    };
    Courses.insert_document(doc);
  }
}


function create_bogus_sos_and_pis() {
  for (let i = 0; i < num_sos; i++) {
    const so_id = "BogusStudentOutcome" + i;

    const doc = {
      _id: so_id,
      description: Fake.sentence(15),
      order: i,
      critical: false,
      curriculum: curriculum_id
    };
    StudentOutcomes.insert_document(doc);
    create_bogus_pis(so_id);
  }

}

function create_bogus_pis(so_id) {
  const num_pis = Math.trunc(Random.fraction() * 4) + 1;
  for (let i = 0; i < num_pis; i++) {
    const pi_id = "BogusPerformanceIndicator" + so_id + "" + i;

    const doc = {
      _id: pi_id,
      description: Fake.sentence(20),
      order: i,
      student_outcome: so_id
    };
    PerformanceIndicators.insert_document(doc);
  }
}

function create_bogus_curriculum_map() {
  const list_of_courses = Courses.find({curriculum: curriculum_id}).fetch();
  const list_of_sos = StudentOutcomes.find({curriculum: curriculum_id}).fetch();

  // console.log("CURRICULUM MAP", list_of_sos);
  let count = 0;
  for (let i = 0; i < list_of_sos.length; i++) {
    const pis = PerformanceIndicators.find({student_outcome: list_of_sos[i]._id}).fetch();
    for (let j = 0; j < pis.length; j++) {
      const num_courses_for_pi = Math.trunc(1 + Random.fraction() * max_num_courses_per_pi);
      for (let k=0; k < num_courses_for_pi; k++) {
        while (true) {
          const course = Random.choice(list_of_courses);
          const performance_indicator = Random.choice(pis)._id;
          let level = "elementary";
          if (Random.fraction() < 0.5) {
            level = "proficient";
          }

          if (!CurriculumMappings.findOne({
              curriculum: curriculum_id,
              course: course._id,
              performance_indicator: performance_indicator,
              level: level
            })) {
            const doc = {
              _id: "BogusCurriculumMapping" + count,
              curriculum: curriculum_id,
              course: course._id,
              performance_indicator: performance_indicator,
              level: level
            };

            CurriculumMappings.insert_document(doc);
            count++;
            break;
          }
        }
      }
    }
  }
}

function create_bogus_semesters() {
  let count = 0;
  const sessions = ["Spring", "Fall", "Summer"];
  let session = 0;
  while (count < num_semesters) {

    const year = 2013 + Math.trunc(count/2);
    let order = 10 * Number(year);
    if (sessions[session] == "Spring") {
      order += 1;
    } else if (sessions[session] == "Summer") {
      order += 2;
    } else {
      order += 3;
    }

    const doc = {
      _id: "BogusSemester"+count,
      session: sessions[session],
      year: year,
      order: order,
      curriculum: curriculum_id,
      locked: false
    };

    Semesters.insert_document(doc);
    session = 1 - session;
    count++;
  }
}

function create_bogus_offered_courses() {
  const list_of_semesters = Semesters.find({curriculum: curriculum_id}).fetch();
  const list_of_courses = Courses.find({curriculum: curriculum_id}).fetch();

  let count = 0;
  for (let i = 0; i < list_of_semesters.length; i++) {
    const num_offered_courses = min_num_offered_courses_per_semester +
      Math.trunc(+Random.fraction() *
        (max_num_offered_courses_per_semester - min_num_offered_courses_per_semester));
    for (let j = 0; j < num_offered_courses; j++) {
      while (true) {
        const course = Random.choice(list_of_courses);
        const user = Random.choice(Meteor.users.find({}).fetch())._id;

        if (!OfferedCourses.findOne({
            course: course._id,
            semester: list_of_semesters[i]._id,
            instructor: user
          })) {
          const doc = {
            _id: "BogusOfferedCourse" + count,
            course: course._id,
            semester: list_of_semesters[i]._id,
            instructor: user,
            archived: false
          };
          OfferedCourses.insert_document(doc);
          count++;
          break;
        }
      }
    }
  }
}

function create_bogus_assessment_items() {

  const list_of_semesters = Semesters.find({curriculum: curriculum_id}).fetch();
  let count=0;
  for (let i=0; i < list_of_semesters.length; i++) {
    const list_of_offered_courses = OfferedCourses.find(
      {semester: list_of_semesters[i]._id}).fetch();
    for (let j=0; j < num_assessment_items_per_semesters; j++) {
      const offered_course = Random.choice(list_of_offered_courses);
      const curriculum_mapping = Random.choice(CurriculumMappings.find({"curriculum": curriculum_id}).fetch());
      const doc = {
        _id: "BogusAssessmentItem" + count,
        instructor: offered_course.instructor,
        offered_course: offered_course._id,
        curriculum_mapping: curriculum_mapping._id,
        date_last_modified: new Date(),
        assessment_type: Fake.sentence(10),
        assessment_question_is_file: false,
        assessment_question_text: Fake.sentence(150),
        assessment_question_file: "",
        grades: Fake.sentence(100),
        max_grade: 100,
        comments: Fake.sentence(100),
        sample_poor_answer_is_file: false,
        sample_medium_answer_is_file: false,
        sample_good_answer_is_file: false,
        sample_poor_answer_file: "",
        sample_medium_answer_file: "",
        sample_good_answer_file: "",
        sample_poor_answer_text: Fake.sentence(200),
        sample_medium_answer_text: Fake.sentence(200),
        sample_good_answer_text: Fake.sentence(200)
      };

      AssessmentItems.insert_document(doc);
      count++;
    }
  }
}















