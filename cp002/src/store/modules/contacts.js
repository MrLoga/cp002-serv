// import { i18n } from 'boot/i18n'

const getDefaultState = () => {
  return {
    contactList: []
  }
}
const state = getDefaultState()

const getters = {
  filterContacts: state => searchVal => state.contactList.filter(v => v.name.toLowerCase().indexOf(searchVal.toLowerCase()) > -1),
  findByAddress: state => address => state.contactList.find(item => item.address === address)
}

const mutations = {
  RESET_CONTACTS: state => {
    Object.assign(state, getDefaultState())
  },
  REMOVE_CONTACT: (state, payload) => {
    let itemId = state.contactList.findIndex(item => item.address === payload)
    console.log(itemId)
    state.contactList.splice(itemId, 1)
  },
  ADD_CONTACT: (state, payload) => state.contactList.push(payload)
}

const actions = {
  NEW_CONTACT: (context, payload) => {
    return new Promise((resolve, reject) => {
      let findContact = context.state.contactList.filter(v => v.address.toLowerCase() === payload.address.toLowerCase())
      if (!findContact.length) {
        resolve(payload)
      } else {
        reject(findContact)
      }
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
