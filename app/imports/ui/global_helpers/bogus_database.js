import {_} from "meteor/underscore";
import {Curricula} from "../../api/databet_collections/Curricula";
import {Courses} from "../../api/databet_collections/Courses";
import {StudentOutcomes} from "../../api/databet_collections/StudentOutcomes";
import {PerformanceIndicators} from "../../api/databet_collections/PerformanceIndicators";
import {CurriculumMappings} from "../../api/databet_collections/CurriculumMappings";
import {Semesters} from "../../api/databet_collections/Semesters";
import {OfferedCourses} from "../../api/databet_collections/OfferedCourses";
import {AssessmentItems} from "../../api/databet_collections/AssessmentItems";

var curriculum_id = "BogusCurriculum";
var curriculum_description = "Bogus curriculum for testing purposes";
var num_courses = 12;
var max_num_courses_per_pi = 8;
var num_sos = 8;
var num_semesters = 10;
var min_num_offered_courses_per_semester = Math.trunc(num_courses/4);
var max_num_offered_courses_per_semester = num_courses;
var num_assessment_items_per_semesters = 40;

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

  var doc = {
    "_id": curriculum_id,
    "description": curriculum_description,
    "date_created": new Date(),
    "locked": false
  };
  Curricula.insert_document(doc);
}

function create_bogus_courses() {
  for (var i = 0; i < num_courses; i++) {
    var course_id = "BogusCourse_" + i;

    var doc = {
      _id: course_id,
      alphanumeric: "ICS " + ((100 + 100 * (i / 2) + (i % 3)) % 499),
      title: Fake.sentence(),
      curriculum: curriculum_id
    };
    Courses.insert_document(doc);
  }
}

function create_bogus_sos_and_pis() {
  for (var i = 0; i < num_sos; i++) {
    var so_id = "BogusStudentOutcome_" + i;

    var doc = {
      _id: so_id,
      description: Fake.sentence(15),
      order: i,
      curriculum: curriculum_id
    };
    StudentOutcomes.insert_document(doc);
    create_bogus_pis(so_id);
  }

}

function create_bogus_pis(so_id) {
  var num_pis = Math.trunc(Random.fraction() * 4) + 1;
  for (var i = 0; i < num_pis; i++) {
    var pi_id = "BogusPerformanceIndicator_" + so_id + "_" + i;

    var doc = {
      _id: pi_id,
      description: Fake.sentence(20),
      order: i,
      student_outcome: so_id
    };
    PerformanceIndicators.insert_document(doc);
  }
}

function create_bogus_curriculum_map() {
  var list_of_courses = Courses.find({curriculum: curriculum_id}).fetch();
  var list_of_sos = StudentOutcomes.find({curriculum: curriculum_id}).fetch();

  // console.log("CURRICULUM MAP", list_of_sos);
  var count = 0;
  for (var i = 0; i < list_of_sos.length; i++) {
    var pis = PerformanceIndicators.find({student_outcome: list_of_sos[i]._id}).fetch();
    for (var j = 0; j < pis.length; j++) {
      var num_courses_for_pi = Math.trunc(1 + Random.fraction() * max_num_courses_per_pi);
      for (var k=0; k < num_courses_for_pi; k++) {
        var course = Random.choice(list_of_courses);
        var level = "elementary";
        if (Random.fraction() < 0.5) {
          level = "proficient";
        }
        var doc = {
          _id: "BogusCurriculumMapping_" + count,
          curriculum: curriculum_id,
          course: course._id,
          performance_indicator: Random.choice(pis)._id,
          level: level
        };

        CurriculumMappings.insert_document(doc);
        count++;
      }
    }
  }
}

function create_bogus_semesters() {
  var count = 0;
  var sessions = ["Spring", "Fall", "Summer"];
  var session = 0;
  while (count < num_semesters) {

    var year = 2020 + Math.trunc(count/2);
    var order = 10 * Number(year);
    if (sessions[session] == "Spring") {
      order += 1;
    } else if (sessions[session] == "Summer") {
      order += 2;
    } else {
      order += 3;
    }

    var doc = {
      _id: "BogusSemester_"+count,
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
  var list_of_semesters = Semesters.find({curriculum: curriculum_id}).fetch();
  var list_of_courses = Courses.find({curriculum: curriculum_id}).fetch();

  var count = 0;
  for (var i=0; i < list_of_semesters.length; i++) {
    var num_offered_courses = min_num_offered_courses_per_semester +
      Math.trunc( + Random.fraction() *
        (max_num_offered_courses_per_semester - min_num_offered_courses_per_semester));
    for (var j=0;  j < num_offered_courses; j++) {
      var course = Random.choice(list_of_courses);
      var doc = {
        _id: "BogusOfferedCourse_" + count,
        course: course._id,
        semester: list_of_semesters[i]._id,
        instructor: Meteor.userId(),
        archived: false
      };
      OfferedCourses.insert_document(doc);
      count++;
    }
  }
}

function create_bogus_assessment_items() {

  var list_of_semesters = Semesters.find({curriculum: curriculum_id}).fetch();
  var count=0;
  for (var i=0; i < list_of_semesters.length; i++) {
    var list_of_offered_courses = OfferedCourses.find(
      {semester: list_of_semesters[i]._id}).fetch();
    for (var j=0; j < num_assessment_items_per_semesters; j++) {
      var offered_course = Random.choice(list_of_offered_courses);
      var curriculum_mapping = Random.choice(CurriculumMappings.find({"curriculum": curriculum_id}).fetch());
      var doc = {
        _id: "BogusAssessmentItem_" + count,
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















