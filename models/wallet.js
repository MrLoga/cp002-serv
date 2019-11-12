import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
  address: {
    type: String,
    index: true,
    unique: true
  },
  nonce: {
    type: String,
    // index: true,
    // unique: true
  },
  key: String,
  login: mongoose.Schema.Types.Mixed,
  project: {
    type: Boolean,
    default: false
  },
  telegram: String,
  name: String,
  created: {
    type: Date
  }
})

WalletSchema.pre('save', next => {
  this.created = Date.now()
  next()
})
// WalletSchema.statics.findByAddress = async function (address) {
//   let request = await this.find({
//     address: address,
//   });
//   return request;
// }

const Wallet = mongoose.model('Wallet', WalletSchema);

export default Wallet;
