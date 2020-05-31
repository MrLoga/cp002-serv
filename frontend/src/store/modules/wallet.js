import { Minter, TX_TYPE, prepareSignedTx } from 'minter-js-sdk'
import { Loading, QSpinnerFacebook } from 'quasar'
import { prettyNumber, shortAddress } from '../../utils'
import Big from 'big.js'
import axios from 'axios'

const getDefaultState = () => {
  return {
    wallets: [],
    observer: [],

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
      caption: shortAddress(item.address, 8),
      icon: item.icon,
      title: item.title,
      privateKey: item.privateKey,
      mnemonic: item.mnemonic,
      address: item.address,
      balance: item.balance ? prettyNumber(item.balance, 2, true) : null
    }
  }),
  observerSelect: state => state.observer.map(item => {
    return {
      label: `<b>${ item.title }</b>`,
      value: item.address,
      caption: shortAddress(item.address, 8),
      icon: item.icon,
      title: item.title,
      address: item.address,
      balance: item.balance ? prettyNumber(item.balance, 2, true) : null
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
  SAVE_OBSERVER: (state, payload) => {
    state.observer.push(payload)
  },
  SET_WALLET: (state, payload) => {
    const itemId = state.wallets.findIndex(item => item.address === payload)
    state.address = state.wallets[itemId].address
    state.privateKey = state.wallets[itemId].privateKey
    state.mnemonic = state.wallets[itemId].mnemonic
  },
  REMOVE_OBSERVER: (state, payload) => {
    const itemId = state.observer.findIndex(item => item.address === payload)
    state.observer.splice(itemId, 1)
  },
  REMOVE_WALLET: (state, payload) => {
    const itemId = state.wallets.findIndex(item => item.address === payload)
    state.wallets.splice(itemId, 1)
  },
  CHANGE_WALLET: (state, payload) => {
    const itemId = state.wallets.findIndex(item => item.address === payload)
    state.wallets[itemId] = payload
  },
  CHANGE_NAME_WALLET: (state, payload) => {
    if (payload.isObserve) {
      console.log(state.observer, payload.address)
      const itemId = state.observer.findIndex(item => item.address === payload.address)
      console.log(itemId, state.observer, payload.title)
      state.observer[itemId].title = payload.title
    } else {
      const itemId = state.wallets.findIndex(item => item.address === payload.address)
      state.wallets[itemId].title = payload.title
    }
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
  },
  SET_WALLET_BALANCE: (state, payload) => {
    // const wallet = state.wallets.find(item => item.address === payload.address)
    const walletId = state.wallets.findIndex(item => item.address === payload.address)
    if (walletId !== -1) state.wallets[walletId].balance = payload.balance
    else {
      const observerId = state.observer.findIndex(item => item.address === payload.address)
      if (observerId !== -1) state.observer[observerId].balance = payload.balance
    }
  }
}

const actions = {
  FETCH_BALANCE_ADDRESS: async (context, payload) => {
    const { data } = await axios.get(`${ context.rootState.api.explorerApi }addresses/${ payload }?withSum=true`)
    context.commit('SET_WALLET_BALANCE', { address: payload, balance: data.data.available_balance_sum })
    return data.data
  },
  FETCH_DELEGATIONS_ADDRESS: async (context, payload) => {
    const { data } = await axios.get(`${ context.rootState.api.explorerApi }addresses/${ payload }/delegations`)
    return data
  },
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
