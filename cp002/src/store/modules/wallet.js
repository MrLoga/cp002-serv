import { Minter, SendTxParams, DelegateTxParams, API_TYPE_NODE } from 'minter-js-sdk'

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
    state.minterGate = new Minter({ apiType: API_TYPE_NODE, baseURL: 'https://api.minter.stakeholder.space/' })
  }
}

const actions = {
  SENDER: (context, payload) => {
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
      default:
        return false
    }
    return new Promise((resolve, reject) => {
      context.state.minterGate.postTx(txParams).then((txHash) => {
        // console.log(payload.txAction + ' created: ' + txHash)
        resolve(txHash)
      }).catch((error) => {
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
