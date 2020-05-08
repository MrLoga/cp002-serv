import { Minter, TX_TYPE, prepareSignedTx } from 'minter-js-sdk'
import { Loading, QSpinnerFacebook } from 'quasar'
import Big from 'big.js'

const getDefaultState = () => {
  return {
    wallets: [],

    address: null,
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
  // isRegistered: state => (!!state.key && !!state.nonce),
  findWallet: state => address => state.wallets.find(item => item.address === address),
  walletsSelect: state => state.wallets.map(item => {
    return {
      label: `<b>${ item.title }</b>`,
      value: item.address,
      caption: item.address.substr(0, 8) + '...' + item.address.substr(-8),
      icon: item.icon,
      title: item.title,
      privateKey: item.privateKey,
      mnemonic: item.mnemonic,
      address: item.address
    }
  })
}

const mutations = {
  RESET_WALLET: state => {
    Object.assign(state, getDefaultState())
  },
  SAVE_WALLET: (state, payload) => {
    const tmpWallet = {
      title: payload.title || '',
      icon: payload.icon || '',
      address: payload.address,
      privateKey: payload.privateKey,
      mnemonic: payload.mnemonic
    }
    state.wallets.push(tmpWallet)
    state.address = tmpWallet.address
    state.privateKey = tmpWallet.privateKey
    state.mnemonic = tmpWallet.mnemonic
  },
  SET_WALLET: (state, payload) => {
    const itemId = state.wallets.findIndex(item => item.address === payload)
    state.address = state.wallets[itemId].address
    state.privateKey = state.wallets[itemId].privateKey
    state.mnemonic = state.wallets[itemId].mnemonic
  },
  REMOVE_WALLET: (state, payload) => {
    const itemId = state.wallets.findIndex(item => item.address === payload)
    state.wallets.splice(itemId, 1)
  },
  CHANGE_WALLET: (state, payload) => {
    const itemId = state.wallets.findIndex(item => item.address === payload)
    state.wallets[itemId] = payload
  },
  // SAVE_KEYS: (state, payload) => {
  //   state.key = payload.key
  //   state.nonce = payload.nonce
  //   state._id = payload._id
  // },
  SAVE_GATE: (state) => {
    state.minterGate = new Minter({ apiType: 'gate', baseURL: 'https://gate-api.minter.network/api/v1/' })
    // state.minterGate = new Minter({ apiType: API_TYPE_NODE, baseURL: 'https://api.minter.stakeholder.space/' })
  },
  SET_SENDING: (state, payload) => {
    if (payload) {
      Loading.show({
        QSpinnerFacebook,
        spinnerColor: 'white',
        spinnerSize: 120,
        backgroundColor: 'indigo-10',
        message: 'Transaction is being sent, please wait',
        messageColor: 'white'
      })
    } else {
      Loading.hide()
    }
  }
}

const actions = {
  GET_COMMISSION: (context, payload) => {
    const txParams = {
      chainId: 1,
      nonce: 99999,
      type: TX_TYPE[payload.type],
      data: payload.data,
      gasCoin: payload.gasCoin || 'BIP',
      payload: payload.payload || ''
    }
    const tx = prepareSignedTx(txParams).serialize().toString('hex')
    return new Promise((resolve, reject) => {
      context.state.minterGate.estimateTxCommission({ transaction: tx }).then(commission => {
        resolve(Big(commission).div(1e18).toString())
      }).catch(error => {
        console.log(error)
        reject(error.response.data)
      })
    })
  },

  SENDER: (context, payload) => {
    context.commit('SET_SENDING', true)
    const txParams = {
      chainId: 1,
      type: TX_TYPE[payload.type.toUpperCase()],
      data: payload.data,
      gasCoin: payload.gasCoin || 'BIP',
      payload: payload.payload || ''
    }

    return new Promise((resolve, reject) => {
      context.state.minterGate.postTx(txParams, { privateKey: context.state.privateKey }).then(txHash => {
        console.log(payload.type + ' created: ' + txHash)
        resolve(txHash)
        context.commit('SET_SENDING', false)
      }).catch(error => {
        console.log(error)
        context.commit('SET_SENDING', false)
        reject(error.response && error.response.data ? error.response.data.error.message : error.response.error.message)
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
