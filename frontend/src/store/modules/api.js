import { prettyNumber } from '../../utils'
import axios from 'axios'
// https://t.me/MinterDevChat/25378 Запросы
const getDefaultState = () => {
  return {
    scoringApi: 'https://minter-scoring.space/api/',
    explorerApi: 'https://explorer-api.minter.network/api/v1/',
    balance: null,
    currency: null,
    coins: null,
    delegations: null,
    delegationsTotal: null,
    validators: null
  }
}
const state = getDefaultState()

const getters = {
  filterValidator: state => searchVal => {
    const filterTmp = state.validators.filter(item => item.meta.name ? item.meta.name.toLowerCase().indexOf(searchVal.toLowerCase()) > -1 : false)
    return filterTmp.map(item => {
      return {
        address: item.public_key,
        icon: item.meta.icon_url,
        title: item.meta.name
      }
    })
  },
  findValidator: state => address => state.validators.find(item => item.public_key === address),
  balanceSum: state => prettyNumber(state.balance.available_balance_sum, 5),
  // balanceCustom: state => pretty(state.balances.available_balance_sum - state.balancesJSON.BIP, 5),
  // getBalancesSelectItem: state => ticet => state.balances.balances.find(item => item.value === ticet),
  balanceSelect: state => state.balance.balances.map(item => {
    return {
      label: `<b>${ item.coin }</b> (${ prettyNumber(item.amount, 5) })`,
      value: item.coin,
      amount: item.amount
    }
  }),
  balanceObj: state => {
    const tmpBalance = {}
    state.balance.balances.forEach(item => {
      tmpBalance[item.coin] = item.amount
    })
    return tmpBalance
  },
  coinsSelect: state => state.coins.map(item => {
    return {
      label: `<b>${ item.symbol }</b> (crr: ${ item.crr })`,
      value: item.symbol,
      reserve: item.reserveBalance,
      crr: item.crr,
      volume: item.volume
    }
  }),
  coinsInfo: state => {
    const tmpCoins = {}
    state.coins.forEach(item => {
      tmpCoins[item.symbol] = {
        crr: item.crr,
        name: item.name,
        reserve: item.reserveBalance,
        volume: item.volume
      }
    })
    return tmpCoins
  },
  delegationsGroup: state => {
    return state.delegations.reduce((prev, curr) => {
      (prev[curr.validator_meta.name] = prev[curr.validator_meta.name] || []).push(curr)
      return prev
    }, {})
  },
  // delegationsSum: state => {
  //   const sum = state.delegations.reduce((prev, curr) => ({
  //     bip_value: parseInt(prev.bip_value) + parseInt(curr.bip_value)
  //   }))
  //   return prettyNumber(sum.bip_value, 2)
  // },
  validatorsSelect: state => {
    const tmpValidators = []
    if (state.validators && state.validators.length) {
      state.validators.forEach(item => {
        if (item.status === 2 && item.part && item.meta.name) {
          tmpValidators.push({
            label: item.meta.name,
            value: item.public_key,
            desc: item.meta.description,
            icon: item.meta.icon_url,
            part: item.part
          })
        }
      })
      tmpValidators.sort((a, b) => {
        if (parseFloat(a.part) < parseFloat(b.part)) return 1
        if (parseFloat(a.part) > parseFloat(b.part)) return -1
        return 0
      })
    }
    return tmpValidators
  }
}

const mutations = {
  RESET_API: state => {
    Object.assign(state, getDefaultState())
  },
  SET_BALANCE: (state, payload) => {
    state.balance = payload
  },
  SET_COINS: (state, payload) => {
    state.coins = payload
  },
  SET_DELEGATION: (state, payload) => {
    state.delegations = payload.coins
    state.delegationsTotal = payload.total
  },
  // SET_VALIDATOR: (state, payload) => {
  //   state.delegations = payload
  // },
  SET_VALIDATORS: (state, payload) => {
    state.validators = payload
  },
  SET_TRANSACTION: (state, payload) => {
    state.transactions = payload
  },
  SET_CURRENCY: (state, payload) => {
    state.currency = payload
  }
  // SET_TRANSACTION_LOADING: (state, payload) => {
  //  state.transactionsLoading = payload;
  // },
}

const actions = {
  FETCH_BALANCE: async (context, payload) => {
    try {
      const address = payload || context.rootState.wallet.address
      const { data } = await axios.get(`${ state.explorerApi }addresses/${ address }?withSum=true`)
      if (!payload || !payload.length) {
        context.commit('SET_BALANCE', data.data)
      }
      return data.data
    } catch (error) {
      console.log('SET_BALANCE', error)
    }
  },
  FETCH_DELEGATION: async (context, payload) => {
    try {
      const address = payload || context.rootState.wallet.address
      const { data } = await axios.get(`${ state.explorerApi }addresses/${ address }/delegations`)
      if (!payload || !payload.length) {
        context.commit('SET_DELEGATION', { coins: data.data, total: data.meta.additional.total_delegated_bip_value })
      }
      return data
    } catch (error) {
      console.log('SET_DELEGATION', error)
    }
  },
  FETCH_COINS: async (context, address) => {
    try {
      const { data } = await axios.get(`${ state.explorerApi }coins`)
      context.commit('SET_COINS', data.data)
    } catch (error) {
      const { data } = await axios.get('https://api.charity.cloudp.group/coins')
      context.commit('SET_COINS', data)
    }
  },
  FETCH_VALIDATORS: async (context, pubKey) => {
    const { data } = await axios.get(`${ state.explorerApi }validators`)
    context.commit('SET_VALIDATORS', data.data)
  },
  GET_VALIDATOR: async (context, pubKey) => {
    const { data } = await axios.get(`${ state.explorerApi }validators/${ pubKey }`)
    // context.commit('SET_VALIDATOR', data.data)
    return data.data
  },
  GET_CURRENCY: async (context) => {
    try {
      const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bip&vs_currencies=usd')
      // const { data } = await axios.get('https://bipchange.org/api/')
      context.commit('SET_CURRENCY', data.bip)
    } catch (error) {
      console.log(error)
    }
  },
  FETCH_TRANSACTION: async (context, address) => {
    const { data } = await axios.get(`${ state.explorerApi }addresses/${ address }/transactions`)
    return data
    // context.commit('SET_TRANSACTION', data.data);
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
