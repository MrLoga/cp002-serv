(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[9],{1667:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("q-page",{attrs:{padding:""}},[a("form",{staticClass:"q-pt-sm",on:{submit:function(e){e.preventDefault(),e.stopPropagation(),t.confirmSend=!0}}},[a("div",{staticClass:"q-gutter-md"},[a("AddressSearch",{attrs:{hasPopupAddress:!0},model:{value:t.address,callback:function(e){t.address=e},expression:"address"}}),a("BalanceSelect",{model:{value:t.coin,callback:function(e){t.coin=e},expression:"coin"}}),a("q-input",{attrs:{type:"number",step:"any",outlined:"",clearable:"",debounce:"250","bg-color":"white",spellcheck:!1,label:t.$t("Amount"),error:t.amountIsError,"error-message":t.amountErrorMsg},scopedSlots:t._u([{key:"after",fn:function(){return[a("q-btn",{attrs:{round:"","no-caps":"",flat:"",label:"Max"},on:{click:t.maxAmount}})]},proxy:!0}]),model:{value:t.amount,callback:function(e){t.amount=e},expression:"amount"}}),a("div",[a("q-btn",{staticClass:"full-width",attrs:{type:"submit",color:"teal",size:"16px",disabled:!t.validate}},[a("q-icon",{attrs:{left:"",name:"send"}}),t._v("\n          "+t._s("DELEGATE"===t.txType?t.$t("Delegate"):t.$t("Send"))+"\n        ")],1)],1),t.validate?t._e():a("div",{staticClass:"text-negative"},[t._v(t._s(t.validateError))]),a("div",{staticClass:"text-grey-7"},[t._v("\n        "+t._s(t.$t("Transaction fee"))+": "+t._s(t.prettyNumber(t.commission,5))+" "+t._s(t.commissionCoin)+"\n      ")])],1)]),a("q-dialog",{attrs:{persistent:"","full-width":"","transition-show":"scale","transition-hide":"scale"},model:{value:t.confirmSend,callback:function(e){t.confirmSend=e},expression:"confirmSend"}},[a("q-card",{staticStyle:{"max-width":"440px !important"}},[a("q-card-section",{staticStyle:{"text-align":"center"}},[a("div",{staticClass:"text-h5 text-grey-7"},[t._v(t._s(t.$t("You are"))+" "+t._s("DELEGATE"===t.txType?t.$t("Delegate dialog"):t.$t("Send dialog")))]),t.coin&&t.coin.value?a("div",{staticClass:"text-h6"},[t._v(t._s(t.prettyNumber(t.amountBig.toString(),5))+" "),a("b",[t._v(t._s(t.coin.value))])]):t._e()]),a("q-card-section",{staticClass:"row justify-center items-center q-pt-none"},[t.profile&&t.profile.icon?a("q-avatar",[a("img",{attrs:{src:t.profile.icon}})]):a("q-icon",{staticStyle:{color:"#ccc"},attrs:{size:"xl",name:"DELEGATE"===t.txType?"developer_board":"account_circle"}}),t.profile&&t.profile.title?a("span",{staticClass:"q-ml-sm"},[t._v("\n          "+t._s(t.profile.title)+"\n          "),t.address&&t.address.address?a("div",{staticClass:"text-grey-7"},[t._v(t._s(t.address.address.substr(0,4)+"..."+t.address.address.substr(-4)))]):t._e()]):t._e()],1),a("q-separator",{attrs:{inset:""}}),a("q-card-actions",{attrs:{align:"around"}},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:t.$t("Cancel"),color:"red"}}),a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:t.$t("Accept"),color:"primary"},on:{click:t.sender}})],1)],1)],1)],1)},n=[],i=(a("8e6e"),a("8a81"),a("ac6a"),a("cadf"),a("456d"),a("c47a")),o=a.n(i),r=(a("a481"),a("967e")),c=a.n(r),l=(a("96cf"),a("fa84")),d=a.n(l),u=(a("6b54"),a("06db"),a("158a")),p=a("b862"),m=a("2f62"),f=a("ed08"),h=a("9dcd"),b=a.n(h),v=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("q-input",{attrs:{outlined:"",spellcheck:!1,clearable:"","bottom-slots":"",debounce:"250","bg-color":"white",label:t.$t("Mx address or Mp public key")},scopedSlots:t._u([{key:"hint",fn:function(){return[a("div",{staticClass:"text-overflow"},[t._v(t._s(t.addressHint))])]},proxy:!0},t.hasPopupAddress?{key:"after",fn:function(){return[a("q-btn",{staticClass:"cursor-pointer",attrs:{flat:"",round:"",icon:"format_list_bulleted"},on:{click:function(e){t.popupAddress=!0}}})]},proxy:!0}:null,t.addressTo&&t.addressProfilesShow?{key:"default",fn:function(){return[a("q-virtual-scroll",{staticClass:"contacts__filter",staticStyle:{"max-height":"300px"},attrs:{items:t.contactsFilter,separator:""},scopedSlots:t._u([{key:"default",fn:function(e){var s=e.item,n=e.index;return[a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"},{name:"close-popup",rawName:"v-close-popup"}],key:n,staticClass:"q-pl-none q-pr-none",attrs:{clickable:""},on:{click:function(e){t.addressTo=s.address}}},[a("q-item-section",{staticClass:"q-ml-none",attrs:{top:"",avatar:""}},[a("q-avatar",{attrs:{"text-color":"primary"}},[s.icon&&t.checkIcon(s.icon)?a("q-img",{staticStyle:{height:"40px"},attrs:{src:s.icon,"spinner-color":"primary","spinner-size":"sm"},scopedSlots:t._u([{key:"error",fn:function(){return[a("div",{staticClass:"avatar__text text-white bg-primary"},[t._v(t._s(s.title[0]))])]},proxy:!0}],null,!0)}):a("div",{staticClass:"avatar__text text-white bg-primary"},[t._v(t._s(s.title[0]))])],1)],1),a("q-item-section",[a("q-item-label",[t._v(t._s(s.title))]),a("q-item-label",{attrs:{caption:"",lines:"1"}},[t._v(t._s(s.address))])],1)],1)]}}],null,!1,2981727973)})]},proxy:!0}:null],null,!0),model:{value:t.addressTo,callback:function(e){t.addressTo=e},expression:"addressTo"}}),a("q-dialog",{attrs:{"full-width":"","transition-show":"scale","transition-hide":"scale"},model:{value:t.popupAddress,callback:function(e){t.popupAddress=e},expression:"popupAddress"}},[a("q-card",{staticStyle:{height:"60vh"}},[a("q-tabs",{staticClass:"bg-light-blue-9 text-white shadow-2",attrs:{"inline-label":"","active-color":"white","indicator-color":"white"},model:{value:t.popupAddressTab,callback:function(e){t.popupAddressTab=e},expression:"popupAddressTab"}},[a("q-tab",{attrs:{name:"addressSelectTab",icon:"supervisor_account",label:t.$t("Contacts")}}),a("q-tab",{attrs:{name:"validatorsSelectTab",icon:"work",label:t.$t("Validators")}})],1),a("q-tab-panels",{attrs:{animated:""},model:{value:t.popupAddressTab,callback:function(e){t.popupAddressTab=e},expression:"popupAddressTab"}},[a("q-tab-panel",{attrs:{name:"addressSelectTab"}},[t.contacts&&t.contacts.length>0?a("q-virtual-scroll",{staticStyle:{"max-height":"50vh"},attrs:{items:t.contacts,separator:""},scopedSlots:t._u([{key:"default",fn:function(e){var s=e.item,n=e.index;return[a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"},{name:"close-popup",rawName:"v-close-popup"}],key:n,staticClass:"q-pl-none q-pr-none",attrs:{clickable:""},on:{click:function(e){t.addressTo=s.address}}},[a("q-item-section",{staticClass:"q-ml-none",attrs:{top:"",avatar:""}},[a("q-avatar",{attrs:{color:"primary","text-color":"white"}},[t._v("\n                    "+t._s(s.title[0])+"\n                  ")])],1),a("q-item-section",[a("q-item-label",[t._v(t._s(s.title))]),a("q-item-label",{attrs:{caption:"",lines:"1"}},[t._v(t._s(s.address))])],1)],1)]}}],null,!1,3814497363)}):a("div",{staticClass:"flex flex-center"},[a("div",{staticClass:"self-center text-h5 text-center"},[t._v("\n              "+t._s(t.$t("You dont have any saved contacts"))),a("br"),a("q-btn",{staticClass:"q-mt-lg",attrs:{to:"/contacts",color:"primary",label:t.$t("Add first contact")}})],1)])],1),a("q-tab-panel",{attrs:{name:"validatorsSelectTab"}},[a("q-virtual-scroll",{staticStyle:{"max-height":"50vh"},attrs:{items:t.validatorsSelect,separator:""},scopedSlots:t._u([{key:"default",fn:function(e){var s=e.item,n=e.index;return[a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"},{name:"close-popup",rawName:"v-close-popup"}],key:n,staticClass:"q-pl-none q-pr-none",attrs:{clickable:""},on:{click:function(e){t.addressTo=s.value}}},[a("q-item-section",{staticClass:"q-ml-none",attrs:{top:"",avatar:""}},[a("q-avatar",{attrs:{"text-color":"primary"}},[s.icon?a("q-img",{staticStyle:{height:"40px"},attrs:{src:s.icon,"spinner-color":"primary","spinner-size":"sm"},scopedSlots:t._u([{key:"error",fn:function(){return[a("div",{staticClass:"avatar__text text-white bg-primary"},[t._v(t._s(s.label[0]))])]},proxy:!0}],null,!0)}):a("div",{staticClass:"avatar__text text-white bg-primary"},[t._v(t._s(s.label[0]))])],1)],1),a("q-item-section",[a("q-item-label",[t._v(t._s(s.label))]),a("q-item-label",{attrs:{caption:"",lines:"2"}},[t._v(t._s(s.desc))])],1),a("q-item-section",{attrs:{side:"",top:""}},[a("q-badge",{attrs:{label:t.pretty(s.part,2)}})],1)],1)]}}])})],1)],1)],1)],1)],1)},g=[];a("7f7f"),a("6762"),a("2fdb");function y(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);e&&(s=s.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,s)}return a}function _(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?y(Object(a),!0).forEach((function(e){o()(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):y(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}var x={name:"AddressSearch",props:{value:Object,hasPopupAddress:Boolean},data:function(){return{addressTo:this.value.address,addressHint:"",popupAddressTab:"addressSelectTab",popupAddress:!1,contactsFilter:null,profileTo:null,addressProfilesShow:!1}},created:function(){},methods:{pretty:function(t,e){return Object(f["c"])(t,e)},checkIcon:function(t){return!t.includes("file://")&&!t.includes("javascript:")&&!t.includes(".js")},handleInput:function(){this.$emit("input",{address:this.addressTo,profile:this.profileTo})},findAddress:function(t){if("Mx"===t.substring(0,2)&&42===t.length){var e=this.findUser(t);e&&(this.addressHint=e.title,this.profileTo={title:e.title,icon:e.icon})}else if("Mp"===t.substring(0,2)&&66===t.length){var a=this.findValidator(t);a&&a.meta.name?(this.addressHint=a.meta.name,this.profileTo={title:a.meta.name,icon:a.meta.icon_url}):this.profileTo={}}else this.addressHint=" ",this.profileTo={}}},computed:_({},Object(m["c"])({requests:function(t){return t.request.requests},validators:function(t){return t.api.validators},contacts:function(t){return t.contacts.contacts},profiles:function(t){return t.contacts.profiles}}),{},Object(m["b"])(["findValidator","validatorsSelect","filterContacts","filterProfiles","filterValidator","findContact","findProfile","findUser"])),watch:{value:function(t){this.addressTo=t.address},addressTo:function(t){if(this.addressProfilesShow=!1,null===t)this.addressHint="";else if("Mx"===t.substr(0,2)||"Mp"===t.substr(0,2))this.findAddress(t);else if(t.length>1){var e=this.filterContacts(t).concat(this.filterValidator(t)).concat(this.filterProfiles(t));this.contactsFilter=e,this.contactsFilter&&this.contactsFilter.length?this.addressProfilesShow=!0:this.addressProfilesShow=!1}else this.addressProfilesShow=!1;this.handleInput()}}},q=x,S=a("2877"),O=a("eebe"),w=a.n(O),T=a("27f9"),C=a("9c40"),j=a("a12b"),k=a("66e5"),P=a("4074"),E=a("cb32"),A=a("068f"),D=a("0170"),I=a("24e8"),Q=a("f09f"),$=a("429b"),B=a("7460"),N=a("adad"),M=a("823b"),F=a("58a8"),L=a("714f"),H=a("7f67"),G=Object(S["a"])(q,v,g,!1,null,null,null),V=G.exports;w()(G,"components",{QInput:T["a"],QBtn:C["a"],QVirtualScroll:j["a"],QItem:k["a"],QItemSection:P["a"],QAvatar:E["a"],QImg:A["a"],QItemLabel:D["a"],QDialog:I["a"],QCard:Q["a"],QTabs:$["a"],QTab:B["a"],QTabPanels:N["a"],QTabPanel:M["a"],QBadge:F["a"]}),w()(G,"directives",{Ripple:L["a"],ClosePopup:H["a"]});var z=a("8973");function U(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);e&&(s=s.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,s)}return a}function J(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?U(Object(a),!0).forEach((function(e){o()(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):U(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}var R={name:"Send",components:{AddressSearch:V,BalanceSelect:z["a"]},props:{import:Object},data:function(){return{address:{address:null,profile:null},coin:null,amount:null,amountBig:null,amountIsError:!1,amountErrorMsg:null,payload:null,validate:!1,validateError:null,txType:"SEND",confirmSend:!1,commission:0,commissionCoin:"BIP",profile:null}},created:function(){},mounted:function(){this.import&&""!==this.import.address&&(this.address={address:this.import.address}),this.coin||this.setDefaultCoin()},methods:{prettyNumber:function(t,e){return Object(f["d"])(t,e)},setDefaultCoin:function(){b()(this.balanceSelect[0].amount).gt(0)?this.coin=this.balanceSelect[0]:this.coin=this.balanceSelect[1]?this.balanceSelect[1]:this.balanceSelect[0]},maxAmount:function(){this.amount=this.coin?b()(this.coin.amount).toString():null},clearForm:function(){this.address={address:null},this.coin=null,this.amount=null,this.commission=0,this.commissionCoin="BIP"},makeTxData:function(){var t={type:this.txType,data:{coin:this.coin.value},payload:this.payload,gasCoin:this.commissionCoin};return"SEND"===this.txType?(t.data.value=this.amountBig.toString(),t.data.to=this.address.address):"DELEGATE"===this.txType&&(t.data.stake=this.amountBig.toString(),t.data.publicKey=this.address.address),t},updateFee:function(){var t=this;return d()(c.a.mark((function e(){var a,s;return c.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(a=Object(u["e"])(p["b"][t.txType],{payload:t.payload}),"BIP"!==t.coin.value){e.next=7;break}b()(t.coin.amount).lt(t.amountBig.plus(a))&&(t.amountBig=b()(t.coin.amount).minus(a)),t.commission=a,t.commissionCoin="BIP",e.next=25;break;case 7:if(!b()(t.balanceObj.BIP).lt(a)){e.next=23;break}return e.prev=8,s=t.makeTxData(),s.gasCoin=t.coin.value,t.commissionCoin=t.coin.value,e.next=14,t.$store.dispatch("GET_COMMISSION",s);case 14:t.commission=e.sent,b()(t.coin.amount).lt(t.amountBig.plus(t.commission))&&(t.amountBig=b()(t.coin.amount).minus(t.commission)),e.next=21;break;case 18:e.prev=18,e.t0=e["catch"](8),console.log(e.t0);case 21:e.next=25;break;case 23:t.commission=a,t.commissionCoin="BIP";case 25:case"end":return e.stop()}}),e,null,[[8,18]])})))()},validateForm:function(){this.amountIsError=!1,this.amountErrorMsg=null,this.validate=!0,this.validateError=null,this.amountBig=this.amount?b()(this.amount.replace(",",".")):b()(0);var t=Object(f["a"])(this.address?this.address.address:null);this.profile=this.address?this.address.profile:null,"Mx"===t&&(this.txType="SEND"),"Mp"===t&&(this.txType="DELEGATE"),!this.amount||this.coin&&this.amountBig&&this.amountBig.lte(this.coin.amount)||(this.amountIsError=!0,this.amountErrorMsg=this.$t("Not enough")+" ".concat(this.amountBig.minus(this.coin.amount).round(5,0)," ").concat(this.coin.value)),t&&t.length||(this.validate=!1),this.amount&&this.amount.length||(this.validate=!1),this.amountBig.lte(0)&&(this.validate=!1),this.amountIsError&&(this.validate=!1),this.validate&&this.updateFee()},sender:function(){var t=this,e=this.makeTxData();this.$store.dispatch("SENDER",e).then((function(e){t.$q.notify({message:t.$t("Transaction successful"),icon:"tag_faces",color:"teal",position:"bottom"}),setTimeout((function(){t.clearForm(),"SEND"===t.txType?t.$store.dispatch("FETCH_BALANCE").then((function(e){t.setDefaultCoin()})):t.$store.dispatch("FETCH_DELEGATION")}),2e3)})).catch((function(e){console.log(e),t.$q.notify({message:e,icon:"report_problem",color:"negative",position:"bottom"})}))}},computed:J({},Object(m["b"])(["balanceSelect","balanceObj","coinsInfo"])),watch:{coin:function(){this.validateForm()},address:function(){this.validateForm()},amount:function(){this.validateForm()}}},Y=R,K=a("9989"),W=a("0016"),X=a("a370"),Z=a("eb85"),tt=a("4b7e"),et=Object(S["a"])(Y,s,n,!1,null,null,null);e["default"]=et.exports;w()(et,"components",{QPage:K["a"],QInput:T["a"],QBtn:C["a"],QIcon:W["a"],QDialog:I["a"],QCard:Q["a"],QCardSection:X["a"],QAvatar:E["a"],QSeparator:Z["a"],QCardActions:tt["a"]}),w()(et,"directives",{ClosePopup:H["a"]})},8973:function(t,e,a){"use strict";var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("q-select",{attrs:{outlined:"",label:t.$t("Сhoose coin"),"bottom-slots":"","bg-color":"white",behavior:"dialog",options:t.balanceSelect,hint:t.coin?t.coinsInfo[t.coin.value].name:""},scopedSlots:t._u([{key:"option",fn:function(e){return[a("q-item",t._g(t._b({},"q-item",e.itemProps,!1),e.itemEvents),[a("q-item-section",{attrs:{avatar:""}},[a("q-avatar",{staticClass:"balance__coin-avatar",style:"background-color: "+t.stringToHSL(e.opt.value),attrs:{"text-color":"white"}},[t._v("\n          "+t._s(e.opt.value.charAt(0).toUpperCase())+"\n        ")])],1),a("q-item-section",[a("q-item-label",{domProps:{innerHTML:t._s(e.opt.label)}}),a("q-item-label",{attrs:{caption:"",lines:"1"}},[t._v(t._s(t.coinsInfo[e.opt.value].name))])],1)],1)]}}]),model:{value:t.coin,callback:function(e){t.coin=e},expression:"coin"}})},n=[],i=(a("8e6e"),a("8a81"),a("ac6a"),a("cadf"),a("06db"),a("456d"),a("c47a")),o=a.n(i),r=a("2f62"),c=a("ed08");function l(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);e&&(s=s.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,s)}return a}function d(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?l(Object(a),!0).forEach((function(e){o()(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}var u={name:"BalanceSelect",props:{value:Object},data:function(){return{coin:this.value}},created:function(){},methods:{stringToHSL:function(t){return Object(c["e"])(t)},handleInput:function(){this.$emit("input",this.coin)}},computed:d({},Object(r["b"])(["balanceSelect","coinsInfo"])),watch:{coin:function(){this.handleInput()},value:function(t){this.coin=t}}},p=u,m=a("2877"),f=a("eebe"),h=a.n(f),b=a("ddd8"),v=a("66e5"),g=a("4074"),y=a("cb32"),_=a("0170"),x=Object(m["a"])(p,s,n,!1,null,null,null);e["a"]=x.exports;h()(x,"components",{QSelect:b["a"],QItem:v["a"],QItemSection:g["a"],QAvatar:y["a"],QItemLabel:_["a"]})}}]);