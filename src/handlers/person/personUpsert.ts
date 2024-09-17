import { Next, Request, Response } from 'restify'
import personCreate from '../../persistence/utils/personCreate'
import personUpdate from '../../persistence/utils/personUpdate'
import { send } from '../../utils/send'

export default async (req: Request, res: Response, next: Next) => {

  const { body, params, context } = req

  let { personId } = params

  const { logger } = context

  try {

    if (personId) {

      await personUpdate(context, personId, body)

    } else {

      personId = await personCreate(context, body)

    }

    await send(req, res, 200, { personId })

  } catch (err) {

    logger.error('Error upserting person', err)

    await send(req, res, 500, {
      error: 'Error upserting person'
    })

  }

}