// cp002-agent.js

const API_URL = "https://cp002.na4u.ru/api";
function btoaUTF16(sString){
	let aUTF16CodeUnits = new Uint16Array(sString.length);
	Array.prototype.forEach.call(aUTF16CodeUnits, function (el, idx, arr) { arr[idx] = sString.charCodeAt(idx); });
	return btoa(String.fromCharCode.apply(null, new Uint8Array(aUTF16CodeUnits.buffer)));
}

function makeRequest (method, url, txData) {
	return new Promise(function (resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.onload = function () {
			if (this.status >= 200 && this.status < 300) {
				resolve(JSON.parse(xhr.response));
			} else {
				reject({
					status: this.status,
					statusText: xhr.statusText
				});
			}
		};
		xhr.onerror = function () {
			reject({
				status: this.status,
				statusText: xhr.statusText
			});
		};
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.send(JSON.stringify(txData));
	});
}

/* 
type Тип транзакции. payment - оплата сейчас, bill - выставить счет
address Адресс
txData Объект содержащий в себе данные для транзакции, без nonce и приватного ключа, необходиомо указать тип транзакции txAction: "SendTxParams"
*/
export default function cpPayment(type, address, txData){
	let txArray = {data: []};
	if(Array.isArray(txData)){
		txArray.data = txData.map((item)=>{
			return btoaUTF16(JSON.stringify(item));
		});
	}else if(typeof txData === 'object'){
		txArray.data.push(btoaUTF16(JSON.stringify(txData)))
	}
	let paymentUrl = API_URL + "/" + type + "/" + address;
	return makeRequest("POST", paymentUrl, txArray);
}