import { Meteor } from 'meteor/meteor';
import { Minutes } from '../../../api/databet_collections/Minutes';



Template.Minutes.onCreated(function () {
  this.add_minutes_mode = new ReactiveVar();
  this.update_minutes_mode = new ReactiveVar();
  Template.instance().add_minutes_mode.set(false);
  Template.instance().update_minutes_mode.set(false);
});


Template.Minutes.helpers({

  listOfMinutes: function() {
    const list =  Minutes.find({}).fetch().sort(function(a,b) {
      if (a.date < b.date) {
        return 1;
      } else if (a.date > b.date) {
        return -1;
      } else {
        return 0;
      }
    });
    return list;
  },

  add_minutes_mode: function() {
    return Template.instance().add_minutes_mode.get();
  },

  get_reference_to_reactive_var_add_minutes_mode: function() {
    return Template.instance().add_minutes_mode;
  },

  update_minutes_mode: function() {
    return Template.instance().update_minutes_mode.get();
  },

  get_reference_to_reactive_var_update_minutes_mode: function() {
    return Template.instance().update_minutes_mode;
  },


  atLeastOneMinutes: function() {
    return (Minutes.findOne({}) != null);
  },

});


Template.Minutes.events( {
  'click #add_minutes': function(e) {
    e.preventDefault();
    Template.instance().add_minutes_mode.set(true);
  },
});






Template.MinutesRow.onCreated(function() {

  this.update_mode = new ReactiveVar();
  Template.instance().update_mode.set(false);


});


Template.MinutesRow.helpers({

  get_reference_to_reactive_var_update_minutes_mode: function() {
    return Template.instance().update_mode;
  },

  update_minutes_mode: function() {
    return Template.instance().update_mode.get();
  },

  short_date: function() {
    return (Template.currentData().minutes.date.getMonth() + 1) + "/" +
      (Template.currentData().minutes.date.getDate() + 0) + "/" +
      Template.currentData().minutes.date.getFullYear();
  },

  minutes_type: function() {
    return Template.currentData().minutes.type;
  },

});


Template.MinutesRow.events({

  'click .delete_minutes': function(e) {
    e.preventDefault();

    const minuteId = this._id;

    $('#modal_'+minuteId).
    modal({
      onDeny    : function(){
        return true;
      },
      onApprove : function() {
        $('#modal_'+minuteId).modal('hide');
        Minutes.remove_document(minuteId);
        return true;
      }
    })
      .modal('show');

    return false;
  },

  'click .update_minutes': function(e) {
    Template.instance().update_mode.set(true);
    return false;
  },


});
