import mongoose from 'mongoose';

const pushSchema = new mongoose.Schema({
  _id: {
    type: String,
    unique: true,
  },
  pub: {
    type: String,
  },
}, { _id: false });

pushSchema.statics.findByAddress = async function (address) {
  let pub = await this.findOne({
    _id: address,
  });
  return pub;
};

const Push = mongoose.model('Push', pushSchema);

export default Push;