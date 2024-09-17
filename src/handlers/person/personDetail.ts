import { Next, Request, Response } from 'restify'
import { Person } from '../../persistence/models/Person'
import { User } from '../../persistence/models/User'
import { send } from '../../utils/send'
import { GeneralDesc } from '../../persistence/models/GeneralDesc'
import { Country } from '../../persistence/models/Country'

export default async (req: Request, res: Response, next: Next) => {

  const { context, params } = req

  const { logger, webDB } = context

  const {
    personId
  } = params

  try {

    const person = await webDB.getRepository(Person).findByPk(personId, {include: [User, GeneralDesc, Country]})

    if (person) {

      await send(req, res, 200, { person: person.toJSON()})

    } else {

      await send(req, res, 404, {
        error: 'Person not found'
      })

    }

  } catch (err) {

    logger.error('Error getting person', err)

    await send(req, res, 500, {
      error: 'Error getting person'
    })

  }

}
