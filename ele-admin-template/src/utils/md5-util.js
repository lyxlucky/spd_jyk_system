import CryptoJS from 'crypto-js';

export function EncryptMd5(str) {
    return CryptoJS.MD5(str).toString();
}