import { Template } from 'meteor/templating';
import { Semesters } from '../../../api/databet_collections/Semesters';
import { Curricula } from '../../../api/databet_collections/Curricula';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

Template.ManageAddSemester.onRendered(
  function() {
  }
);

Template.AddSemester.onCreated( function() {

  this.missing_year = new ReactiveVar();
  this.missing_session = new ReactiveVar();
  this.missing_curriculum = new ReactiveVar();
  this.already_exists = new ReactiveVar();

  Template.instance().missing_year.set(false);
  Template.instance().missing_session.set(false);
  Template.instance().missing_curriculum.set(false);
  Template.instance().already_exists.set(false);

});

Template.AddSemester.events({

  'click .cancel': function(e) {
    e.preventDefault();
    Template.currentData().set_to_false_when_done.set(false);
    return false;
  },

  'change #year': function(e) {
    Template.instance().missing_year.set(false);
    Template.instance().already_exists.set(false);
  },

  'change #session': function(e) {
    Template.instance().missing_session.set(false);
    Template.instance().already_exists.set(false);
  },

  'change #curriculum': function(e) {
    Template.instance().missing_curriculum.set(false);
    Template.instance().already_exists.set(false);
  },

  'click .submit': function(e) {
    e.preventDefault();

    var year = $('#year').val();
    var session = $('#session').val();
    var curriculum = $('#curriculum').val();

    //console.log("YEAR=", year);
    //console.log("SESSION=", session);
    //console.log("CURRICULM=", curriculum);

    if (!year) {
      Template.instance().missing_year.set(true);
    }
    if (!session) {
      Template.instance().missing_session.set(true);
    }
    if (!curriculum) {
      Template.instance().missing_curriculum.set(true);
    }

    if (!year || !session || !curriculum) {
      return false;
    }

    if (Semesters.findOne({"year": Number(year), "session": session})) {
      Template.instance().already_exists.set(true);
      return false;
    }

    var order = 10 * Number(year);
    if (session == "Spring") {
      order += 1;
    } else if (session == "Summer") {
      order += 2;
    } else {
      order += 3;
    }

    var semester = {
      "year": Number(year),
      "session": session,
      "curriculum": curriculum,
      "locked": false,
      "order": order
    };

    Meteor.call("insert_into_collection", "Semesters", semester);

    Template.currentData().set_to_false_when_done.set(false);

    return false;
  }

});

Template.AddSemester.helpers({

  missing_year: function() {
    return Template.instance().missing_year.get();
  },

  missing_session: function() {
    return Template.instance().missing_session.get();
  },

  missing_curriculum: function() {
    return Template.instance().missing_curriculum.get();
  },

  already_exists: function() {
    return Template.instance().already_exists.get();
  },

  year_range: function() {
    return _.range(2016, 2040);
  },

  curricula_not_empty: function() {
    return (Curricula.find({}).count() > 0);
  },

  curricula: function() {
    return Curricula.find({}).fetch();
  }

});
