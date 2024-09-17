import { Op } from 'sequelize'
import { User } from '../../persistence/models/User'
import { Context } from '../../typings/common'
import { Person, PersonTypeToRoleId } from '../models/Person'
import { UserRole } from '../../persistence/models/UserRole'

export default async (context: Context, personId: string, body: any) => {

  const { webDB } = context

  const person = await webDB.getRepository(Person).findByPk(personId)

  if (!person)
    throw new Error(`Person ${personId} not exists`)

  const { userId } = person

  await updateUserEmail(context, body, userId)

  if (person.personType) {
    const userRole = await webDB.getRepository(UserRole).findOne({
      where: { userId: userId, roleId: PersonTypeToRoleId(person.personType) },
    })
    if( userRole )
      await webDB.getRepository(UserRole).destroy({
        where: { userId: userId, roleId: PersonTypeToRoleId(person.personType) } })
  }
  if( body.personType )
    await webDB.getRepository(UserRole).create({ userId: userId, roleId: PersonTypeToRoleId(body.personType)} as UserRole) 
  
  await person.update({ userId, ...body })
}

const updateUserEmail = async ({ webDB }: Context, body: any, userId: number) => {
  const user = await webDB.getRepository(User).findByPk(userId)
  if (user) {
    const email = (user.email !== body.email) ? body.email : user.email
    const expiredDate = (user.expiredDate !== body.expiredDate) ? body.expiredDate !== '' ? body.expiredDate : null : user.expiredDate
    user.update({ ...user.toJSON(), email: email, expiredDate: expiredDate })
  }
}