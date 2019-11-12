import { pretty, numberSpaces } from '../../utils'
import axios from 'axios'

const getDefaultState = () => {
  return {
    minterscanApi: 'https://minterscan.pro/',
    scoringApi: 'https://minter-scoring.space/api/',
    explorerApi: 'https://explorer-api.minter.network/api/v1/',
    balances: null,
    balancesJSON: {},
    balancesSelect: [],
    coinsJSON: null,
    delegations: null,
    validators: null,
    validatorsSelect: null
  }
}
const state = getDefaultState()

const getters = {
  findValidator: state => address => state.validatorsSelect.find(item => item.value === address),
  balanceSum: state => pretty(state.balances.available_balance_sum, 5),
  balanceCustom: state => pretty(state.balances.available_balance_sum - state.balancesJSON.BIP, 5),
  delegationsSum: state => {
    let sum = state.delegations.reduce((prev, curr) => ({
      bip_value: parseInt(prev.bip_value) + parseInt(curr.bip_value)
    }))
    return numberSpaces(pretty(sum.bip_value, 5))
  }
}

const mutations = {
  RESET_API: state => {
    Object.assign(state, getDefaultState())
  },
  SET_BALANCE: (state, payload) => {
    let tmpJson = {}
    payload.balances.forEach((item) => {
      tmpJson[item.coin] = pretty(item.amount, 5)
    })
    let tmpArr = []
    payload.balances.forEach(item => {
      item.label = item.coin
      item.value = item.coin
      item.amountPretty = numberSpaces(pretty(item.amount, 5))
      tmpArr.push(item)
    })
    state.balancesSelect = tmpArr
    state.balancesJSON = tmpJson
    state.balances = payload
  },
  SET_COINS: (state, payload) => {
    const coinsJSON = {}
    payload.forEach((item) => {
      coinsJSON[item.symbol] = {
        crr: item.crr,
        name: item.name.length ? item.name : ''
      }
    })
    state.coinsJSON = coinsJSON
  },
  SET_DELEGATION: (state, payload) => {
    state.delegations = payload
  },
  // SET_VALIDATOR: (state, payload) => {
  //   state.delegations = payload
  // },
  SET_VALIDATORS: (state, payload) => {
    const tmpArr = []
    payload.forEach(item => {
      if (item.status === 2 && item.part && item.meta.name) {
        tmpArr.push({
          label: item.meta.name,
          value: item.public_key,
          desc: item.meta.description,
          icon: item.meta.icon_url,
          part: item.part
        })
      }
    })
    tmpArr.sort((a, b) => {
      if (parseFloat(a.part) < parseFloat(b.part)) return 1
      if (parseFloat(a.part) > parseFloat(b.part)) return -1
      return 0
    })
    state.validatorsSelect = tmpArr
    state.validators = payload
  },
  SET_TRANSACTION: (state, payload) => {
    state.transactions = payload
  }
  // SET_TRANSACTION_LOADING: (state, payload) => {
  //  state.transactionsLoading = payload;
  // },
}

const actions = {
  FETCH_BALANCE: async (context, payload) => {
    let { data } = await axios.get(`${ state.explorerApi }addresses/${ context.rootState.wallet.address }?withSum=true`)
    context.commit('SET_BALANCE', data.data)
  },
  FETCH_DELEGATION: async (context, payload) => {
    let { data } = await axios.get(`${ state.explorerApi }addresses/${ context.rootState.wallet.address }/delegations`)
    context.commit('SET_DELEGATION', data.data)
  },
  FETCH_COINS: async (context, address) => {
    let { data } = await axios.get(`${ state.explorerApi }coins`)
    context.commit('SET_COINS', data.data)
  },
  FETCH_VALIDATORS: async (context, pubKey) => {
    let { data } = await axios.get(`${ state.explorerApi }validators`)
    context.commit('SET_VALIDATORS', data.data)
  },
  GET_VALIDATOR: async (context, pubKey) => {
    let { data } = await axios.get(`${ state.explorerApi }validators/${ pubKey }`)
    // context.commit('SET_VALIDATOR', data.data)
    return data.data
  },
  GET_PROFILE: async (context, address) => {
    let { data } = await axios.get(`${ state.minterscanApi }profiles/${ address }`)
    return data
  }
  // FETCH_TRANSACTION: async (context, payload) => {
  //  let { data } = await axios.get(`${ state.explorerApi }addresses/${ context.rootState.wallet.address }/transactions`);
  //  context.commit('SET_TRANSACTION', data.data);
  // }
}

export default {
  state,
  getters,
  mutations,
  actions
}
