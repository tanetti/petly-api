const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  name: {
    type: String,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: null,
  },
  birthday: {
    type: Date,
    default: null,
  },
  avatarURL: {
    type: String,
    default: null,
  },
  favoriteNotices: {
    type: Array,
    default: [],
  },
  token: {
    type: Array,
    default: [],
  },
});

userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 8);
});

const User = mongoose.model('users', userSchema);

module.exports = User;
