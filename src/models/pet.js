const { Schema, model, SchemaTypes } = require('mongoose');

const petSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Provide Name for pet'],
  },
  birthdate: {
    type: Date,
    required: [true, 'Provide pet Birtday'],
  },
  breed: {
    type: String,
    required: [true, 'Provide pet Breed'],
  },
  comments: {
    type: String,
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

const Pet = model('pet', petSchema);

module.exports = Pet;
