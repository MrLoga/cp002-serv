import { i18n } from 'boot/i18n'

const getDefaultState = () => {
  return {
    rightMenu: false,
    language: 'en-us',
    dataUpdateDate: null,
    menu: 'header'
  }
}
export const state = getDefaultState()

export const getters = {
  // isLogin: state => (!!state.address && !!state.address.length),
}

export const mutations = {
  RESET_APP: state => {
    Object.assign(state, getDefaultState())
  },
  SET_MENU: (state, payload) => {
    state.rightMenu = payload
  },
  SET_UPDATE_DATE: (state, payload) => {
    state.dataUpdateDate = payload
  },
  SET_MAIN_MENU: (state, payload) => {
    state.menu = payload
  },
  SET_LANG: (state, payload) => {
    i18n.locale = payload
    state.language = payload
  }
}

export const actions = {
  // s
}
