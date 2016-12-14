// These are brute-force with redundancy (i.e, some calls will
// find everything removed already. But at least there is no
// infinite recursion :)

import '../../api/databet_collections';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';


Meteor.methods({

  send_email: function (options) {
    if (Meteor.isServer) {
      Email.send(options);
    }
  },

});

