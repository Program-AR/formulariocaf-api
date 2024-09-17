import { Next, Request, Response } from 'restify'
import { GeneralDesc } from '../persistence/models/GeneralDesc'
import { send } from '../utils/send'
import moment = require('moment')

export default async (req: Request, res: Response, next: Next) => {
  const { context } = req
  const { webDB } = context

  const generalDesc = await webDB.getRepository(GeneralDesc).findAll()

  await send(req, res, 200, { generalDesc })

}
