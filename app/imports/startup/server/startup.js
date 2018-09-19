import { Meteor } from 'meteor/meteor';
import { TmpFiles } from '../../api/databet_collections/TmpFiles';
import { StudentOutcomes } from '../../api/databet_collections/StudentOutcomes';
import { OfferedCourses } from '../../api/databet_collections/OfferedCourses';
import { UploadedFiles } from '../../api/databet_collections/UploadedFiles';
import { AssessmentItems } from '../../api/databet_collections/AssessmentItems';
import { CurriculumMappings } from '../../api/databet_collections/CurriculumMappings';
import { PerformanceIndicators } from '../../api/databet_collections/PerformanceIndicators';
import { is_so_critical } from '../../api/global_helpers/student_outcome';

Meteor.startup(function () {
  try {
    fix_db_in_ad_hoc_ways();
    configure_email();
    remove_tmp_files();
    update_critical_student_outcomes();
  } catch (e) {
    throw(e);
  }
  console.log("Server running at: ", Meteor.absoluteUrl());
});


function configure_email() {
  var smtp_config = {
    username: 'icsdatabet@gmail.com',
    password: 'fg$341s351Sdw69',
    server:   'smtp.gmail.com',
    port: 465
  };

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp_config.username) + ':' + encodeURIComponent(smtp_config.password) + '@' + encodeURIComponent(smtp_config.server) + ':' + smtp_config.port;
}


function remove_tmp_files() {
  TmpFiles.remove_all();
}

function update_critical_student_outcomes() {
  let sos = StudentOutcomes.find({}).fetch();
  for (let i=0; i < sos.length; i++) {
    let doc_id = sos[i]._id;
    let critical = is_so_critical(sos[i]);
    // Will add the critical property to existing SOs in case they're "old"
    StudentOutcomes.update({"_id": doc_id}, {$set: {"critical": critical}});
  }

}

function fix_db_in_ad_hoc_ways() {

  let ocs = PerformanceIndicators.find({}).fetch();
  for (let i=0; i < ocs.length; i++) {
    let compliant = ocs[i].syllabus_compliant;
    if (compliant === undefined) {
      OfferedCourses.update({"_id": ocs[i]._id}, {$set: {"syllabus_compliant": "tbd"}});
    }
  }

  let sos = StudentOutcomes.find({}).fetch();
  for (let i=0; i < sos.length; i++) {
    if (sos[i].critical == undefined) {
      StudentOutcomes.update({"_id": sos[i]._id}, {$set: {"critical": false}});
    }
  }

  // let pis = PerformanceIndicators.find({}).fetch();
  // for (let i=0; i < pis.length; i++) {
  //   let so_id = pis[i].student_outcome;
  //   let so = StudentOutcomes.findOne({"_id": so_id});
  //   console.log(so.description);
  //   console.log("     " + pis[i].description);
  // }
  //
  // console.log("--------------------------");
  // let items = AssessmentItems.find({}).fetch();
  // for (let i=0; i < items.length; i++) {
  //  let instructor_id = items[i].instructor;
  //  let instructor = Meteor.users.findOne({"_id": instructor_id});
  //  let curriculum_mapping_id = items[i].curriculum_mapping;
  //  let curriculum_mapping = CurriculumMappings.findOne({"_id": curriculum_mapping_id});
  //  let pi_id = curriculum_mapping.performance_indicator;
  //  let pi = PerformanceIndicators.findOne({"_id" : pi_id});
  //  let so_id = pi.student_outcome;
  //  let so = StudentOutcomes.findOne({"_id": so_id});
  //  console.log(so.description);
  //  console.log("     " + pi.description);
  //  console.log("     " + instructor.name);
  // }



}
