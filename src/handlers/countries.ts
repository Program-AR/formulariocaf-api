import { Next, Request, Response } from 'restify'
import { send } from '../utils/send'
import { Country } from '../persistence/models/Country'

export default async (req: Request, res: Response, next: Next) => {
  const { context } = req
  const { webDB } = context

  const countries = await webDB.getRepository(Country).findAll()

  await send(req, res, 200, { countries })

}
