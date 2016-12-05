Template.ManageSemesters.helpers({

  listOfSemesters: function() {
    return Semesters.find({}, {sort: {order: -1}});
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

  'click .manage_delete_semester': function(e) {
    e.preventDefault();

    var semesterId = this._id;

    $('#modal_'+semesterId).
      modal({
        onDeny    : function(){
          return true;
        },
        onApprove : function() {
          $('#modal_'+semesterId).modal('hide');
          Meteor.call("delete_from_collection", "Semesters", semesterId);
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
    var curriculum =  Curricula.findOne({"_id": this.curriculum});
    return curriculum.description;
  },

  numOfferedCourses: function() {
    var semester_id = this._id;
    return OfferedCourses.find({"semester":semester_id}).count();
  },

  num_assessment_items: function() {
    var offered_courses = OfferedCourses.find({"semester":this._id}).fetch();
    var num_assessment_items = 0;
    for (var i=0; i < offered_courses.length; i++) {
      num_assessment_items += AssessmentItems.find({"offered_course": offered_courses[i]._id}).count();
    }
    return num_assessment_items;
  }


});
