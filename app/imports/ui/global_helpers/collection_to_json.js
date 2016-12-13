

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