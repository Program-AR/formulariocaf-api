import { Request, Response, Next } from 'restify'
import { Person } from '../../persistence/models/Person'
import { send } from '../../utils/send'

export default async (req: Request, res: Response, next: Next) => {

  const { user, context, body } = req

  const { userId } = user

  const { logger, webDB } = context

  try {
    const person = await webDB.getRepository(Person).findOne({ where: { userId } }) as Person

    if (!person) throw new Error('Entity not found')

    await person.update(body)

    await send(req, res, 200, person)

  } catch (err) {

    logger.error('Error updating person', err)

    await send(req, res, 500, {
      error: 'Error updating person'
    })

  }

}