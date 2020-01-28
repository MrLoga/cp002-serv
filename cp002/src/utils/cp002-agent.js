// cp002-agent.js

let API_URL = ''
if (location.host.includes('localhost')) API_URL = 'http://localhost:3000/api'
else API_URL = 'https://cp002.cloudp.group/api'
function btoaUTF16 (sString) {
  let aUTF16CodeUnits = new Uint16Array(sString.length)
  Array.prototype.forEach.call(aUTF16CodeUnits, function (el, idx, arr) { arr[idx] = sString.charCodeAt(idx) })
  return btoa(String.fromCharCode.apply(null, new Uint8Array(aUTF16CodeUnits.buffer)))
}

function makeRequest (method, url, txArray) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest()
    xhr.open(method, url, true)
    xhr.withCredentials = true
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(JSON.parse(xhr.response))
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        })
      }
    }
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      })
    }
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8')
    xhr.send(JSON.stringify(txArray))
  })
}

/*
type Тип транзакции. payment - оплата сейчас, bill - выставить счет, auth - авторизация
address Адрес пользователя
txData Объект содержащий в себе данные для транзакции, без nonce и приватного ключа, необходимо указать тип транзакции txAction: 'SendTxParams'
*/
export default function cpPayment (type, txData) {
  let txArray = { data: [] }
  if (Array.isArray(txData)) {
    // txArray.data = txData.map((item) => {
    //   return btoaUTF16(JSON.stringify(item))
    // })
    txArray.data = txData
  } else if (typeof txData === 'object') {
    // txArray.data.push(btoaUTF16(JSON.stringify(txData)))
    txArray.data.push(txData)
  }
  if (typeof txData === 'string' && type === 'login') {
    txArray.address = txData
  }
  let paymentUrl = API_URL + '/' + type
  console.log(paymentUrl)
  console.log(txArray)
  return makeRequest('POST', paymentUrl, txArray)
}
