import { Next, Request, Response } from 'restify'
import { User } from '../../persistence/models/User'
import { generatePassword, verifyPassword } from '../../utils'
import { send } from '../../utils/send'
import { BadRequest, BodyParametersNotFound } from '../../router/error/serverError'

export default async (req: Request, res: Response, next: Next) => {
  const { context, user, body, params } = req
  const {
    oldPassword,
    newPassword,
  } = body

  const { logger, webDB } = context

  if (!params.recovery && !oldPassword) return next(new BodyParametersNotFound('oldPassword'))

  try {
    const encodedNewPassword = generatePassword(newPassword)
    const userModel = await webDB.getRepository(User).findByPk(user.userId, {
      attributes: { include: ['hashedPassword', 'salt'] },
    }) as User

    if (!params.recovery && !verifyPassword(oldPassword, userModel)) {
      return next(new BadRequest('Invalid password'))
    }

    await userModel.update({
      hashedPassword: encodedNewPassword.hashedPassword,
      salt: encodedNewPassword.salt,
      shouldUpdatePassword: false
    })

    await send(req, res, 200, {})

  } catch (err) {

    logger.error('Error upserting credentials', err)

    await send(req, res, 500, {
      error: 'Error upserting credentials: ' + err
    })

  }

}