import { Next, Request, Response } from 'restify'
import { Person } from '../../persistence/models/Person'
import { Role } from '../../persistence/models/Role'
import { User } from '../../persistence/models/User'
import { send } from '../../utils/send'
import { Country } from '../../persistence/models/Country'

export default async (req: Request, res: Response, next: Next) => {
  const { context, user } = req
  const { webDB } = context

  const result = await webDB.getRepository(User).findByPk(user.userId, {
    include: [
      webDB.getRepository(Role),
      webDB.getRepository(Person)
    ]
  })

  const userId = user.userId

  if (result != null) {
  
    const person = await webDB.getRepository(Person).findOne({ where: { userId } })

    const personId = person?.id

    const country = await webDB.getRepository(Country).findByPk( person?.countryId )

    const user = result.toJSON() as User

    await send(req, res, 200, {
      email: user.email,
      fullName: user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : user.email,
      personId: personId,
      roles: user.roles.map(r => r.name),
      shouldUpdatePassword: user.shouldUpdatePassword,
      countryId: country?.id
    })

  } else {

    await send(req, res, 400, {
      error: 'Invalid token'
    })

  }

}