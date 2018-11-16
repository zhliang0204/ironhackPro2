const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const messageSchema = new Schema({
  content: String,
  _food: { type: Schema.Types.ObjectId, ref: 'Food' }, 
  _sender: { type: Schema.Types.ObjectId, ref: 'User' }
})

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
