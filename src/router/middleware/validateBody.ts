import { Next, Request, Response } from 'restify'
import { BodyNotFound, BodyParametersNotFound } from '../error/serverError'

export default (...fields: string[]) => async (req: Request, res: Response, next: Next) => {
  if (!req.body) return next(new BodyNotFound())
  if (!fields.every(field => req.body[field])) return next(new BodyParametersNotFound(...fields.filter(field => !req.body[field])))
  next()
}