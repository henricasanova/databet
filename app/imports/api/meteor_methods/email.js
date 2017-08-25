

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

