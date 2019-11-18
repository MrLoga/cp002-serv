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

const Wallet = mongoose.model('Wallet', WalletSchema)

export default Wallet
