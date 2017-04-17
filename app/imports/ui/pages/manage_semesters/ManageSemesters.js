import { Meteor } from 'meteor/meteor';
import { Semesters } from '../../../api/databet_collections/Semesters';
import { Curricula } from '../../../api/databet_collections/Curricula';
import { OfferedCourses } from '../../../api/databet_collections/OfferedCourses';
import { AssessmentItems } from '../../../api/databet_collections/AssessmentItems';
import { semesterid_to_semesterstring } from '../../../api/global_helpers/semesters';


Template.ManageSemesters.helpers({

  listOfSemesters: function() {
    return Semesters.find({}).fetch().sort(function(a,b) {
        if (a.order < b.order) {
          return 1;
        } else if (a.order > b.order) {
          return -1;
        } else {
          return 0;
        }
    });
  },

  atLeastOneSemester: function() {
    return (Semesters.findOne({}) != null);
  },

  add_semester_mode: function() {
    return Template.instance().add_semester_mode.get();
  },

  get_reference_to_reactive_var_add_semester_mode: function() {
    return Template.instance().add_semester_mode;
  }

});

Template.ManageSemesters.onCreated(function () {
  this.add_semester_mode = new ReactiveVar();
  Template.instance().add_semester_mode.set(false);
});


Template.ManageSemesters.events( {
  'click #add_semester': function(e) {
    e.preventDefault();
    Template.instance().add_semester_mode.set(true);
  }
});

Template.semesterRow.events({

  'click .delete_semester': function(e) {
    e.preventDefault();

    var semesterId = this._id;

    $('#modal_'+semesterId).
      modal({
        onDeny    : function(){
          return true;
        },
        onApprove : function() {
          $('#modal_'+semesterId).modal('hide');
	  Semesters.remove_document(semesterId);
          return true;
        }
      })
      .modal('show');

    return false;
  }
});

Template.semesterRow.helpers({

  semesterString: function() {
    return semesterid_to_semesterstring(this._id);
  },

  curriculumDescription: function() {
    const curriculum =  Curricula.findOne({"_id": this.curriculum});
    return curriculum.description;
  },

  numOfferedCourses: function() {
    const semester_id = this._id;
    return OfferedCourses.find({"semester":semester_id}).count();
  },

  num_assessment_items: function() {
    const offered_courses = OfferedCourses.find({"semester":this._id}).fetch();
    let num_assessment_items = 0;
    for (let i=0; i < offered_courses.length; i++) {
      num_assessment_items += AssessmentItems.find({"offered_course": offered_courses[i]._id}).count();
    }
    return num_assessment_items;
  }
});
