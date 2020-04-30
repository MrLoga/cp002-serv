// import { i18n } from 'boot/i18n'
import axios from 'axios'

const getDefaultState = () => {
  return {
    minterscanApi: 'https://minterscan.pro/',
    contacts: [],
    profiles: []
  }
}
const state = getDefaultState()

const getters = {
  filterContacts: state => searchVal => state.contacts.filter(item => item.title && item.title.toLowerCase().indexOf(searchVal.toLowerCase()) > -1),
  findContact: state => address => state.contacts.find(item => item.address && item.address === address),
  filterProfiles: state => searchVal => state.profiles.filter(item => item.title && item.title.toLowerCase().indexOf(searchVal.toLowerCase()) > -1),
  findProfile: state => address => state.profiles.find(item => item.address && item.address === address),
  findUser: (state, getters, rootState) => address => {
    if (address.substring(0, 2) === 'Mx' && address.length === 42) {
      const contact = state.contacts.find(item => item.address && item.address === address)
      if (contact && contact.title && contact.title !== '') {
        contact.type = 'contact'
        return contact
      } else {
        const profile = state.profiles.find(item => item.address && item.address === address)
        if (profile && profile.title) {
          profile.type = 'minterscan'
          return profile
        } else {
          const wallet = rootState.wallet.wallets.find(item => item.address === address)
          if (wallet && wallet.title) {
            wallet.type = 'wallet'
            wallet.caption = address.substr(0, 6) + '...' + address.substr(-6)
            return wallet
          } else {
            return {
              title: address.substr(0, 6) + '...' + address.substr(-6),
              address: address,
              caption: 'Profile not found',
              icon: null
            }
          }
        }
      }
    } else return null
  }
}

const mutations = {
  RESET_CONTACTS: state => {
    Object.assign(state, getDefaultState())
  },
  REMOVE_CONTACT: (state, payload) => {
    const itemId = state.contacts.findIndex(item => item.address === payload)
    state.contacts.splice(itemId, 1)
  },
  ADD_CONTACT: (state, payload) => {
    state.contacts.push(payload)
  },
  SET_PROFILES: (state, payload) => {
    state.profiles = payload
  }
}

const actions = {
  NEW_CONTACT: (context, payload) => {
    return new Promise((resolve, reject) => {
      const findContact = context.state.contacts.filter(item => item.address.toLowerCase() === payload.address.toLowerCase())
      if (!findContact.length) {
        resolve(payload)
      } else {
        reject(findContact)
      }
    })
  },
  FETCH_ALL_PROFILES: async (context, payload) => {
    const { data } = await axios.get(`${ state.minterscanApi }profiles`)
    context.commit('SET_PROFILES', data)
  },
  GET_PROFILE: async (context, payload) => {
    const { data } = await axios.get(`${ state.minterscanApi }profiles/${ payload }`)
    return data
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}