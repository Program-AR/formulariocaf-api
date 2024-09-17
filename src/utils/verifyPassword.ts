import * as crypto from 'crypto-js'
import { EncodedPassword } from '../typings/common'

export default (password: string, input: EncodedPassword): boolean => {
	const encodeSalt = crypto.enc.Base64.parse(input.salt)
	return crypto.enc.Base64.stringify(crypto.PBKDF2(password, encodeSalt, { hasher: crypto.algo.SHA512, keySize: 512 / 32, iterations: 10000 } )) === input.hashedPassword
}