import { Random } from "meteor/random";
import { TmpFiles } from "../databet_collections/TmpFiles";



export function save_and_publish_zipfile(zipfile, archive_name) {

  if (Meteor.isServer) {

    var upload_root = TmpFiles.get_storage_path();
    var archive_path = upload_root + "/" + archive_name + ".zip";

    console.log("Saving zip file to: " + archive_path);
    zipfile.saveAs(archive_path);

    var random_key = Random.id();

    TmpFiles.MeteorFiles.addFile(archive_path,
      {
        fileName: archive_name + ".zip",
        type: 'binary', // not needed
        isBase64: true, // not needed
        meta: {databet_id: random_key}
      },
      function (error, fileRef) {
      }
    );

    // Look for the record in a BUSY LOOP (ugly, but fuck callbacks)
    var doc = undefined;
    while (!doc) {
      console.log("In short-lived busy loop");
      doc = TmpFiles.MeteorFiles.findOne({"meta.databet_id": random_key});
    }

    return [doc.meta.databet_id, doc.link()];
  }
}

