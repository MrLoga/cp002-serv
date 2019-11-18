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
  login: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  project: {
    type: Boolean,
    default: false
  },
  telegram: String,
  name: String,
  created: {
    type: Date
  }
}, { minimize: false })

const Wallet = mongoose.model('Wallet', WalletSchema)

export default Wallet
