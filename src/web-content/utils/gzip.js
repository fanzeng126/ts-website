import pako from 'pako'
import Base64 from 'Base64'

export const gzip = strData => Base64.btoa(Ut8ArrToString(pako.gzip(strData)))
// Gzip 解压
export const unzip = strData => pako.inflate(stringToUt8Arr(Base64.atob(strData)), { to: 'string' })

export function Ut8ArrToString (fileData) {
  var dataString = ''
  for (var i = 0; i < fileData.length; i++) {
    dataString += String.fromCharCode(fileData[i])
  }
  return dataString
}

export function stringToUt8Arr (str) {
  var arr = []
  for (var i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i))
  }

  var tmpUint8Array = new Uint8Array(arr)
  return tmpUint8Array
}
