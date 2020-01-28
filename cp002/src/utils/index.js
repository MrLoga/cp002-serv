export function pretty (num, l) {
  return parseFloat(parseFloat(num).toFixed(l))
}

export function btoaUTF16 (sString) {
  var aUTF16CodeUnits = new Uint16Array(sString.length)
  Array.prototype.forEach.call(aUTF16CodeUnits, function (el, idx, arr) { arr[idx] = sString.charCodeAt(idx) })
  return btoa(String.fromCharCode.apply(null, new Uint8Array(aUTF16CodeUnits.buffer)))
}

export function atobUTF16 (sBase64) {
  var sBinaryString = atob(sBase64), aBinaryView = new Uint8Array(sBinaryString.length)
  Array.prototype.forEach.call(aBinaryView, function (el, idx, arr) {
    arr[idx] = sBinaryString.charCodeAt(idx)
  })
  return String.fromCharCode.apply(null, new Uint16Array(aBinaryView.buffer))
}

export function numberSpaces (x) {
  var parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return parts.join('.')
}

export function prettyNumber (x, length) {
  let num = parseFloat(parseFloat(x).toFixed(length))
  let parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return parts.join('.')
}

function hashCode (str) {
  var hash = 0
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return hash
}
function intToRGB (i) {
  var c = (i & 0x00FFFFFF).toString(16).toUpperCase()
  return '00000'.substring(0, 6 - c.length) + c
}

export function colorFromString (str) {
  return intToRGB(hashCode(str))
}

const symbolsMap = {
  'A': 1,
  'B': 2,
  'C': 3,
  'D': 4,
  'E': 5,
  'F': 6,
  'G': 7,
  'H': 8,
  'I': 9,
  'J': 1,
  'K': 2,
  'L': 3,
  'M': 4,
  'N': 5,
  'O': 6,
  'P': 7,
  'Q': 8,
  'R': 9,
  'S': 1,
  'T': 2,
  'U': 3,
  'V': 4,
  'W': 5,
  'X': 6,
  'Y': 7,
  'Z': 8
}
export function stringToHSL (str) {
  let num = str.replace(/./gi, $0 => symbolsMap[$0.toUpperCase()] || $0) * 0.255
  return 'hsla(' + ~~num + ',50%,60%,1)'
}
