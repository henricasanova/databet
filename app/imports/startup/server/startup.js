import { Meteor } from 'meteor/meteor';
import { Globals } from '../../api/databet_collections/Globals';

console.log("SERVER-SIDE: ROOT_URL = ", process.env.ROOT_URL);

Meteor.startup(function () {
  try {
    configure_email();
    reset_globals();
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


function reset_globals() {

  // some_global  (could come in handy)
  Globals.remove({name: "some_global"});
  Globals.insert({name: "some_global", value: ""});
}
