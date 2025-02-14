import store from '@/store/index';
import CryptoJS from 'crypto-js';

export function EncryptWithCustomKey(str,key) {
  var IV = '2019062500000000'; //16位
  var keyFormat = CryptoJS.enc.Utf8.parse(key);
  var iv = CryptoJS.enc.Utf8.parse(IV);

  var encrypted = '';

  var srcs = CryptoJS.enc.Utf8.parse(str);
  encrypted = CryptoJS.AES.encrypt(srcs, keyFormat, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return encrypted.ciphertext.toString();
}
export function Encrypt(str) {
  var KEY = store.state.user.encrypted.KEY; //32位
  var IV = '2019062500000000'; //16位

  var key = CryptoJS.enc.Utf8.parse(KEY);
  var iv = CryptoJS.enc.Utf8.parse(IV);

  var encrypted = '';

  var srcs = CryptoJS.enc.Utf8.parse(str);
  encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return encrypted.ciphertext.toString();
}

export function getAesKey() {
  var chars = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  ];
  var nums = '';
  for (var i = 0; i < 32; i++) {
    var id = parseInt(Math.random() * 61);
    nums += chars[id];
  }
  return nums;
}

export function Decrypt(str) {
  var KEY = store.state.user.encrypted.KEY; //32位
  var IV = '2019062500000000'; //16位

  var key = CryptoJS.enc.Utf8.parse(KEY);
  var iv = CryptoJS.enc.Utf8.parse(IV);
  var encryptedHexStr = CryptoJS.enc.Hex.parse(str);
  var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}
