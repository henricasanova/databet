

export function generic_docs_to_JSON(cursor) {
  if (cursor.count() == 0) {
    return "[ ]";
  }
  var string = "[ ";

  var documents = cursor.fetch();
  for (var i = 0; i < documents.length; i++) {
    string += JSON.stringify(documents[i]);
    string += ",";
  }
  string = string.slice(0, -1); // Remove last comma
  string += " ]";

  return string;
}

export function generic_import_docs_from_JSON(collection, doclist, update_existing) {

  if (Meteor.isServer) {
    var k;

    for (k = 0; k < doclist.length; k++) {
      var doc = doclist[k];
      var docId = doc._id;

      if ((!docId) || (collection.find({_id: docId}).count() == 0)) {
        console.log("    Inserting a new document in ", collection._name);
        collection.insert(doc);
      } else if (update_existing) {
        console.log("    Replacing an existing document in ", collection._name);
        collection.remove({_id: docId});
        collection.insert(doc);
      } else {
        console.log("    Trying to insert a document with a key that's already there (",docId,")");
        // do nothing
      }
    }
  }
}