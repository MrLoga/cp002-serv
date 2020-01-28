import { pretty, numberSpaces } from '../../utils'
// import axios from 'axios'

const getDefaultState = () => {
  return {
    mnemonic: null,
    address: null,
    minterscanApi: 'https://minterscan.pro/',
    scoringApi: 'https://minter-scoring.space/api/',
    explorerApi: 'https://explorer-api.minter.network/api/v1/',
    pushCoinsJSON: null,
    balances: null,
    balancesJSON: null
  }
}
const state = getDefaultState()

const getters = {
  pushBalancesSelect: state => {
    let tmpArr = []
    state.balances.balances.forEach(item => {
      item.label = item.coin
      item.value = item.coin
      item.amountPretty = numberSpaces(pretty(item.amount, 5))
      tmpArr.push(item)
    })
    return tmpArr
  }
}

const mutations = {
  RESET_API: state => {
    Object.assign(state, getDefaultState())
  },
  PUSH_BALANCE: (state, payload) => {
    let tmpJson = {}
    payload.balances.forEach((item) => {
      tmpJson[item.coin] = pretty(item.amount, 5)
    })
    state.balancesJSON = tmpJson
    state.balances = payload
  },
  PUSH_DATA: (state, payload) => {
    state.mnemonic = payload.mnemonic
    state.address = payload.address
  }
}

const actions = {
  // FETCH_BALANCE_ADDRESS: async (context, payload) => {
  //   let { data } = await axios.get(`${ state.explorerApi }addresses/${ payload }?withSum=true`)
  //   return data.data
  // },
}

export default {
  state,
  getters,
  mutations,
  actions
}
