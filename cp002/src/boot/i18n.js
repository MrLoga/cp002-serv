// import Vue from 'vue'
// import VueI18n from 'vue-i18n'
// import messages from 'src/i18n'

// export default ({ app, Vue }) => {
//   Vue.use(VueI18n)
//   const i18n = new VueI18n({
//     locale: 'en-us',
//     fallbackLocale: 'en-us',
//     messages
//   })
//   // Set i18n instance on app
//   app.i18n = i18n
// }

// export { i18n }

import VueI18n from 'vue-i18n'
import messages from 'src/i18n'
let i18n
export default ({ app, Vue }) => {
  Vue.use(VueI18n)
  app.i18n = new VueI18n({
    locale: 'en-us',
    fallbackLocale: 'en-us',
    messages
  })
  i18n = app.i18n
}
export { i18n }
