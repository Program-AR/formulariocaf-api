import { Next, Request, Response } from 'restify'
import { syncHandler } from '../../handlers/utils'
import { assignWhere } from '../../handlers/sequelizeUtils'
import { paginationToQuery } from '../../utils/pagination'

export type QueryMaker = (req: Request) => any

export const makeQuery = (maker: QueryMaker) => syncHandler(async (req: Request, _res: Response, next: Next) => {
  const { filterByRole } = req
  req.dbQuery = assignWhere(filterByRole)(maker(req))
//  next()
})

export const makePaginatedQuery = (maker: QueryMaker) => makeQuery(req => ({
  ...paginationToQuery(req),
  ...maker(req)
}))

