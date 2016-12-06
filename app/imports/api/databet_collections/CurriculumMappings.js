export var CurriculumMappings = new Mongo.Collection("CurriculumMappings");

CurriculumMappings.attachSchema(new SimpleSchema({
  curriculum: {
    type: String,
    optional: false
  },
  course: {
    type: String,
    optional: false,
  },
  performance_indicator: {
    type: String,
    optional: false
  },
  level: {
    type: String,
    optional: false
  },
}));





