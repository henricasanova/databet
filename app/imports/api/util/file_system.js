/**
 * Created by casanova on 12/8/16.
 */

export function fs_move_file_path(old_path, new_path) {

  var Future = Npm.require("fibers/future");
  var exec = Npm.require("child_process").exec;
  var future = new Future();
  var dir = process.env.PWD;
  var command = "mv " + old_path + " " + new_path;
  //noinspection JSUnusedLocalSymbols
  exec(command, {cwd: dir}, function (error, stdout, stderr) {
    if (error) {
      console.log(error);
      throw new Meteor.Error(500, command + " failed");
    }
    console.log("Moved file ", old_path," to new location ", new_path);
    future.return(stdout.toString());
  });
  future.wait();
}

export function fs_create_dir(path) {
  console.log("Creating Directory " + path);
  var Future = Npm.require("fibers/future");
  var exec = Npm.require("child_process").exec;
  var future = new Future();
  var dir = process.env.PWD;
  var command = "mkdir -p " + path;
//noinspection JSUnusedLocalSymbols
  exec(command, {cwd: dir}, function (error, stdout, stderr) {
    if (error) {
      console.log(error);
      throw new Meteor.Error(500, command + " failed");
    }
    console.log("Created directory ", path);
    future.return(stdout.toString());
  });
  future.wait();
}