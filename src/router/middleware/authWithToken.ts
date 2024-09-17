import { Next, Request, Response } from 'restify'
import { Unauthorized } from '../error/serverError'
import { verifyToken } from '../../utils'

const getToken = (req: Request) =>
  req.params['access_token'] || req.header('authorization', '').replace('Bearer ', '') || ''

export default async (req: Request, res: Response, next: Next) => {

  try {
    const token = getToken(req)

    if (token) {
      req.user = verifyToken(token)
      next()
    }

    else {
      next(new Unauthorized("Missing access token"))
    }

  }

  catch (error) {
    next(new Unauthorized("Failed token"))
  }

}
