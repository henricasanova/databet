import { Meteor } from 'meteor/meteor';
import { TmpFiles } from '../../api/databet_collections/TmpFiles';
import { StudentOutcomes } from '../../api/databet_collections/StudentOutcomes';
import { OfferedCourses } from '../../api/databet_collections/OfferedCourses';
import { UploadedFiles } from '../../api/databet_collections/UploadedFiles';
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

  let ocs = OfferedCourses.find({}).fetch();
  for (let i=0; i < ocs.length; i++) {
    let syllabus_id = ocs[i].syllabus;
    if (syllabus_id === "n/a") {
      //fine, but not really
    } else {
      if (UploadedFiles.findOne({"_id": syllabus_id})) {
        // fine
      } else {
        OfferedCourses.update({"_id": ocs[i]._id}, {$set: {"syllabus": "n/a"}});
      }
    }
  }
}