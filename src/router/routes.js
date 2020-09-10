
const routes = [
  {
    path: '/start',
    component: () => import('layouts/Start.vue'),
    children: [
      { path: '', component: () => import('pages/start/Index.vue'), props: true },
      { path: 'quick', component: () => import('pages/start/Quick.vue'), props: true },
      { path: 'login', component: () => import('pages/start/Login.vue'), props: true },
      { path: 'reg', component: () => import('pages/start/Register.vue'), props: true }
    ]
  },
  {
    path: '/wallet/:obsAddress?',
    component: () => import('layouts/Main.vue'),
    children: [
      { path: '', component: () => import('pages/Wallet.vue'), props: true }
    ]
  },
  {
    path: '/profile',
    component: () => import('layouts/Main.vue'),
    children: [
      { path: '', component: () => import('pages/profile/Profile.vue'), props: true },
      { path: 'sync', component: () => import('pages/profile/Registration.vue'), props: true },
      { path: 'reg', component: () => import('pages/profile/Registration.vue'), props: true },
      { path: 'login', component: () => import('pages/profile/Login.vue'), props: true }
    ]
  },
  // {
  //   path: '/',
  //   component: () => import('layouts/Main.vue'),
  //   children: [
  //     { path: '', component: () => import('pages/Index.vue') },
  //     { path: '/home', redirect: '/' }
  //   ]
  // },
  {
    path: '/',
    component: () => import('layouts/Main.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/home', redirect: '/' },
      // { path: 'home', component: () => import('pages/Index.vue') },
      { path: 'send', name: 'send', component: () => import('pages/Send.vue'), props: true },
      { path: 'qr-code', component: () => import('pages/QRcode.vue') },
      { path: 'requests', component: () => import('pages/Requests.vue') },
      { path: 'convert', component: () => import('pages/Convert.vue') },
      { path: 'setting', component: () => import('pages/setting/Index.vue') },
      { path: 'setting/private', component: () => import('pages/setting/Private.vue') },
      { path: 'services', component: () => import('pages/services/index.vue') },
      { path: 'authenticator', component: () => import('pages/Authenticator.vue') },
      { path: 'contacts', component: () => import('pages/ContactList.vue') },
      // { path: 'wallet', component: () => import('pages/Wallet.vue') },
      { path: 'transactions', component: () => import('pages/Transactions.vue') },
      { path: 'soon', component: () => import('pages/Soon.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    redirect: '/'
    // component: () => import('pages/Error404.vue')
  })
}

export default routes
