const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const userSchema = new Schema({
  username: String,
  password: String,
  email : String,
  address1: String,
  address2:String,
  pincode: Number,
  country: String,
  region: String,
  role: {
      type: String,
      enum : ['USER', 'ADMIN'],
      default : 'USER'
    },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
