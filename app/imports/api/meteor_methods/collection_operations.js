// These are brute-force with redundancy (i.e, some calls will
// find everything removed already. But at least there is no
// infinite recursion :)

import '../../api/databet_collections';
import { collection_dictionary } from '../../startup/both/collection_dictionary';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

Meteor.methods({

  insert_document_into_collection: function (collection_name, doc) {
    const collection = collection_dictionary[collection_name];
    if (collection == null) {
      throw new Meteor.Error("Unknown Collection " + collection_name);
    }
    const id = collection.insert(doc);
    console.log("Inserted new document ", id, " into collection", collection_name);
  },

  update_document_in_collection: function (collection_name, doc_id, modifier) {
    const collection = collection_dictionary[collection_name];
    if (collection == null) {
      throw new Meteor.Error("Unknown Collection " + collection_name);
    }
    console.log("Updating document", doc_id, "in collection", collection_name, "modifier = ", modifier);
    collection.update({"_id": doc_id}, {$set: modifier});
  },

  remove_document_from_collection: function (collection_name, doc_id) {
    const collection = collection_dictionary[collection_name];
    if (collection == null) {
      throw new Meteor.Error("Unknown Collection " + collection_name);
    }
    collection.remove({"_id": doc_id});
  }
});
