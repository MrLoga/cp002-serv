import { Minter, TX_TYPE, prepareSignedTx, DelegateTxParams } from 'minter-js-sdk'
import { Loading, QSpinnerFacebook } from 'quasar'
import { prettyNumber, shortAddress } from '../../utils'
import Big from 'big.js'
import axios from 'axios'
import { i18n } from '../../boot/i18n'
import assert from 'assert'

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

export const state = getDefaultState()

export const getters = {
  isLogin: state => (!!state.privateKey && !!state.address && !!state.address.length),
  // isRegistered: state => (!!state.key && !!state.nonce),
  findWallet: state => address => state.wallets.find(item => item.address === address),
  findObserver: state => address => state.observer.find(item => item.address === address),
  totalWalletsBip: state => state.wallets.reduce((prev, curr) => curr && curr.balance ? Big(prev).plus(curr.balance) : 0, 0),
  totalObserversBip: state => state.observer.reduce((prev, curr) => curr && curr.balance ? Big(prev).plus(curr.balance) : 0, 0),
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

export const mutations = {
  RESET_WALLET: state => {
    Object.assign(state, getDefaultState())
  },
  SET_WALLET: (state, payload) => {
    if (payload === null) {
      console.log(payload)
      state.address = null
      state.privateKey = null
      state.mnemonic = null
    } else {
      const itemId = state.wallets.findIndex(item => item.address === payload)
      state.address = state.wallets[itemId].address
      state.privateKey = state.wallets[itemId].privateKey
      state.mnemonic = state.wallets[itemId].mnemonic
    }
  },
  SAVE_WALLET: (state, payload) => {
    state.wallets.push(payload)
    state.address = payload.address
    state.privateKey = payload.privateKey
    state.mnemonic = payload.mnemonic
  },
  SET_SEED_WALLET: (state, payload) => {
    const curWallet = state.wallets.find(item => item.address === payload.address)
    curWallet.privateKey = payload.privateKey
    curWallet.mnemonic = payload.mnemonic
    state.address = payload.address
    state.privateKey = payload.privateKey
    state.mnemonic = payload.mnemonic
  },
  SAVE_OBSERVER: (state, payload) => {
    state.observer.push(payload)
  },
  REMOVE_WALLET: (state, payload) => {
    const itemId = state.wallets.findIndex(item => item.address === payload)
    state.wallets.splice(itemId, 1)
  },
  REMOVE_OBSERVER: (state, payload) => {
    const itemId = state.observer.findIndex(item => item.address === payload)
    state.observer.splice(itemId, 1)
  },
  UPDATE_WALLETS: (state, payload) => {
    const tmpWallets = payload.map(wallet => {
      const findWallet = state.wallets.find(item => item.address === wallet.address)
      if (findWallet && findWallet.mnemonic) {
        wallet.privateKey = findWallet.privateKey
        wallet.mnemonic = findWallet.mnemonic
      }
      return wallet
    })
    state.wallets = tmpWallets
  },
  UPDATE_OBSERVER: (state, payload) => {
    state.observer = payload
  },
  CHANGE_WALLET: (state, payload) => {
    const itemId = state.wallets.findIndex(item => item.address === payload)
    state.wallets[itemId] = payload
  },
  CHANGE_NAME_WALLET: (state, payload) => {
    if (payload.isObserve) {
      const itemId = state.observer.findIndex(item => item.address === payload.address)
      state.observer[itemId].title = payload.title
    } else {
      const itemId = state.wallets.findIndex(item => item.address === payload.address)
      state.wallets[itemId].title = payload.title
    }
  },
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
        message: i18n.t('We\'re sending your transaction, please wait'),
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

export const actions = {
  FETCH_BALANCE_ADDRESS: async (context, payload) => {
    const { data } = await axios.get(`${ context.rootState.api.explorerApi }addresses/${ payload }?withSum=true`)
    context.commit('SET_WALLET_BALANCE', { address: payload, balance: data.data.available_balance_sum })
    return data.data
  },
  GET_DELEGATIONS_ADDRESS: async (context, payload) => {
    const { data } = await axios.get(`${ context.rootState.api.explorerApi }addresses/${ payload }/delegations`)
    if (data && data.meta.total && data.meta.total > (data.meta.per_page || 50)) {
      const pages = Math.floor(data.meta.total / (data.meta.per_page || 50))
      for (let i = 0; i < pages; i++) {
        const dataAdd = await axios.get(`${ context.rootState.api.explorerApi }addresses/${ payload }/delegations?page=${ i + 2 }`)
        data.data = data.data.concat(dataAdd.data.data)
      }
    }
    return data
  },
  SET_SEED_WALLET: async ({ state, rootState, commit }, payload) => {
    commit('SET_SEED_WALLET', payload)
    return payload
  },
  SAVE_WALLET: async ({ state, rootState, commit }, payload) => {
    commit('SAVE_WALLET', payload)
    if (rootState.user.jwt && rootState.user.syncWallets) {
      const tmpWallet = {
        address: payload.address,
        title: payload.title
      }
      await axios.put(`${ rootState.user.backendApi }user-data/push-wallet`, tmpWallet, rootState.user.httpConfig)
    }
    return payload
  },
  SAVE_OBSERVER: ({ state, rootState, commit }, payload) => {
    commit('SAVE_OBSERVER', payload)
    if (rootState.user.jwt && rootState.user.syncObservers) {
      axios.put(`${ rootState.user.backendApi }user-data/push-observer`, payload, rootState.user.httpConfig)
    }
  },
  REMOVE_WALLET: ({ state, rootState, commit }, payload) => {
    commit('REMOVE_WALLET', payload)
    if (rootState.user.jwt && rootState.user.syncWallets) {
      axios.put(`${ rootState.user.backendApi }user-data/pull-wallet`, { address: payload }, rootState.user.httpConfig)
    }
  },
  REMOVE_OBSERVER: ({ state, rootState, commit }, payload) => {
    commit('REMOVE_OBSERVER', payload)
    if (rootState.user.jwt && rootState.user.syncObservers) {
      axios.put(`${ rootState.user.backendApi }user-data/pull-observer`, { address: payload }, rootState.user.httpConfig)
    }
  },
  CHANGE_NAME_WALLET: ({ state, rootState, commit }, payload) => {
    commit('CHANGE_NAME_WALLET', payload)
    if (rootState.user.jwt && ((payload.isObserve && rootState.user.syncObservers) || (!payload.isObserve && rootState.user.syncWallets))) {
      const updateURL = `${ rootState.user.backendApi }user-data/${ payload.isObserve ? 'observers' : 'wallets' }/${ payload.address }`
      axios.put(updateURL, { title: payload.title }, rootState.user.httpConfig)
    }
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
      }).catch(error => {
        console.log(error)
        reject(error.response && error.response.data ? error.response.data.error.message : error.response.error.message)
        })
        .finally(() => {
        context.commit('SET_SENDING', false)
      })
    })
  },

  async SETUP_AUTOTRANSACTIONS(
    // eslint-disable-next-line no-shadow
    { state, rootState },
    { txData, description, to, coin, amount, type, wallet }
  ) {
    assert(state.address);
    assert(state.privateKey);

    const transactionAmount = 100;

    // console.log(publicKey)
    // return

    const txParams = {
      chainId: 1,
      type: TX_TYPE[txData.type],
      data: txData.data,
      gasCoin: txData.gasCoin || 'BIP',
      payload: description || '',
    }

    const nonce = await state.minterGate.getNonce(state.address);
    const txArr = [...new Array(transactionAmount)].map((_, it) =>
      prepareSignedTx(
        {
          ...txParams,
          nonce: nonce + it,
        },
        { privateKey: state.privateKey }
      )
        .serialize()
        .toString('hex')
    )

    console.log(txArr)


    return axios.create({ baseURL: `${rootState.user.backendApi}` }).put(
      'auto-transactions',
      {
        transactions: txArr,
        wallet: wallet || state.address,
        description: description || '',
        to: to || '',
        coin: coin || 'BIP',
        amount,
        type,
        txParams,
      },
      rootState.user.httpConfig
    );
  },
}
