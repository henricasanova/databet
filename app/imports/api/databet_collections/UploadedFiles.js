/*
 * THIS IS NOT A BASE MONGO COLLECTION - IT'S A METEOR-FILES COLLECTION
 */


import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { fs_create_dir } from '../global_helpers/file_system';
import { FilesCollection } from 'meteor/ostrio:files';


export class UploadedFilesCollection {

  constructor(config) {
    this.config = config;
    this.MeteorFiles = new FilesCollection(config);
  }

  get_storage_path() {
    return this.config["storagePath"];
  }

  insert_document(fileObj, databet_id, prefix) {
    let uploadInstance = this.MeteorFiles.insert({
      file: fileObj,
      meta: { "databet_id": databet_id },
      streams: 'dynamic',
      chunkSize: 'dynamic'
    }, false);

    uploadInstance.on('start', function() {
      // nothing
    });

    uploadInstance.on('end', function(error, fileObj) {
      if (error) {
        alert('Error during upload: ' + error.reason);
      } else {
        alert('File "' + fileObj.name + '" successfully uploaded');
        // This is a terrible hack to impose particular filenames in Meteor-Files
        //console.log("Should try to rename File: fileObj", fileObj);
        const search_pattern = new RegExp(fileObj._id, "g");
        const replace_with = prefix + "::" + fileObj._id;
        const new_path = fileObj.path.replace(search_pattern, replace_with);
        Meteor.call("rename_uploaded_file", fileObj._id, new_path);
      }
    });

    uploadInstance.start();
  }

  remove_document(databet_id) {
    console.log("Removing in UploadFiles");
    this.MeteorFiles.remove({"meta.databet_id": databet_id});
  }

  remove(selector) {
    return this.MeteorFiles.remove(selector);
  }

  find_document(doc_id) {
    var selector = {"meta.databet_id": doc_id};
    return this.findOne(selector);
  }

  find(selector) {
    return this.MeteorFiles.find(selector);
  }

  findOne(selector) {
    return this.MeteorFiles.findOne(selector);
  }

  export_to_JSON() {

    const cursor = this.MeteorFiles.find();
    if (cursor.count() == 0) {
      return "[ ]";
    }
    let string = "[ ";

    const documents = cursor.fetch();
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      console.log("DOC = ", doc);

      const place_holder_object = {
        "databet_id": doc.meta.databet_id,
        "name": doc.name,
        "path": doc.path,
        "type": doc.type
      };

      string += JSON.stringify(place_holder_object);
      string += ",";
    }
    string = string.slice(0, -1); // Remove last comma
    string += " ]";

    return string;
  }

  check_JSON_against_schema(doclist, schema) {
    // This is a "fake check" (no schema, etc.)
    // We just care: it there a databet_id? is there a path?

    let k, error_message = "";
    for (k = 0; k < doclist.length; k++) {
      const doc = doclist[k];
      if (!("databet_id" in doc) ||
        !("name" in doc) ||
        !("path" in doc) ||
        !("type" in doc)) {
        error_message += "<br>Document #" + k +": should have databet_id, name, path, and type attributes";
      }
    }

    if (error_message != "") {
      throw {
        name: "Errors for collection UploadedFiles\n",
        message: error_message,
        toString: function () {
          return this.name + ":" + this.message + "<br>";
        }
      }
    }
  }

  import_from_JSON(doclist, update_existing) {

    if (Meteor.isServer) {
      let k;

      console.log("Importing into UploadedFiles");
      for (k = 0; k < doclist.length; k++) {
        const doc_databet_id = doclist[k].databet_id;
        const doc_name = doclist[k].name;
        const doc_path = doclist[k].path;
        const doc_type = doclist[k].type;



        const file_already_known = (this.find_document(doc_databet_id) != undefined);

        if ((!file_already_known) || (file_already_known && update_existing)) {
          if (file_already_known) {
            console.log("Removing document with databet_id", doc_databet_id, "from UploadedFiles");
            super.remove({"meta.databet_id": doc_databet_id});
          }
          // console.log("Adding document with databet_id", doc_databet_id, "into UploadedFiles");
          // console.log(" doc_databet_id = ", doc_databet_id);
          // console.log(" doc_name = ", doc_name);
          // console.log(" doc_path = ", doc_path);
          // console.log(" doc_type = ", doc_type);

          // Modify the doc_path in case we're on a different file system! This is a bit of
          // a hack right now
          const local_upload_root = Meteor.settings.upload_dir.path;
          const storage_dir = this.config["storageDir"];
          const import_upload_root = doc_path.split(storage_dir)[0];
          const new_doc_path = doc_path.replace(import_upload_root, local_upload_root);

          this.MeteorFiles.addFile(new_doc_path,
            {
              fileName: doc_name,
              type: doc_type,
              meta: {databet_id: doc_databet_id}
            },
            function(error, fileRef) {
              if (error == null) {
                // console.log("Successfully re-linked an UploadedFiles doc to  FS file '", doc_name, "'");
              } else {
                console.log("Couldn't re-linked an UploadedFiles doc to FS file '",doc_path, "(", doc_name,")': not found");
                // TODO: Figure out a way to send this back to the client - seems impossible :(
                throw new Meteor.Error("RE-LINKING FAILED!!");
              }
            }
          );

        }
      }
    }
  }

  simpleSchema() {
    return null;
  }
}


const meteor_files_config = {};

if (Meteor.server) {

  const upload_root = Meteor.settings.upload_dir.path;

  if (upload_root == undefined) {
    throw new Meteor.Error("upload_dir should be defined in the settings file");
  }

  meteor_files_config["storageDir"] = "/assessment_uploads/";

  meteor_files_config["storagePath"] = upload_root + meteor_files_config["storageDir"];
  fs_create_dir(meteor_files_config["storagePath"]);


  console.log("storage path =", meteor_files_config["storagePath"]);
}

meteor_files_config["debug"] = false;
meteor_files_config["collectionName"] = 'UploadedFiles';
meteor_files_config["allowClientCode"] = true;  // to allow file removal
meteor_files_config["onBeforeUpload"] = function (file) {

  // Allow upload files under 10MB, and only in png/jpg/jpeg/pdf/txt formats
  if (file.size <= 1024 * 1024 * 20 && /png|jpg|jpeg|pdf|zip|tar|tgz|txt/i.test(file.extension)) {
    return true;
  } else {
    return 'Please upload image or file with size equal or less than 20MB';
  }
};

export const UploadedFiles = new UploadedFilesCollection(meteor_files_config);


