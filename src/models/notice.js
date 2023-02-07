const { Schema, model, SchemaTypes } = require('mongoose');
const PUBLIC_CATEGORIES = require('../constants/publicCategories');

const noticeSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Provide title for notice'],
  },
  name: {
    type: String,
    required: [true, 'Provide name of pet'],
  },
  birthdate: {
    type: Date,
    required: [true, 'Provide pet birthday'],
  },
  breed: {
    type: String,
    required: [true, 'Provide pet breed'],
  },
  location: {
    type: String,
    required: [true, 'Provide pet breed'],
  },
  comments: {
    type: String,
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    enum: [...PUBLIC_CATEGORIES],
    required: [true, 'Provide category for notice'],
  },
  sex: {
    type: String,
    enum: ['male', 'female'],
    required: [true, 'Provide sex of pet'],
  },
  avatarURL: {
    type: String,
  },
  owner: {
    type: SchemaTypes.ObjectId,
    ref: 'users',
  },
  created_at: { type: Date, required: true, default: Date.now },
});

const Notice = model('notice', noticeSchema);

module.exports = Notice;
