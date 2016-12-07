import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Curricula } from '../../../../api/databet_collections/Curricula';
import { Courses } from '../../../../api/databet_collections/Courses';
import { OfferedCourses } from '../../../../api/databet_collections/OfferedCourses';
import { AssessmentItems } from '../../../../api/databet_collections/AssessmentItems';
import { trim_date } from '../../../../ui/global_template_helpers/trim_date';

Template.ManageCurricula.helpers({

  listOfCurricula: function () {
    return Curricula.find({}).fetch();
  },

  atLeastOneCurriculum: function () {
    return (Curricula.findOne({}) != null);
  },

  add_curriculum_mode: function () {
    return Template.instance().add_curriculum_mode.get();
  },

  get_reference_to_reactive_var_add_curriculum_mode: function () {
    return Template.instance().add_curriculum_mode;
  }

});

Template.ManageCurricula.onCreated(function () {
  this.add_curriculum_mode = new ReactiveVar();
  Template.instance().add_curriculum_mode.set(false);
});


Template.ManageCurricula.events({
  'click #add_curriculum_button': function () {
    Template.instance().add_curriculum_mode.set(true);
  }
});

Template.curriculumRow.events({

  'click .delete_curriculum': function (e) {
    e.preventDefault();

    var curriculumId = this._id;

    $('#modal_' + curriculumId).modal({
      onDeny: function () {
        return true;
      },
      onApprove: function () {
        $('#modal_' + curriculumId).modal('hide');
        Meteor.call("delete_from_collection", "Curricula", curriculumId);
        return true;
      }
    }).modal('show');

    return false;
  },

});

Template.curriculumRow.helpers({

  dateCreated: function () {
    return trim_date(this.date_created);
  },

  curriculumDescription: function () {
    return this.description;
  },

  num_courses: function () {
    return Courses.find({"curriculum": this._id}).count();
  },

  num_offered_courses: function () {
    var courses = Courses.find({"curriculum": this._id}).fetch();
    var num_offered_courses = 0;
    for (var i = 0; i < courses.length; i++) {
      num_offered_courses += OfferedCourses.find({"course": courses[i]._id}).count();

    }
    return num_offered_courses;
  },

  num_assessment_items: function () {
    var courses = Courses.find({"curriculum": this._id}).fetch();
    var num_assessment_items = 0;
    for (var i = 0; i < courses.length; i++) {
      var offered_courses = OfferedCourses.find({"course": courses[i]._id}).count();
      for (var j = 0; j < offered_courses.length; j++) {
        num_assessment_items += AssessmentItems.find({"offered_course": offered_courses[j]._id}).count();
      }
    }
    return num_assessment_items;
  },

});
