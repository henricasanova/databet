// import { Meteor } from 'meteor/meteor';
//
// class MeteorUsersCollection {
//
//   constructor(config) {
//     this._name = "MeteorUsers";
//   }
//
//   export_to_JSON() {
//     return "[ ]"; // does nothing
//   }
//
//   check_JSON_against_schema(doclist) {
//     // do nothing
//   }
//
//   import_from_JSON(doclist, update_existing) {
//     // do nothing
//   }
//
//
//   find_document(doc_id) {
//     return Meteor.users.find({_id: doc_id});
//   }
//
//   insert_document(doc, callback) {
//     if (Meteor.isClient) {
//       console.log("Inserting in ", this._name);
//       Meteor.call("insert_document_into_collection", this._name, doc, callback);
//     }
//   }
//
//   update_document(doc_id, modifier, callback) {
//
//     if (Meteor.isClient) {
//       console.log("Updating ", doc_id," in ", this._name);
//       Meteor.call("update_document_in_collection", this._name, doc_id, modifier, callback);
//     }
//   }
//
//   remove_document(doc_id, callback) {
//
//     if (Meteor.isClient) {
//       console.log("Removing ", doc_id," in ", this._name);
//       Meteor.call("remove_document_from_collection", this._name, doc_id, callback);
//     }
//   }
//
//   find(selector) {
//     return Meteor.users.find(selector);
//   }
//
//   findOne(selector) {
//     return Meteor.users.findOne(selector);
//   }
//
//   insert(doc) {
//     if (Meteor.isServer || Meteor.isClient) {
//       console.log("SERVER CALLING Meteor.users.insert()");
//       return Meteor.users.insert(doc);
//     }
//   }
//
//   update(doc_id, modifier) {
//     return Meteor.users.update({"_id": doc_id}, {$set: modifier});
//   }
//
//   remove(doc_id) {
//     console.log("In my own remove(), calling Meteor.users.remove({}) on ", doc_id);
//     // FUCK THIS: IT DOESN'T WORK WITH A SELECTOR
//     var x =  Meteor.users.remove(doc_id, function(e) { console.log("FUCK CALLBACKS", e);});
//     console.log("RETURNED: ", x);
//     return x;
//   }
//
// }
//
// export var MeteorUsers = new MeteorUsersCollection();
//
//
//
