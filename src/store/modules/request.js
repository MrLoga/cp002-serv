// import { atobUTF16 } from '../../utils'
import axios from 'axios'
import nacl from 'tweetnacl'
nacl.util = require('tweetnacl-util')

export const state = {
  wsRequest: null,
  wsStatus: false,
  wssApi: 'wss://wallet.reef.mn/api/ws',
  httpApi: 'https://wallet.reef.mn/api/',
  requests: [],
  currency: {},
  hasRequest: false
}

export const getters = {
  requestsCount: state => state.requests.length
}

export const mutations = {
  CLEAR_ALL_REQUESTS: state => {
    state.requests.length = 0
  },
  RESET_REQUEST: state => {
    state.wsRequest = null
    state.wsStatus = false
    state.wssApi = 'wss://wallet.reef.mn/api/ws'
    state.httpApi = 'https://wallet.reef.mn/api/'
    state.requests = []
  },
  // SET_DEV: (state) => {
  //   console.log('SET_DEV')
  //   state.wssApi = 'ws://localhost:3000/api/ws'
  //   state.httpApi = 'http://localhost:3000/api/'
  // },
  SET_WS: (state, payload) => {
    state.wsRequest = payload
  },
  CLOSE_WS: state => {
    state.wsRequest = null
    state.requests.length = 0
    state.wsStatus = false
  },
  WS_STATUS: (state, payload) => {
    state.wsStatus = payload
  },
  NEW_PAYMENT: (state, payload) => {
    state.requests.push(payload)
  },
  NEW_LOGIN: (state, payload) => {
    payload.created = new Date()
    state.requests.push(payload)
  },
  REMOVE_REQUEST: (state, payload) => {
    const itemId = state.requests.findIndex(item => item.id === payload)
    state.requests.splice(itemId, 1)
  },
  SET_CURRENCY: (state, payload) => {
    const currencyTmp = {}
    payload.forEach(item => {
      currencyTmp[item.pair] = item.value
    })
    state.currency = currencyTmp
  }
}

export const actions = {
  FETCH_CURRENCY: context => {
    axios.get(`${context.state.httpApi}currency`).then(data => {
      context.commit('SET_CURRENCY', data.data)
    }).catch(error => {
      console.log(error)
    })
  },
  NEW_WS: (context, payload) => {
    context.commit('CLEAR_ALL_REQUESTS')
    const ws = new WebSocket(context.state.wssApi)
    context.commit('SET_WS', ws)
    ws.onopen = e => {
      context.commit('WS_STATUS', true)
      ws.send(JSON.stringify({
        id: context.rootState.wallet.nonce,
        from: 'wallet',
        to: 'server',
        action: 'connect',
        requests: [null]
      }))
    }
    ws.onmessage = e => {
      let msg = false
      try {
        msg = JSON.parse(e.data)
      } catch (error) {
        // console.log(error)
      }
      const itemId = context.state.requests.findIndex(item => item.id === payload.id)
      if (itemId >= 0) return false
      if (msg.from === 'server' && msg.action === 'connect') {
        context.commit('UPDATE_AUTH', msg.response[0])
      } else if (msg.from === 'server' && msg.action === 'remove-auth') {
        context.commit('UPDATE_AUTH', msg.response[0])
      } else if (msg.from === 'app' && msg.action === 'payment') {
        context.commit('NEW_PAYMENT', msg)
      } else if (msg.from === 'app' && msg.action === 'login') {
        context.commit('NEW_LOGIN', msg)
      }
    }
    ws.onclose = e => {
      context.commit('CLOSE_WS')
      setTimeout(() => {
        context.dispatch('NEW_WS')
      }, 3000)
    }
  },
  RESPONSE: (context, payload) => {
    context.commit('REMOVE_REQUEST', payload.to)
    context.state.wsRequest.send(JSON.stringify(payload))
  },
  REQUESTS: (context, payload) => {
    context.commit('REMOVE_REQUEST', payload.to)
    context.state.wsRequest.send(JSON.stringify(payload))
  },
  // GET_ADDRESS: async (context) => {
  //   axios.get(`${context.state.httpApi}reg/address/${context.rootState.wallet.address}`).then(data => {
  //     // console.log(data.data)
  //   })
  // },
  REGISTER_ADDRESS: async (context, payload) => {
    const userKey = nacl.randomBytes(nacl.secretbox.keyLength)
    const userNonce = nacl.randomBytes(nacl.secretbox.nonceLength)
    const userKeyString = nacl.util.encodeBase64(userKey)
    const userNonceString = nacl.util.encodeBase64(userNonce)

    const delay = ms => {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
      })
    }

    const msg = nacl.util.encodeBase64(nacl.secretbox(nacl.util.decodeUTF8('verify'), userNonce, userKey))

    const txData = {
      txAction: 'SendTxParams',
      amount: 0,
      address: context.rootState.wallet.address,
      coinSymbol: 'BIP',
      feeCoinSymbol: 'BIP',
      message: msg
    }
    // console.log(msg, txData, axios, userKeyString, userNonceString)

    const postReg = (txHash) => {
      axios.post(`${context.state.httpApi}reg/${txHash}`, {
        'userKeyString': userKeyString,
        'userNonceString': userNonceString
      }).then(data => {
        if (data.data.address === context.rootState.wallet.address) {
          context.commit('SAVE_KEYS', data.data)
          context.dispatch('NEW_WS')
        }
      })
    }

    context.dispatch('SENDER', txData).then((txHash) => {
      delay(3000).then(() => {
        axios.get(`${context.rootState.api.explorerApi}transactions/${txHash}`).then(data => {
          postReg(txHash)
        }).catch(() => {
          delay(3500).then(() => {
            postReg(txHash)
          })
        })
      })
    })
  }
}