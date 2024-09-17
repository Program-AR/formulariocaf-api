import * as crypto from 'crypto-js'
import { EncodedPassword } from '../typings/common'

export default (password: string): EncodedPassword => {

	const saltPrhase = crypto.lib.WordArray.random(128/8)
	const hashedPassword = crypto.enc.Base64.stringify(crypto.PBKDF2(password, saltPrhase, { hasher: crypto.algo.SHA512, keySize: 512 / 32, iterations: 10000 } ))
	const salt = crypto.enc.Base64.stringify(saltPrhase)
	return { salt, hashedPassword }
}