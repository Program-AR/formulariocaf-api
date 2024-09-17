import { Request, Response } from 'restify'
import { sendError } from '../../utils/send'
import ServerError, { BodyNotFound, ForbiddenParameters, ParametersNotFound } from './serverError'

async function errorHandler(req: Request, res: Response, error: ServerError, callback: () => void): Promise<void> {
  await sendError(req, res, error, true)
  return callback()
}

export const hasParameter = (req: Request, prop: string, name: string): boolean => req[prop] && req[prop][name]

export const shouldHaveBody = (req: Request): void => {
  if (!req.body) throw new BodyNotFound()
}

export const shouldHave = (req: Request, prop: string, ...paramNames: string[]): void => {
  const missingParams: string[] = paramNames.filter(name => !hasParameter(req, prop, name))
  if (missingParams.length > 0) throw new ParametersNotFound(...missingParams)
}

export const shouldNotHave = (req: Request, prop: string, ...paramNames: string[]): void => {
  const forbiddenParams: string[] = paramNames.filter(name => hasParameter(req, prop, name))
  if (forbiddenParams.length > 0) throw new ForbiddenParameters(...forbiddenParams)
}

export default errorHandler