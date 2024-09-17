import { isEmpty } from 'ramda'
import { Next, Request, Response } from 'restify'
import { hasParameter } from '../error/errorHandler'
import { ParametersNotFound } from '../error/serverError'

export default (...fields: string[]) => async (req: Request, res: Response, next: Next) => {
    const missingParams = fields.filter(name => !hasParameter(req, 'params', name))
    if (!isEmpty(missingParams)) { next(new ParametersNotFound(...missingParams)) } else next()
}