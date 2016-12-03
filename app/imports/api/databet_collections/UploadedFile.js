UploadedFiles = new Mongo.Collection("UploadedFiles");

UploadedFiles.attachSchema(new SimpleSchema({

    // Object with all file info
    fileinfo: {
      type: Object,
      optional: false,
      blackbox: true
    },

    url: { // Needed since URL-crafting is necessary with a custom ROOT_URL
      type: String,
      optional: false
    }
  })
);