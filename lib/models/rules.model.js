// rules-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const {packages: {lodash: {lunset, lmergeWith}}, extensionUtils: {schemaCustomizer}} = require('@iy4u/common-utils');

module.exports = function (app,{connection, extend_schema = {}, schema_remove_paths = []} = {}) {
  const {models: {Common}} = require('@iy4u/common-server-lib');
  
  const mongoose = app.get('mongoose') || app.get('mongooseClient') || require('mongoose');
  const mongooseClient = connection || mongoose;
  const {Schema} = mongoose;
  
  const modelName = 'rules';

  const orig_schema = {
    name: { type: String, required: true, lowercase: true },
    note: { type: String, required: false },
    inAbilities: [{ type: Schema.Types.ObjectId, ref: 'abilities' }],
    action: {type: Array, required: true, minLength: 1, contains: { type: String, lowercase: true, trim: true }},
    subject: {type: String, required: true, lowercase: true, trim: true},
    fields: [{ type: String }],
    conditions: { type: Object },
    reason: {type: String},
    inverted: {type: Boolean, default: false},
    active: { type: Boolean, default: true },
    
    ...Common.commonFieldsFn(app).obj,
  };
  
  schema_remove_paths.map(path => lunset(orig_schema, path));
  
  const schema = new Schema(lmergeWith(orig_schema, extend_schema, schemaCustomizer), {
    timestamps: true,
  });
  
  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  
  return mongooseClient.model(modelName, schema);
};
