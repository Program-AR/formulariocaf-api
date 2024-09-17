import { Next, Request, Response } from 'restify'
import { Person } from '../../persistence/models/Person'
import { Role } from '../../persistence/models/Role'
import { User } from '../../persistence/models/User'
import { generateToken, verifyPassword } from '../../utils'
import { send } from '../../utils/send'
import moment = require('moment')
import { Country } from '../../persistence/models/Country'

export default async (req: Request, res: Response, next: Next) => {
  const { body, context } = req
  const { email, password } = body

  const { webDB } = context

  const user = await webDB.getRepository(User).findOne({
    where: {
      email
    },
    attributes: { include: ['hashedPassword', 'salt'] },
    include: [
      webDB.getRepository(Role),
      webDB.getRepository(Person)
    ]
  })

  if (user != null ) {
    if ( user.expiredDate === null || moment().endOf('day') < user.expired() )
    {
      const { id: userId, hashedPassword, salt } = user
      const roles = user.roleValues()

      const person = await webDB.getRepository(Person).findOne({ where: { userId } })

      const personId = person?.id
      
      const country = await webDB.getRepository(Country).findByPk( person?.countryId )

      const countryId = country?.id

      if (verifyPassword(password, { hashedPassword, salt })) {
  
        await send(req, res, 200, {
          token: generateToken({ userId, personId, countryId, roles }),
          fullName: user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : user.email,
          personId: personId,
          email: user.email,
          roles,
          shouldUpdatePassword: user.shouldUpdatePassword,
          countryId: countryId
        })
      } else {
 
        await send(req, res, 400, {
          error: 'Wrong email or password'
        })
  
      }
  
    } else {
 
      await send(req, res, 401, {
        error: 'Expired user'
    })

    }

  } else {

    await send(req, res, 400, {
      error: 'Wrong email or password'
    })

  }

}