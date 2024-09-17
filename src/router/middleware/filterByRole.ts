import { Next, Request, Response } from 'restify'
import { syncHandler } from '../../handlers/utils'

export type RoleFilter = (req: Request) => any

const filterByRole = (filter: RoleFilter) => syncHandler(async (req: Request, _res: Response, next: Next) => {
  req.filterByRole = filter(req); next()
})
export default filterByRole

const personFilter: RoleFilter = ({ user }) => ({ '$person.id$': user.personId })

export const filterByPerson = filterByRole(personFilter)
