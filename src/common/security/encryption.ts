import * as CryptoJS from "crypto-js"

export const Encrypt = (plainText: string, secret: string = process.env.ENCRYPT_SECRET as string) => {
    return CryptoJS.AES.encrypt(plainText, secret).toString();
}

export const Decrypt = (encryptedText: string, secret: string = process.env.ENCRYPT_SECRET as string) => {
    var bytes = CryptoJS.AES.decrypt(encryptedText, secret);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}