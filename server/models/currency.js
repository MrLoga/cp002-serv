import mongoose from 'mongoose'

const currencySchema = new mongoose.Schema({
  pair: {
    type: String
  },
  value: {
    type: String
  }
})

const Currency = mongoose.model('Currency', currencySchema)

export default Currency;