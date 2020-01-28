(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[9],{1667:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("q-page",{attrs:{padding:""}},[a("form",{ref:"sendForm",on:{submit:function(e){e.preventDefault(),e.stopPropagation(),t.confirmSend=!0}}},[a("div",{staticClass:"q-gutter-md q-pa-md"},[a("q-input",{attrs:{outlined:"",clearable:"","bottom-slots":"",hint:t.addressHint,label:t.$t("Mx address or Mp public key"),rules:[function(e){return!!e||t.$t("Field is required")}]},scopedSlots:t._u([t.isHello?null:{key:"after",fn:function(){return[a("q-btn",{staticClass:"cursor-pointer",attrs:{flat:"",round:"",icon:"format_list_bulleted"},on:{click:function(e){t.popupAddress=!0}}})]},proxy:!0}],null,!0),model:{value:t.addressTo,callback:function(e){t.addressTo=e},expression:"addressTo"}}),a("q-dialog",{attrs:{"full-width":"","transition-show":"scale","transition-hide":"scale"},model:{value:t.popupAddress,callback:function(e){t.popupAddress=e},expression:"popupAddress"}},[a("q-card",{staticStyle:{height:"60vh"}},[a("q-tabs",{staticClass:"bg-teal text-white shadow-2",attrs:{"inline-label":"","active-color":"white","indicator-color":"white"},model:{value:t.popupAddressTab,callback:function(e){t.popupAddressTab=e},expression:"popupAddressTab"}},[a("q-tab",{attrs:{name:"addressSelectTab",icon:"supervisor_account",label:t.$t("Contacts")}}),a("q-tab",{attrs:{name:"validatorsSelectTab",icon:"work",label:t.$t("Validators")}})],1),a("q-tab-panels",{attrs:{animated:""},model:{value:t.popupAddressTab,callback:function(e){t.popupAddressTab=e},expression:"popupAddressTab"}},[a("q-tab-panel",{attrs:{name:"addressSelectTab"}},[t.contactList&&t.contactList.length>0?a("q-virtual-scroll",{staticStyle:{"max-height":"50vh"},attrs:{items:t.contactList,separator:""},scopedSlots:t._u([{key:"default",fn:function(e){var s=e.item,n=e.index;return[a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"},{name:"close-popup",rawName:"v-close-popup"}],key:n,attrs:{clickable:""},on:{click:function(e){t.addressTo=s.address}}},[a("q-item-section",{staticClass:"q-ml-none",attrs:{top:"",avatar:""}},[a("q-avatar",{attrs:{color:"primary","text-color":"white"}},[t._v("\n                        "+t._s(s.name[0])+"\n                      ")])],1),a("q-item-section",[a("q-item-label",[t._v(t._s(s.name))]),a("q-item-label",{attrs:{caption:"",lines:"1"}},[t._v(t._s(s.address))])],1)],1)]}}],null,!1,1606794253)}):a("div",{staticClass:"flex flex-center"},[a("div",{staticClass:"self-center text-h5 text-center"},[t._v("\n                  "+t._s(t.$t("You dont have any saved contacts"))+"\n                  "),a("q-btn",{staticClass:"q-mt-lg",attrs:{to:"/contacts",color:"primary",label:t.$t("Add first contact")}})],1)])],1),a("q-tab-panel",{attrs:{name:"validatorsSelectTab"}},[a("q-virtual-scroll",{staticStyle:{"max-height":"50vh"},attrs:{items:t.validatorsSelect,separator:""},scopedSlots:t._u([{key:"default",fn:function(e){var s=e.item,n=e.index;return[a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"},{name:"close-popup",rawName:"v-close-popup"}],key:n,attrs:{clickable:""},on:{click:function(e){t.addressTo=s.value}}},[a("q-item-section",{attrs:{top:"",avatar:""}},[s.icon?a("q-avatar",[a("img",{attrs:{src:s.icon}})]):a("q-icon",{staticStyle:{color:"#ccc"},attrs:{size:"xl",name:"developer_board"}})],1),a("q-item-section",[a("q-item-label",[t._v(t._s(s.label))]),a("q-item-label",{attrs:{caption:"",lines:"2"}},[t._v(t._s(s.desc))])],1),a("q-item-section",{attrs:{side:"",top:""}},[a("q-badge",{attrs:{label:t.pretty(s.part,2)}})],1)],1)]}}])})],1)],1)],1)],1),a("q-select",{attrs:{outlined:"",label:t.$t("Сhoose coin"),"bottom-slots":"",behavior:"dialog","display-value":t.coinSymbol&&t.coinSymbol.coin?"<b>"+t.coinSymbol.coin+"</b> ("+t.coinSymbol.amountPretty+")":"",options:t.isHello?t.pushBalancesSelect:t.balancesSelect,hint:t.coinSymbol&&t.coinSymbol.coin?t.coinsJSON[t.coinSymbol.coin].name:""},scopedSlots:t._u([{key:"option",fn:function(e){return[a("q-item",t._g(t._b({},"q-item",e.itemProps,!1),e.itemEvents),[a("q-item-section",{attrs:{avatar:""}},[a("q-avatar",{staticClass:"balance__coin-avatar",style:"background-color: "+t.stringToHSL(e.opt.coin),attrs:{"text-color":"white"}},[t._v("\n                "+t._s(e.opt.coin.charAt(0).toUpperCase())+"\n              ")])],1),a("q-item-section",[a("q-item-label",[a("b",[t._v(t._s(e.opt.coin))]),t._v(" ("+t._s(e.opt.amountPretty)+")")]),a("q-item-label",{staticClass:"one-line",attrs:{caption:""}},[t._v(t._s(t.coinsJSON[e.opt.coin].name))])],1)],1)]}}]),model:{value:t.coinSymbol,callback:function(e){t.coinSymbol=e},expression:"coinSymbol"}}),a("q-input",{ref:"amountStringEl",attrs:{type:"number",step:"any",outlined:"",clearable:"",debounce:"250",label:t.$t("Amount"),rules:[function(e){return e&&!!e.toString().length||t.$t("Field is required")},function(e){return t.checkBalance(e)||t.$t("Not enough")+" "+t.coinSymbol.value}]},scopedSlots:t._u([{key:"after",fn:function(){return[a("q-btn",{attrs:{round:"","no-caps":"",flat:"",label:"Max"},on:{click:t.maxAmountSend}})]},proxy:!0}]),model:{value:t.amountString,callback:function(e){t.amountString=e},expression:"amountString"}}),a("div",[a("q-btn",{staticClass:"full-width",attrs:{type:"submit",color:"teal",size:"16px",disabled:!t.txReady}},[a("q-icon",{attrs:{left:"",name:"send"}}),t._v("\n          "+t._s("DelegateTxParams"===t.txAction?t.$t("Delegate"):t.$t("formSend"))+"\n        ")],1)],1),!t.txReady&&t.txError?a("div",{staticClass:"text-negative"},[t._v("\n        "+t._s(t.txError)+"\n      ")]):t._e(),a("div",{staticClass:"text-grey-7"},[t._v("\n        "+t._s(t.$t("Transaction fee"))+": "+t._s(t.senderFee)+" BIP\n      ")])],1)]),t.coinSymbol&&t.coinSymbol.coin&&t.addressTo?a("q-dialog",{attrs:{persistent:"","full-width":"","transition-show":"scale","transition-hide":"scale"},model:{value:t.confirmSend,callback:function(e){t.confirmSend=e},expression:"confirmSend"}},[a("q-card",{staticStyle:{"max-width":"440px !important"}},[a("q-card-section",{staticStyle:{"text-align":"center"}},[a("div",{staticClass:"text-h5 text-grey-7"},[t._v(t._s(t.$t("You are"))+" "+t._s("DelegateTxParams"===t.txAction?t.$t("Delegate dialog"):t.$t("Send dialog")))]),a("div",{staticClass:"text-h6"},[t._v(t._s(t.numberSpaces(t.pretty(t.amount,3)))+" "),a("b",[t._v(t._s(t.coinSymbol.coin))])])]),a("q-card-section",{staticClass:"row justify-center items-center q-pt-none"},[t.profileTo&&t.profileTo.icon?a("q-avatar",[a("img",{attrs:{src:t.profileTo.icon}})]):a("q-icon",{staticStyle:{color:"#ccc"},attrs:{size:"xl",name:"DelegateTxParams"===t.txAction?"developer_board":"account_circle"}}),a("span",{staticClass:"q-ml-sm"},[t._v("\n          "+t._s(t.profileTo.title)+"\n          "),a("div",{staticClass:"text-grey-7"},[t._v(t._s(t.addressTo.substr(0,4)+"..."+t.addressTo.substr(-4)))])])],1),a("q-separator",{attrs:{inset:""}}),a("q-card-actions",{attrs:{align:"around"}},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:t.$t("Cancel"),color:"red"}}),a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:t.$t("Accept"),color:"primary"},on:{click:t.sender}})],1)],1)],1):t._e()],1)},n=[],i=(a("8e6e"),a("8a81"),a("ac6a"),a("cadf"),a("456d"),a("c47a")),o=a.n(i),r=(a("6b54"),a("06db"),a("a481"),a("967e")),c=a.n(r),l=(a("7f7f"),a("96cf"),a("fa84")),d=a.n(l),u=a("158a"),p=a("6ff6"),m=a("2f62"),h=a("ed08"),b=a("9dcd"),f=a.n(b);function S(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);e&&(s=s.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,s)}return a}function y(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?S(Object(a),!0).forEach((function(e){o()(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):S(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}var v={name:"Send",props:{routeAddressTo:String,sendTxData:Object},data:function(){return{isHello:!1,confirmSend:!1,popupAddressTab:"addressSelectTab",popupAddress:!1,addressData:null,coinOptions:null,coinSymbol:null,addressTo:"",addressHint:"",txReady:!1,txError:"",amountString:null,amount:null,message:"",addressToOld:"",txAction:"SendTxParams",loadedProfile:!1,profileTo:null,senderFee:Object(u["e"])(p["e"],{payload:""})}},methods:{Big:function(t){return f()(t)},findAdress:function(){var t=d()(c.a.mark((function t(e){var a,s,n;return c.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if("Mx"!==e.substring(0,2)||42!==e.length){t.next=14;break}if(this.txAction="SendTxParams",a=this.findByAddress(e),!a||!a.name||""===a.name){t.next=8;break}this.addressHint=a.name,this.profileTo={title:a.name},t.next=12;break;case 8:return t.next=10,this.$store.dispatch("GET_PROFILE",e);case 10:s=t.sent,s&&s.title?(this.addressHint=s.title,this.profileTo={title:s.title,icon:s.icons.webp}):this.profileTo={};case 12:t.next=15;break;case 14:"Mp"===e.substring(0,2)&&66===e.length?(this.txAction="DelegateTxParams",n=this.findValidator(e),n&&n.label?(this.addressHint=n.label,this.profileTo={title:n.label,icon:n.icon}):this.profileTo={}):(this.addressHint=" ",this.profileTo={});case 15:case"end":return t.stop()}}),t,this)})));function e(e){return t.apply(this,arguments)}return e}(),sender:function(){var t=this,e={txAction:this.txAction,coinSymbol:this.coinSymbol.coin,feeCoinSymbol:"BIP",message:this.message};"SendTxParams"===this.txAction?(e.amount=this.amount,e.address=this.addressTo):"DelegateTxParams"===this.txAction&&(e.stake=this.amount,e.publicKey=this.addressTo),this.$store.dispatch("SENDER",e).then((function(e){t.$q.notify({message:t.$t("Transaction successful"),icon:"tag_faces",color:"teal",position:"bottom"}),t.$store.dispatch("FETCH_BALANCE"),t.$store.dispatch("FETCH_DELEGATION"),t.clearAll()})).catch((function(e){t.$q.notify({message:e,icon:"report_problem",color:"negative",position:"bottom"})}))},clearAll:function(){this.coinSymbol=null,this.addressTo=null,this.amount=null,this.message="",this.addressToOld="",this.txReady=!1,this.txError="",this.txAction="",this.totalString="",this.loadedProfile=!1,this.profileTo=null,this.senderFee=Object(u["e"])(p["e"],{payload:""})},pretty:function(t,e){return Object(h["b"])(t,e)},numberSpaces:function(t){return Object(h["a"])(t)},stringToHSL:function(t){return Object(h["d"])(t)},checkBalance:function(t){return"BIP"===this.coinSymbol.value?f()(f()(this.coinSymbol.amount).minus(this.senderFee)).gte(f()(t.toString().replace(",","."))):f()(this.coinSymbol.amount).gte(f()(t.toString().replace(",",".")))},maxAmountSend:function(){if(!this.coinSymbol||!this.coinSymbol.value)return!1;"BIP"===this.coinSymbol.value?this.amount=new f.a(this.coinSymbol.amount.replace(",",".")).minus(this.senderFee):this.amount=new f.a(this.coinSymbol.amount.replace(",",".")),this.amountString=this.amount.toString()},updateFee:function(){this.senderFee=Object(u["e"])("SendTxParams"===this.txAction?p["e"]:p["c"],{payload:this.message})},calcSend:function(){this.txReady=!1,this.txError="",this.updateFee();try{this.$refs.sendForm.submit()}catch(t){console.log(t)}this.amount=f()(this.amountString?this.amountString.toString().replace(",","."):0),this.coinSymbol&&this.coinSymbol.value&&this.amountString&&this.addressTo&&this.checkBalance(this.amountString)&&(this.txReady=!0),this.amount&&this.amount.gte(this.coinSymbol.amount)&&(this.txError=this.$t("Not enough")+" ".concat(this.pretty(this.amount.minus(this.coinSymbol.amount),3)," ").concat(this.coinSymbol.value))}},computed:y({},Object(m["c"])({address:function(t){return t.wallet.address},coinsJSON:function(t){return t.api.coinsJSON},balances:function(t){return t.api.balances},pushBalances:function(t){return t.push.balances},balancesJSON:function(t){return t.api.balancesJSON},validatorsSelect:function(t){return t.api.validatorsSelect},contactList:function(t){return t.contacts.contactList}}),{},Object(m["b"])(["isLogin","findValidator","findByAddress","balancesSelect","pushBalancesSelect","getBalancesSelectItem"])),created:function(){if("/hello"===this.$route.path&&(this.isHello=!0),this.routeAddressTo&&""!==this.routeAddressTo&&(this.addressTo=this.routeAddressTo),this.sendTxData&&(this.sendTxData.type===p["e"]||this.sendTxData.type===p["c"])){this.addressTo=this.sendTxData.data.to,this.amountString=this.sendTxData.data.value;var t=this.sendTxData.data.coin;this.balancesJSON&&this.balancesJSON[t]?this.coinSymbol=this.getBalancesSelectItem(t):this.coinSymbol={coin:t,amount:0,label:t,value:t},this.calcSend()}console.log("Length = "+this.pushBalancesSelect.length),this.coinSymbol||this.isHello||1!==this.balancesSelect.length||(this.coinSymbol=this.balancesSelect[0]),!this.coinSymbol&&this.isHello&&1===this.pushBalancesSelect.length&&(this.coinSymbol=this.pushBalancesSelect[0])},mounted:function(){},watch:{txAction:function(){this.calcSend()},coinSymbol:function(t){this.calcSend()},addressTo:function(t,e){null===t?this.addressHint="":this.findAdress(this.addressTo),this.calcSend()},amountString:function(t){this.calcSend()},message:function(){this.calcSend()}}},g=v,x=(a("44e5"),a("2877")),T=a("eebe"),_=a.n(T),q=a("9989"),A=a("27f9"),w=a("9c40"),O=a("24e8"),k=a("f09f"),P=a("429bb"),$=a("7460"),C=a("adad"),D=a("823b"),j=a("a12b"),B=a("66e5"),E=a("4074"),Q=a("cb32"),N=a("0170"),H=a("0016"),F=a("58a8"),I=a("ddd8"),L=a("a370"),J=a("eb85"),R=a("4b7e"),M=a("714f"),V=a("7f67"),z=Object(x["a"])(g,s,n,!1,null,null,null);e["default"]=z.exports;_()(z,"components",{QPage:q["a"],QInput:A["a"],QBtn:w["a"],QDialog:O["a"],QCard:k["a"],QTabs:P["a"],QTab:$["a"],QTabPanels:C["a"],QTabPanel:D["a"],QVirtualScroll:j["a"],QItem:B["a"],QItemSection:E["a"],QAvatar:Q["a"],QItemLabel:N["a"],QIcon:H["a"],QBadge:F["a"],QSelect:I["a"],QCardSection:L["a"],QSeparator:J["a"],QCardActions:R["a"]}),_()(z,"directives",{Ripple:M["a"],ClosePopup:V["a"]})},"44e5":function(t,e,a){"use strict";var s=a("f5c4"),n=a.n(s);n.a},f5c4:function(t,e,a){}}]);