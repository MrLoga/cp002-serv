import axios from 'axios'
import { strapiMessage } from '../../utils/error'
import { i18n } from '../../boot/i18n'
import { Notify } from 'quasar'

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
        // contact.type = 'contact'
        return contact
      } else {
        const profile = state.profiles.find(item => item.address && item.address === address)
        if (profile && profile.title) {
          // profile.type = 'minterscan'
          return profile
        } else {
          const wallet = rootState.wallet.wallets.find(item => item.address === address)
          if (wallet && wallet.title) {
            // wallet.type = 'wallet'
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
  },
  UPDATE_CONTACTS: (state, payload) => {
    state.contacts = payload
  }
}

const actions = {
  // NEW_CONTACT: (context, payload) => {
  //   return new Promise((resolve, reject) => {
  //     const findContact = context.state.contacts.filter(item => item.address.toLowerCase() === payload.address.toLowerCase())
  //     if (!findContact.length) {
  //       resolve(payload)
  //     } else {
  //       reject(findContact)
  //     }
  //   })
  // },
  FETCH_ALL_PROFILES: async (context, payload) => {
    try {
      const { data } = await axios.get(`${ state.minterscanApi }profiles`)
      context.commit('SET_PROFILES', data)
    } catch (error) {
      const { data } = await axios.get('https://api.charity.cloudp.group/mscanprofiles')
      context.commit('SET_PROFILES', data)
    }
  },
  GET_PROFILE: async (context, payload) => {
    try {
      const { data } = await axios.get(`${ state.minterscanApi }profiles/${ payload }`)
      return data
    } catch (error) {
      return null
    }
  },
  REMOVE_USER_CONTACTS: async ({ state, rootState, commit }, payload) => {
    try {
      if (rootState.user.jwt) {
        await axios.put(`${ rootState.user.backendApi }user-data/pull-contact`, { address: payload }, rootState.user.httpConfig)
      }
      commit('REMOVE_CONTACT', payload)
      Notify.create({
        progress: true,
        message: i18n.t('Contact removed'),
        type: 'positive',
        position: 'bottom'
      })
    } catch (error) {
      Notify.create({
        progress: true,
        message: strapiMessage(error),
        type: 'negative',
        position: 'bottom'
      })
    }
  },
  SAVE_USER_CONTACTS: async ({ state, rootState, commit, getters }, payload) => {
    try {
      if (rootState.user.jwt) {
        await axios.put(`${ rootState.user.backendApi }user-data/push-contact`, payload, rootState.user.httpConfig)
      }
      const user = getters.findProfile(payload.address)
      payload.icon = (user && user.icon) ? user.icon : null
      commit('ADD_CONTACT', payload)
      Notify.create({
        progress: true,
        message: i18n.t('Contact added'),
        type: 'positive',
        position: 'bottom'
      })
    } catch (error) {
      Notify.create({
        progress: true,
        message: strapiMessage(error),
        type: 'negative',
        position: 'bottom'
      })
    }
  },
  SYNC_USER_CONTACTS: async ({ state, rootState, commit, getters }, payload) => {
    const sendUserData = () => {
      return {
        contacts: state.contacts.map(item => {
          return {
            title: item.title,
            address: item.address
          }
        }),
        wallets: rootState.wallet.observer.map(item => {
          return {
            title: item.title,
            address: item.address
          }
        })
      }
    }
    try {
      const { data } = await axios.get(`${ rootState.user.backendApi }user-data`, rootState.user.httpConfig)
      if (data.wallets && data.wallets.length) {
        commit('UPDATE_OBSERVER', data.wallets, { root: true })
      }
      if (data.contacts && data.contacts.length) {
        const contactsWithIcon = data.contacts.map(item => {
          const user = getters.findProfile(item.address)
          return {
            ...item,
            icon: (user && user.icon) ? user.icon : null
          }
        })
        commit('UPDATE_CONTACTS', contactsWithIcon)
      }
      if (!(data.contacts && data.contacts.length) || !(data.wallets && data.wallets.length)) {
        await axios.put(`${ rootState.user.backendApi }user-data`, sendUserData(), rootState.user.httpConfig)
      }
      return data
    } catch (error) {
      console.log(error.response)
      if (state.contacts.length) {
        if (error.response && error.response.data.statusCode === 404) {
          await axios.post(`${ rootState.user.backendApi }user-data`, sendUserData(), rootState.user.httpConfig)
        }
      }
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
