import { Meteor } from 'meteor/meteor';
import { Globals } from '../../api/databet_collections/Globals';

console.log("SERVER-SIDE: ROOT_URL = ", process.env.ROOT_URL);

Meteor.startup(function () {
  try {
    configure_email();
    initialize_upload_server();
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
  console.log("====> ", process.env.MAIL_URL);
}

function initialize_upload_server() {


  var upload_root = process.env.UPLOAD_DIR;
  if (upload_root == undefined) {
    throw new Meteor.Error("UPLOAD_DIR environment variable must be defined");
  }
  //var upload_root = process.env.PWD + '/.uploads/';

  UploadServer.init({
    tmpDir: upload_root+'/tmp',
    uploadDir: upload_root,
    uploadUrl: "/upload",  // Seems to work with a custom ROOT_URL (see Client startup) - with some hacking
    checkCreateDirectories: true,
    getDirectory: function(fileInfo, formData) {
      if (formData && formData.directoryName != null) {
        return formData.directoryName;
      }
      return "";
    },
    getFileName: function(fileInfo, formData) {
      if (formData && formData.prefix != null) {
        return formData.prefix + '____' + fileInfo.name;
      }
      return fileInfo.name;
    },
    finished: function(fileInfo, formData) {
    }
  });

  // Make the assessment_uploads sub-directory
  console.log("Creating Directory "+upload_root+"/assessment_uploads/ ...");
  var Future=Npm.require("fibers/future");
  var exec=Npm.require("child_process").exec;
  var future = new Future();
  var dir = process.env.PWD;
  var command = "mkdir -p "+ upload_root + "/assessment_uploads/";
  exec(command, {cwd: dir}, function (error, stdout, stderr) {
    if (error) {
      console.log(error);
      throw new Meteor.Error(500, command + " failed");
    }
    future.return(stdout.toString());
  });
  future.wait();

}

function reset_globals() {

  // some_global  (could come in handy)
  Globals.remove({name: "some_global"});
  Globals.insert({name: "some_global", value: ""});

}
