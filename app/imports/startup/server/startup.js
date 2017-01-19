import { Meteor } from 'meteor/meteor';
import { TmpFiles } from '../../api/databet_collections/TmpFiles';

Meteor.startup(function () {
  try {
    configure_email();
    remove_tmp_files();
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