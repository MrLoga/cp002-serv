(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["572f35c0"],{3066:function(t,e,n){"use strict";n.r(e);var o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("q-page",[n("q-tabs",{staticClass:"bg-teal text-white shadow-2",attrs:{"inline-label":"","active-color":"white","indicator-color":"white"},model:{value:t.authTab,callback:function(e){t.authTab=e},expression:"authTab"}},[n("q-tab",{attrs:{name:"authorized",icon:"accessibility_new",label:"Authorized"}}),n("q-tab",{attrs:{name:"blocked",icon:"error",label:"Blocked"}})],1),n("q-tab-panels",{attrs:{animated:""},model:{value:t.authTab,callback:function(e){t.authTab=e},expression:"authTab"}},[n("q-tab-panel",{attrs:{name:"authorized"}},[Object.keys(t.getAuthorized).length?n("q-list",t._l(t.getAuthorized,(function(t){return n("auth-domen",{key:t.name,attrs:{item:t}})})),1):n("q-item-label",{attrs:{caption:""}},[t._v("No authorized")])],1),n("q-tab-panel",{attrs:{name:"blocked"}},[Object.keys(t.getBlocked).length?n("q-list",t._l(t.getBlocked,(function(t){return n("auth-domen",{key:t.name,attrs:{item:t}})})),1):n("q-item-label",{attrs:{caption:""}},[t._v("No blocked")])],1)],1)],1)},r=[],a=(n("8e6e"),n("8a81"),n("ac6a"),n("cadf"),n("06db"),n("456d"),n("c47a")),c=n.n(a),i=n("2f62"),s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("q-item",[n("q-item-section",[n("q-item-label",{attrs:{lines:"1"}},[n("img",{staticClass:"favicon-site",attrs:{src:"https://www.google.com/s2/favicons?domain="+t.item.name}}),t._v("\n       \n      "),n("span",{staticClass:"text-weight-medium"},[t._v(t._s(t.item.name))])])],1),n("q-item-section",{attrs:{side:""}},[n("div",{staticClass:"text-grey-8"},[n("q-btn",{attrs:{icon:"delete"},on:{click:t.remove}},[t._v("Remove")])],1)])],1)},l=[];n("7f7f");function u(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,o)}return n}function b(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?u(n,!0).forEach((function(e){c()(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):u(n).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var m={name:"Login",props:["item","name"],data:function(){return{}},methods:{remove:function(){var t={id:this.nonce,from:"wallet",to:"server",action:"remove-auth",requests:[this.item.name]};this.$store.dispatch("REQUESTS",t),this.$q.notify({message:"Access to requests is closed",icon:"tag_faces",color:"teal"})}},computed:b({},Object(i["c"])({nonce:function(t){return t.wallet.nonce}})),created:function(){},mounted:function(){}},p=m,f=(n("6bc9"),n("2877")),d=n("fe09"),h=Object(f["a"])(p,s,l,!1,null,null,null),O=h.exports;function g(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,o)}return n}function v(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?g(n,!0).forEach((function(e){c()(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):g(n).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}h.options.components=Object.assign({QItem:d["m"],QItemSection:d["o"],QItemLabel:d["n"],QBtn:d["d"]},h.options.components||{});var w={name:"Authenticator",components:{AuthDomen:O},data:function(){return{authTab:"authorized"}},computed:v({},Object(i["c"])({authDB:function(t){return t.auth.authDB}}),{},Object(i["b"])(["getAuthorized","getBlocked"])),methods:{registerAddress:function(){this.$store.dispatch("REGISTER_ADDRESS")},getAddress:function(){this.$store.dispatch("GET_ADDRESS")}},created:function(){}},y=w,j=Object(f["a"])(y,o,r,!1,null,null,null);e["default"]=j.exports;j.options.components=Object.assign({QPage:d["r"],QTabs:d["D"],QTab:d["A"],QTabPanels:d["C"],QTabPanel:d["B"],QList:d["q"],QItemLabel:d["n"]},j.options.components||{})},"6bc9":function(t,e,n){"use strict";var o=n("d0f0"),r=n.n(o);r.a},d0f0:function(t,e,n){}}]);