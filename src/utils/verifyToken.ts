import * as jwt from 'jsonwebtoken'
import { TokenData } from '../typings/common'

export default (token: string): TokenData => {

  return jwt.verify(token, process.env.JWT_SECRET || 'test') as TokenData

}