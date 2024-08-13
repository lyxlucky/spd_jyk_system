import store from '@/store/index';
import CryptoJS from 'crypto-js';

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