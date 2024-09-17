import { Response, Request } from 'restify'
import ServerError from '../router/error/serverError'

export const send = async ({ context }: Request, res: Response, code: number, body: any) => {
  res.send(code, body)
}

export const sendError = async (req: Request, res: Response, error: ServerError, log: boolean): Promise<void> => {
  const { context } = req

  if (log) {
    const logger = context?.logger || console // TODO: Sacar el logger (o context?) de la Request
    logger.error(error.message, error)
  }

  res.send(error.statusCode || 500, {
    error: error.message
  })
}

export const sendOK = async (req: Request, res: Response, body: any): Promise<void> => {
   await send(req, res, 200, body)
}
