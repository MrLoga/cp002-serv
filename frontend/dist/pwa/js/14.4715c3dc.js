(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[14],{dd40:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("q-page",{attrs:{padding:""}},[t.wallet?a("q-card",{staticClass:"q-mb-lg q-mt-sm",attrs:{flat:"",bordered:""}},[a("q-card-section",[1===t.wallets.length?a("div",{staticStyle:{"font-size":"1.2rem"}},[a("b",[t._v(t._s(t.wallet.title))]),a("span",{staticClass:"text-grey-7"},[t._v(" ("+t._s(t.wallet.address.substr(0,4)+"..."+t.wallet.address.substr(-4))+")")])]):a("q-select",{staticClass:"q-mb-xs",attrs:{outlined:"",label:t.$t("Сhoose active wallet"),"bg-color":"white",behavior:"dialog",options:t.walletsSelect},scopedSlots:t._u([{key:"option",fn:function(e){return[a("q-item",t._g(t._b({},"q-item",e.itemProps,!1),e.itemEvents),[a("q-item-section",{staticClass:"q-ml-none",attrs:{top:"",avatar:""}},[a("q-avatar",{attrs:{"text-color":"primary"}},[e.opt.icon?a("q-img",{staticStyle:{height:"40px"},attrs:{src:e.opt.icon,"spinner-color":"primary","spinner-size":"sm"},scopedSlots:t._u([{key:"error",fn:function(){return[a("div",{staticClass:"avatar__text text-white bg-primary"},[t._v(t._s(e.opt.title[0]))])]},proxy:!0}],null,!0)}):a("q-icon",{attrs:{name:"person",color:"grey",size:"2rem"}})],1)],1),a("q-item-section",[a("q-item-label",{attrs:{lines:"1"},domProps:{innerHTML:t._s(e.opt.label)}}),a("q-item-label",{attrs:{caption:"",lines:"1"}},[t._v(t._s(e.opt.caption))])],1)],1),a("q-separator",{attrs:{inset:""}})]}}],null,!1,340354970),model:{value:t.wallet,callback:function(e){t.wallet=e},expression:"wallet"}}),t.balance&&t.balance.total_balance_sum?a("div",{staticClass:"q-mt-sm"},[a("div",[t._v(t._s(t.$t("Total balance")))]),a("b",[t._v(t._s(t.prettyNumber(t.balance.total_balance_sum,3))+" BIP")]),t.balance&&t.balance.total_balance_sum_usd?a("span",{staticClass:"text-grey-7"},[t._v("\n          (~ "+t._s(t.prettyNumber(t.balance.total_balance_sum_usd,2))+" usd)\n        ")]):t._e()]):t._e()],1),a("q-list",{attrs:{bordered:""}},[a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],attrs:{clickable:""},on:{click:t.copyAddress}},[a("q-item-section",{attrs:{avatar:""}},[a("q-icon",{attrs:{color:"blue",name:"file_copy"}})],1),a("q-item-section",[a("q-item-label",{staticClass:"text-subtitle2"},[t._v(t._s(t.$t("Copy address")))])],1)],1),a("q-separator",{attrs:{inset:""}}),a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],attrs:{clickable:""},on:{click:function(e){t.settingWalletDialog=!0}}},[a("q-item-section",{attrs:{avatar:""}},[a("q-icon",{attrs:{color:"blue-grey-14",size:"1.7rem",name:"settings"}})],1),a("q-item-section",[a("q-item-label",{staticClass:"text-subtitle2"},[t._v(t._s(t.$t("Wallet setting")))])],1)],1),a("q-dialog",{attrs:{"transition-show":"scale","transition-hide":"scale"},model:{value:t.settingWalletDialog,callback:function(e){t.settingWalletDialog=e},expression:"settingWalletDialog"}},[a("q-card",{staticClass:"dialog-min300"},[a("q-list",[t.wallet&&t.wallet.title?a("q-item",[a("q-item-section",{staticClass:"q-ml-none",attrs:{top:"",avatar:""}},[a("q-avatar",{attrs:{"text-color":"primary"}},[t.wallet.icon?a("q-img",{staticStyle:{height:"40px"},attrs:{src:t.wallet.icon,"spinner-color":"primary","spinner-size":"sm"},scopedSlots:t._u([{key:"error",fn:function(){return[a("q-icon",{attrs:{name:"person",color:"grey",size:"2rem"}})]},proxy:!0}],null,!1,987170336)}):a("q-icon",{attrs:{name:"person",color:"grey",size:"2rem"}})],1)],1),a("q-item-section",[a("q-item-label",{staticClass:"text-bold",attrs:{lines:"1"}},[t._v(t._s(t.wallet.title))]),a("q-item-label",{attrs:{caption:"",lines:"1"}},[t._v(t._s(t.wallet.caption))])],1)],1):t._e(),a("q-item-label",{staticClass:"q-pb-sm",attrs:{header:""}},[t._v(t._s(t.$t("Settings")))]),a("q-separator"),a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],attrs:{clickable:""},on:{click:function(e){t.settingWalletDialog=!1,t.showSeedDialog=!0}}},[a("q-item-section",{attrs:{avatar:""}},[a("q-icon",{attrs:{color:"orange",name:"visibility"}})],1),a("q-item-section",[a("q-item-label",{staticClass:"text-subtitle2"},[t._v(t._s(t.$t("Show seed phrase")))]),a("q-item-label",{attrs:{caption:""}},[t._v(t._s(t.$t("Keep it secret")))])],1)],1),a("q-separator",{attrs:{inset:""}}),a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],attrs:{clickable:""},on:{click:function(e){t.settingWalletDialog=!1,t.logoutDialog=!0}}},[a("q-item-section",{attrs:{avatar:""}},[a("q-icon",{attrs:{color:"deep-orange-14",name:"delete"}})],1),a("q-item-section",[a("q-item-label",{staticClass:"text-subtitle2"},[t._v(t._s(t.$t("Logout this wallet")))]),a("q-item-label",{attrs:{caption:""}},[t._v(t._s(t.$t("Data about wallet will be deleted")))])],1)],1)],1)],1)],1),a("q-dialog",{attrs:{"transition-show":"scale","transition-hide":"scale"},model:{value:t.showSeedDialog,callback:function(e){t.showSeedDialog=e},expression:"showSeedDialog"}},[a("q-card",{staticClass:"dialog-min300 q-pa-md",staticStyle:{"padding-bottom":"4px"}},[a("div",{staticClass:"text-subtitle1"},[t._v(t._s(t.wallet.mnemonic))]),a("q-separator",{staticClass:"q-mt-md q-mb-xs"}),a("q-card-actions",[a("q-btn",{attrs:{flat:"",dense:"",label:t.$t("Copy"),color:"primary"},on:{click:t.copyMnemonic}}),a("q-space"),a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",dense:"",label:t.$t("Close"),color:"primary"}})],1)],1)],1),a("q-dialog",{attrs:{"transition-show":"scale","transition-hide":"scale"},model:{value:t.logoutDialog,callback:function(e){t.logoutDialog=e},expression:"logoutDialog"}},[a("q-card",{staticClass:"dialog-min300 q-pa-md",staticStyle:{"padding-bottom":"4px"}},[a("div",{staticClass:"text-h6 text-center"},[t._v(t._s(t.$t("Attention")))]),a("div",{staticClass:"text-subtitle2 text-center"},[t._v(t._s(t.$t("Remove wallet text")))]),a("q-separator",{staticClass:"q-mt-md q-mb-xs"}),a("q-card-actions",[a("q-btn",{attrs:{flat:"",dense:"",label:t.$t("Remove wallet"),color:"red-10"},on:{click:t.removeWallet}}),a("q-space"),a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",dense:"",label:t.$t("Close"),color:"primary"}})],1)],1)],1)],1)],1):t._e(),a("q-tabs",{staticClass:"bg-teal text-white shadow-2",attrs:{"inline-label":"","active-color":"white","indicator-color":"white"},model:{value:t.balanceTab,callback:function(e){t.balanceTab=e},expression:"balanceTab"}},[a("q-tab",{attrs:{name:"balance",icon:"toll",label:t.$t("Balance")}}),a("q-tab",{attrs:{name:"delegations",icon:"work",label:t.$t("Delegations")}})],1),a("q-tab-panels",{attrs:{animated:""},model:{value:t.balanceTab,callback:function(e){t.balanceTab=e},expression:"balanceTab"}},[a("q-tab-panel",{attrs:{name:"balance"}},[a("q-list",t._l(t.balanceObj,(function(e,s){return a("q-item",{key:s,staticClass:"q-pl-none q-pr-none"},[a("q-item-section",{attrs:{avatar:""}},[a("q-avatar",{staticClass:"balance__coin-avatar",style:"background-color: "+t.stringToHSL(s),attrs:{"text-color":"white"}},[a("span",{staticClass:"balance__coin-letter"},[t._v(t._s(s.charAt(0).toUpperCase()))])])],1),a("q-item-section",[a("q-item-label",{staticClass:"text-bold"},[t._v(t._s(s))]),t.coinsInfo?a("q-item-label",{attrs:{caption:"",lines:"1"}},[t._v(t._s(t.coinsInfo[s].name))]):t._e()],1),a("q-item-section",{attrs:{side:""}},[t._v(t._s(t.prettyNumber(e,5)))])],1)})),1)],1),a("q-tab-panel",{staticClass:"q-pl-none q-pr-none",attrs:{name:"delegations"}},[t.delegations&&t.delegations.length?a("div",{staticClass:"delegations"},t._l(t.delegationsGroup,(function(e,s){return a("q-list",{key:s},[a("q-item",[a("q-item-section",{attrs:{avatar:""}},[a("q-avatar",[a("img",{attrs:{src:e[0].validator_meta.icon_url}})])],1),a("q-item-section",[a("q-item-label",{staticClass:"text-bold",attrs:{lines:"1"}},[t._v(t._s(e[0].validator_meta.name))]),a("q-item-label",{attrs:{caption:"",lines:"1"}},[t._v(t._s(e[0].validator_meta.description))])],1),a("q-item-section",{attrs:{side:""}},[a("div",{staticClass:"text-grey-7"},[a("q-btn",{attrs:{size:"1rem",flat:"",dense:"",round:"",icon:"add_circle_outline"},on:{click:function(a){return t.$router.push({name:"send",params:{import:{address:e[0].pub_key}}})}}})],1)])],1),a("q-separator",{attrs:{inset:""}}),t._l(e,(function(e){return a("q-item",{key:e.coin,attrs:{dense:""}},[a("q-item-section",[a("q-item-label",{staticClass:"text-bold text-grey-7",attrs:{lines:"1"}},[t._v(t._s(e.coin))])],1),a("q-item-section",{attrs:{side:""}},[t._v(t._s(t.prettyNumber(e.value,5)))])],1)})),a("q-separator",{staticClass:"q-mt-xs",staticStyle:{height:"1rem"},attrs:{color:"grey-2"}})],2)})),1):a("q-item-label",{attrs:{header:""}},[t._v(t._s(t.$t("No delegations")))])],1)],1)],1)},l=[],i=(a("8e6e"),a("8a81"),a("ac6a"),a("cadf"),a("06db"),a("456d"),a("c47a")),n=a.n(i),o=(a("20d6"),a("2f62")),r=a("ed08"),c=a("cdde");function d(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);e&&(s=s.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,s)}return a}function m(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?d(Object(a),!0).forEach((function(e){n()(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):d(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}var p={name:"Wallet",data:function(){return{wallet:null,currentWallet:null,currentProfile:null,settingWalletDialog:!1,showSeedDialog:!1,logoutDialog:!1,balanceTab:"balance"}},created:function(){var t=this,e=this.walletsSelect.findIndex((function(e){return e.address===t.address}));this.wallet=this.walletsSelect[e]},methods:{prettyNumber:function(t,e){return Object(r["d"])(t,e)},stringToHSL:function(t){return Object(r["e"])(t)},copyAddress:function(){var t=this;Object(c["a"])(this.wallet.address).then((function(){t.$q.notify({message:t.$t("Address copied"),color:"purple",position:"bottom",timeout:400})})).catch((function(){}))},copyMnemonic:function(){var t=this;Object(c["a"])(this.wallet.mnemonic).then((function(){t.$q.notify({message:t.$t("Seed phrase copied"),color:"purple",position:"bottom",timeout:400})})).catch((function(){}))},removeWallet:function(){this.logoutDialog=!1,this.$store.commit("REMOVE_WALLET",this.wallet.address),this.wallet=this.walletsSelect[0]}},computed:m({},Object(o["c"])({address:function(t){return t.wallet.address},wallets:function(t){return t.wallet.wallets},activeWallet:function(t){return t.wallet.active},balance:function(t){return t.api.balance},delegations:function(t){return t.api.delegations}}),{},Object(o["b"])(["balanceObj","delegationsGroup","coinsInfo","walletsSelect","findWallet","findUser"])),watch:{wallet:function(t){t&&t.address&&(this.wallet=t,this.$store.commit("SET_WALLET",t.address),this.$store.dispatch("FETCH_BALANCE"),this.$store.dispatch("FETCH_DELEGATION"))}}},b=p,u=a("2877"),q=a("eebe"),_=a.n(q),g=a("9989"),v=a("f09f"),f=a("a370"),w=a("ddd8"),h=a("66e5"),y=a("4074"),C=a("cb32"),x=a("068f"),S=a("0016"),k=a("0170"),O=a("eb85"),$=a("1c1c"),D=a("24e8"),T=a("4b7e"),j=a("9c40"),Q=a("2c91"),P=a("429b"),W=a("7460"),E=a("adad"),N=a("823b"),A=a("714f"),L=a("7f67"),I=Object(u["a"])(b,s,l,!1,null,null,null);e["default"]=I.exports;_()(I,"components",{QPage:g["a"],QCard:v["a"],QCardSection:f["a"],QSelect:w["a"],QItem:h["a"],QItemSection:y["a"],QAvatar:C["a"],QImg:x["a"],QIcon:S["a"],QItemLabel:k["a"],QSeparator:O["a"],QList:$["a"],QDialog:D["a"],QCardActions:T["a"],QBtn:j["a"],QSpace:Q["a"],QTabs:P["a"],QTab:W["a"],QTabPanels:E["a"],QTabPanel:N["a"]}),_()(I,"directives",{Ripple:A["a"],ClosePopup:L["a"]})}}]);