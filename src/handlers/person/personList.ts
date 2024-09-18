import { Request, Response } from 'restify'
import { FindOptions, Op } from 'sequelize'
import { Person } from '../../persistence/models/Person'
import { User } from '../../persistence/models/User'
import { makePaginatedQuery } from '../../router/middleware/makeQuery'
import Omnisearch from '../omnisearch'
import paginatedList from '../paginatedList'
import { inClause, textLikeFilter } from '../sequelizeUtils'
import { orClause } from '../sequelizeUtils'
import { GeneralDesc } from '../../persistence/models/GeneralDesc'

const makeQuery = (req: Request): FindOptions => ({
  ...(req.params.omnisearch ? makeOmniSearchQuery(req) : makeRegularQuery(req)),
  include: [User, 
    {
      model: GeneralDesc,
      as: 'generalAreas'
    }, {
      model: GeneralDesc,
      as: 'generalRegions'
    }]
})

const makeOmniSearchQuery = (req: Request): FindOptions => ({
  ...new Omnisearch().makeQuery({
    model: Person,
    fields: ["documentNumber", "firstName", "lastName"],
    search: req.params.omnisearch
  })
})

const makeRegularQuery = (req: Request) => {
  const { documentNumber, email, fullName } = req.params
  let where = {}
  if (documentNumber) where['documentNumber'] = { [Op.iLike]: `%${documentNumber}%` }
  if (email) where = { ...where, ...textLikeFilter('email', email) }
  if (fullName) {
    where = {...where, ...orClause(textLikeFilter('Person.lastName', fullName), textLikeFilter('Person.firstName', fullName))}
  }
  return {
    where
  }
}

export default [makePaginatedQuery(makeQuery), paginatedList('web', Person, 'people')]