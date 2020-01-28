import { Minter, SendTxParams, DelegateTxParams, SellTxParams, BuyTxParams } from 'minter-js-sdk'
import { Loading } from 'quasar'

const getDefaultState = () => {
  return {
    address: null,
    publicKey: null,
    privateKey: null,
    mnemonic: null,
    minterGate: null,
    key: null,
    nonce: null,
    _id: null
  }
}

const state = getDefaultState()

const getters = {
  isLogin: state => (!!state.privateKey && !!state.address && !!state.address.length),
  isRegistered: state => (!!state.key && !!state.nonce)
}

const mutations = {
  RESET_WALLET: state => {
    Object.assign(state, getDefaultState())
  },
  SAVE_WALLET: (state, payload) => {
    state.address = payload.address
    state.publicKey = payload.publicKey
    state.privateKey = payload.privateKey
    state.mnemonic = payload.mnemonic
  },
  SAVE_KEYS: (state, payload) => {
    state.key = payload.key
    state.nonce = payload.nonce
    state._id = payload._id
  },
  SAVE_GATE: (state) => {
    state.minterGate = new Minter({ apiType: 'gate', baseURL: 'https://gate-api.minter.network/api/v1/' })
    // state.minterGate = new Minter({ apiType: API_TYPE_NODE, baseURL: 'https://api.minter.stakeholder.space/' })
  }
}

const actions = {
  SENDER: (context, payload) => {
    Loading.show()
    payload.privateKey = context.state.privateKey
    payload.chainId = 1
    let txParams = null
    switch (payload.txAction) {
      case 'SendTxParams':
        txParams = new SendTxParams(payload)
        break
      case 'DelegateTxParams':
        txParams = new DelegateTxParams(payload)
        break
      case 'SellTxParams':
        txParams = new SellTxParams(payload)
        break
      case 'BuyTxParams':
        txParams = new BuyTxParams(payload)
        break
      default:
        return false
    }
    return new Promise((resolve, reject) => {
      context.state.minterGate.postTx(txParams).then((txHash) => {
        console.log(payload.txAction + ' created: ' + txHash)
        Loading.hide()
        resolve(txHash)
      }).catch((error) => {
        Loading.hide()
        reject(error)
      })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
