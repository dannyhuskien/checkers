import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, minlength: 2, maxlength: 64 },
});

module.exports = mongoose.model('Player', schema);
