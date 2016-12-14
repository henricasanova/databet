import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { generic_docs_to_JSON } from '../../ui/global_helpers/collection_to_json';
import { generic_import_docs_from_JSON } from '../../ui/global_helpers/collection_to_json';


export class DatabetCollection extends Mongo.Collection {

  insert_document(doc, callback) {
    if (Meteor.isClient) {
      // console.log("Inserting in ", this._name);
      Meteor.call("insert_document_into_collection", this._name, doc, callback);
    }
  }

  update_document(doc_id, modifier, callback) {

    if (Meteor.isClient) {
      // console.log("Updating ", doc_id," in ", this._name);
      Meteor.call("update_document_in_collection", this._name, doc_id, modifier, callback);
    }
  }

  remove_document(doc_id, callback) {

    if (Meteor.isClient) {
      // console.log("Removing ", doc_id," in ", this._name);
      Meteor.call("remove_document_from_collection", this._name, doc_id, callback);
    }
  }

  find_document(doc_id) {
    return super.findOne({_id: doc_id});
  }

  find(selector) {
    return super.find(selector);
  }

  findOne(selector) {
    return super.findOne(selector);
  }

  get_selected_doc_ids(selector) {
    var docs = super.find(selector).fetch();
    return _.map(docs, function (e) {
      return e._id;
    });
  }

  export_to_JSON() {

    return generic_docs_to_JSON(super.find({}));

  }

  check_JSON_against_schema(doclist, schema) {

    var error_message = "";
    var k;
    for (k = 0; k < doclist.length; k++) {
      try {
        // check against schema
        if (schema) {
          this.check_doc_against_schema(doclist[k], schema);
        }
      } catch (e) {
        error_message += "Document #" + k + ":\n\t";
        error_message += e.toString() + "<br>\n";
      }
    }
    if (error_message != "") {
      throw {
        name: "Errors for collection " + this._name,
        message: error_message,
        toString: function () {
          return this.name + ":<br> " + this.message + "<br>";
        }
      }
    }
  }

  check_doc_against_schema(doc, schema) {
    // Check that "_id" is provided
    if (!("_id" in doc)) {
      throw {
        name: "Missing attribute",
        message: "Document must have an _id attribute",
        toString: function () {
          return this.name + ": " + this.message;
        }
      };
    }
    // Check against the schema
    check(doc, schema);
  }

  import_from_JSON(doclist, update_existing) {

    if (Meteor.isServer) {

      generic_import_docs_from_JSON(this, doclist, update_existing);

    }
  }
}


