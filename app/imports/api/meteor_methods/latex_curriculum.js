// These are brute-force with redundancy (i.e, some calls will
// find everything removed already. But at least there is no
// infinite recursion :)

import '../../api/databet_collections';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';


Meteor.methods({

  latex_curriculum: function(curriculum_id) {
    console.log("SHOULD LATEX ", curriculum_id);
    return ["Bogus id", "http://bogus" ];
  }

});

