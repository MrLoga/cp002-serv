
const routes = [
  {
    path: '/start',
    component: () => import('layouts/Start.vue')
  },
  {
    path: '/',
    component: () => import('layouts/Main.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'send', component: () => import('pages/Send.vue') },
      { path: 'qr-code', component: () => import('pages/QRcode.vue') },
      { path: 'requests', component: () => import('pages/Requests.vue') },
      { path: 'convert', component: () => import('pages/Convert.vue') },
      { path: 'setting', component: () => import('pages/setting/Index.vue') },
      { path: 'setting/private', component: () => import('pages/setting/Private.vue') },
      { path: 'authenticator', component: () => import('pages/Authenticator.vue') },
      { path: 'contacts', component: () => import('pages/Soon.vue') },
      { path: 'wallet', component: () => import('pages/Wallet.vue') },
      { path: 'soon', component: () => import('pages/Soon.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
