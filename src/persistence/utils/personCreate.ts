import { Sequelize } from 'sequelize-typescript'
import { Person } from '../../persistence/models/Person'
import { User } from '../../persistence/models/User'
import { UserRole } from '../../persistence/models/UserRole'
import { Context } from '../../typings/common'
import { generatePassword } from '../../utils'
import personUpdate from './personUpdate'

/**
 * Creates User if not exists. Either case returns the userid.
 * @param sequelize 
 * @param body 
 */
async function createUser(sequelize: Sequelize, body: any) {
  let user = await sequelize.getRepository(User).findOne({ where: { email: body.email } })

  if (!user) {
    const encodedPassword = generatePassword(body.documentNumber)
    user = await sequelize.getRepository(User).create({ email: body.email, ...encodedPassword } as User)

    const userId = (user.toJSON() as User).id
    await sequelize.getRepository(UserRole).create({ userId, roleId: 2 } as UserRole) // Person

  }
  return (user.toJSON() as User).id
}

export default async (context: Context, body: any): Promise<string> => {

  const { webDB } = context
  const userId = await createUser(webDB, body)

  let person = await webDB.getRepository(Person).findOne({ where: { userId } })

  if (!person)
    {
    person = await webDB.getRepository(Person).create({ userId, ...body })
    }

  await personUpdate(context, person.id, body)

  return person.id

} 