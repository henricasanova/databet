/* Wrappers around the get/set global helpers */
import { get_global, set_global } from './/set_get_globals';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { OfferedCourses } from '../databet_collections/OfferedCourses';

export var get_current_user = function () {
  //console.log("Meteor.user=", Meteor.users.findOne({_id: get_global("currentUserId")}));
  return get_global("currentUserId");
};

export var get_current_username = function () {
  var userId = get_global("currentUserId");
  return userid_to_username(userId);
};

export var set_current_user = function (id) {
  set_global("currentUserId", id);
};


export var userid_to_username = function (userId) {
  var user = Meteor.users.findOne({_id: userId});

  // CAS user
  if (user && user.services && ("cas" in user.services)) {
    return user.services.cas.id;
  }

  // Preset user
  if (user && user.services && ("password" in user.services) &&
    (user.emails) && (user.emails[0])) {
    return user.emails[0].address;
  }

  return "unknownuser";
};



// Have to do this here because I can $!@#!@# Wrap Meteor.users in my own collection
export function remove_user(userId) {

  // Remove offered courses
  var offered_courses = OfferedCourses.find({instructor: userId}).fetch();
  for (var i=0; i < offered_courses.length; i++) {
    OfferedCourses.remove_document(offered_courses[i]._id);
  }
  Meteor.call("remove_document_from_collection", "Meteor.users", userId);
}

export function create_user(doc) {
  Meteor.call("insert_document_into_collection", "Meteor.users", user);
}

export function update_user(docId, modifier) {
  Meteor.call("update_document_in_collection", "Meteor.users", userId, modifier);
}




// var username_to_userid = function (username) {
//
//   var all_users = Meteor.users.find().fetch();
//   var userId = null;
//   var name = username;
//
//   _.forEach(all_users, function (doc) {
//     if (doc.services && ("cas" in doc.services) && (doc.services.cas.id == name)) {
//       userId = doc._id;
//     } else if (doc.services && ("password" in doc.services) && (doc.emails) && (doc.emails[0]) &&
//       (doc.emails[0].address == name)) {
//       userId = doc._id;
//     }
//   });
//   return userId;  // Could return null
// };


