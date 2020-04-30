(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[16],{d508:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("q-page",{attrs:{padding:""}},[a("q-list",[a("q-item-label",{attrs:{header:""}},[t._v(t._s(t.$t("Interface")))]),a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],attrs:{clickable:""},on:{click:t.changeMainMenu}},[a("q-item-section",{attrs:{avatar:""}},[a("q-avatar",{attrs:{color:"teal","text-color":"white",icon:"swap_vert"}})],1),a("q-item-section",[a("q-item-label",[t._v(t._s(t.$t("Move menu")))]),a("q-item-label",{attrs:{caption:""}},[t._v("\n          "+t._s(t.menu)+"\n        ")])],1)],1),a("q-separator",{staticClass:"q-mb-sm q-mt-sm",attrs:{inset:""}}),a("q-item-label",{attrs:{header:""}},[t._v(t._s(t.$t("General")))]),a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],attrs:{clickable:""},on:{click:function(e){t.alertLang=!0}}},[a("q-item-section",{attrs:{avatar:""}},[a("q-avatar",{attrs:{color:"teal","text-color":"white",icon:"language"}})],1),a("q-item-section",[a("q-item-label",[t._v(t._s(t.$t("Change language")))]),a("q-item-label",{attrs:{caption:""}},[t._v("\n          "+t._s(t.$t("Available"))+": English, Russin\n        ")])],1),a("q-item-section",{attrs:{avatar:""}},[a("q-avatar",{attrs:{color:"deep-purple",size:"28px","text-color":"white"}},[t._v(t._s(t.language.substr(0,2)))])],1)],1),a("q-dialog",{model:{value:t.alertLang,callback:function(e){t.alertLang=e},expression:"alertLang"}},[a("q-card",{staticClass:"dialog-min300"},[a("q-card-section",[a("div",{staticClass:"text-h6"},[t._v(t._s(t.$t("Choose a language")))])]),a("q-card-section",[a("q-list",t._l(t.languageList,(function(e){return a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],key:e.value,attrs:{tag:"label"}},[a("q-item-section",{attrs:{avatar:""}},[a("q-radio",{attrs:{val:e.value,color:"teal"},model:{value:t.language,callback:function(e){t.language=e},expression:"language"}})],1),a("q-item-section",[a("q-item-label",[t._v(t._s(e.label))])],1)],1)})),1)],1),a("q-card-actions",{attrs:{align:"right"}},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"OK",color:"primary"}})],1)],1)],1),a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],attrs:{clickable:""},on:{click:t.logout}},[a("q-item-section",{attrs:{avatar:""}},[a("q-avatar",{attrs:{color:"teal","text-color":"white",icon:"power_settings_new"}})],1),a("q-item-section",[a("q-item-label",[t._v(t._s(t.$t("Logout app")))]),a("q-item-label",{attrs:{caption:""}},[t._v("\n          "+t._s(t.$t("All data will be deleted from this device"))+"\n        ")])],1)],1)],1)],1)},n=[],r=(a("8e6e"),a("8a81"),a("ac6a"),a("cadf"),a("06db"),a("456d"),a("c47a")),l=a.n(r),o=(a("28a5"),a("29c9")),s=a("2f62"),c=a("cdde");function u(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,i)}return a}function m(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?u(Object(a),!0).forEach((function(e){l()(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):u(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}var p={name:"Settings",data:function(){return{alertLang:!1,languageList:[{label:"English",value:"en-us"},{label:"Russian",value:"ru"}]}},methods:{changeMainMenu:function(){this.menu="header"===this.menu?"footer":"header"},sendWallet:function(){var t=this.mnemonic.split(" ").map((function(t){return o["wordlists"].english.indexOf(t)})).join("."),e=location.origin+"/#/hello?key="+t+"&action=wallet";Object(c["a"])(e),navigator.share?this.$q.dialog({title:this.$t("Link to wallet is ready"),message:this.$t("Link copied to your clipboard"),html:!0,cancel:{label:this.$t("Close"),color:"primary",flat:!0},ok:{label:this.$t("Share"),icon:"share"},persistent:!1}).onOk((function(){navigator.share({title:"Wallet link",text:"Link to wallet https://wallet.reef.mn/",url:e}).then((function(){return console.log("Successful share")})).catch((function(t){return console.log("Error sharing",t)}))})).onCancel((function(){})):this.$q.dialog({title:this.$t("Link to wallet is ready"),message:this.$t("Link copied to your clipboard"),html:!0,cancel:{label:this.$t("Close"),color:"primary",flat:!0},ok:!1})},logout:function(){var t=this;setTimeout((function(){t.$store.commit("RESET_API"),t.$store.commit("RESET_APP"),t.$store.commit("RESET_WALLET"),t.$store.commit("RESET_REQUEST"),t.$store.commit("RESET_CONTACTS"),t.$router.push({path:"/start"})}),150)}},computed:m({},Object(s["c"])({mnemonic:function(t){return t.wallet.mnemonic}}),{language:{get:function(){return this.$store.state.app.language},set:function(t){this.$store.commit("SET_LANG",t)}},menu:{get:function(){return this.$store.state.app.menu},set:function(t){this.$store.commit("SET_MAIN_MENU",t)}}})},g=p,d=a("2877"),h=a("eebe"),v=a.n(h),b=a("9989"),f=a("1c1c"),q=a("66e5"),_=a("4074"),w=a("cb32"),$=a("0170"),O=a("eb85"),k=a("24e8"),E=a("f09f"),y=a("a370"),L=a("3786"),S=a("4b7e"),j=a("9c40"),C=a("714f"),Q=a("7f67"),P=Object(d["a"])(g,i,n,!1,null,null,null);e["default"]=P.exports;v()(P,"components",{QPage:b["a"],QList:f["a"],QItem:q["a"],QItemSection:_["a"],QAvatar:w["a"],QItemLabel:$["a"],QSeparator:O["a"],QDialog:k["a"],QCard:E["a"],QCardSection:y["a"],QRadio:L["a"],QCardActions:S["a"],QBtn:j["a"]}),v()(P,"directives",{Ripple:C["a"],ClosePopup:Q["a"]})}}]);