const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const foodSchema = new Schema({
   name: String,
   cuisine: String,
   description: String,
   imgName: String,
   imgPath: String,
   availability:{type:Date},
   _owner: { type: Schema.Types.ObjectId, ref: 'User' },
   status:{type:Number,enum:[0,1],default:1}

  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;
