import { RequestHandler } from 'restify'
import { Unauthorized } from '../error/serverError'
import { RoleValue } from '../../typings/common'
import authWithToken from './authWithToken'

export default (...roles: RoleValue[]) => [authWithToken, validateRole(...roles)]

const validateRole = (...roles: RoleValue[]): RequestHandler => ({ user }, _res, next) =>
  (!roles.some(role => user.roles.includes(role))) ? next(new Unauthorized('Unauthorized role')) : next()