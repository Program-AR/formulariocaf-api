import * as jwt from 'jsonwebtoken'
import { TokenData } from '../typings/common'

export default (data: TokenData): string => {

	return jwt.sign(data, process.env.JWT_SECRET || 'test')

}