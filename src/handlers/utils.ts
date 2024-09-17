import { Next, Request, Response } from 'restify'
import { FindOptions } from 'sequelize'

export type QueryByRole = (req: Request) => (query: FindOptions) => FindOptions

export type RequestHandler = (req: Request, res: Response, next: Next) => Promise<void>

export const syncHandler = (handler: RequestHandler): RequestHandler => async (req, res, next) => {
  try {
    await handler(req, res, next)
    next()
  }
  catch (err) {
    next(err)
  }
}