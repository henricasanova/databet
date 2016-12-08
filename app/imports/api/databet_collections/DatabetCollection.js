import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';


export class DatabetCollection extends Mongo.Collection {

  insert_document(doc, callback) {
    console.log("Inserting in ", this._name);
    if (Meteor.isClient) {
      Meteor.call("insert_document_into_collection", this._name, doc, callback);
    } else {
      super.insert(doc);
    }
  }

  update_document(doc_id, modifier, callback) {
    console.log("Updating in ", this._name);

    if (Meteor.isClient) {
      Meteor.call("update_document_in_collection", this._name, doc_id, modifier, callback);
    } else {
      super.update({"_id": doc_id}, {$set: modifier});
    }
  }

  remove_document(doc_id, callback) {
    console.log("Removing in ", this._name);

    if (Meteor.isClient) {
      Meteor.call("remove_document_from_collection", this._name, doc_id, callback);
    } else {
      super.remove({"_id": doc_id});
    }
  }

  get_selected_doc_ids(selector) {
    var docs = super.find(selector).fetch();
    return _.map(docs, function(e) { return e._id; });
  }
}


