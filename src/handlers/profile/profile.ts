import { Next, Request, Response } from 'restify'
import { Person } from '../../persistence/models/Person'
import { send } from '../../utils/send'

export default async (req: Request, res: Response, next: Next) => {
  const { user, context } = req
  const { userId } = user

  const { logger, webDB } = context

  try {

    const person = await webDB.getRepository(Person).findOne({ where: { userId } }) as Person

    if (!person) throw new Error('Entity not found')

    const profile = person.toJSON()

    await send(req, res, 200, { profile })

  } catch (err) {

    logger.error('Error person profile', err)

    await send(req, res, 500, {
      error: 'Error person profile'
    })

  }

}