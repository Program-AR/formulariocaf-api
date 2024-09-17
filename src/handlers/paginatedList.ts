import { Model } from 'sequelize-typescript'
import { FindOptions } from 'sequelize'
import { syncHandler } from './utils'
import { sendOK } from '../utils/send'
import { makePagination } from '../utils/pagination'

export type DBSequelize = 'info' | 'web'

const paginatedList = (DB: DBSequelize, modelClass: (new () => Model), entitiesName: string) => syncHandler(async (req, res) => {
  const { context: { webDB }, dbQuery } = req
  
  const query = dbQuery as FindOptions

  let repository;

  repository = webDB.getRepository(modelClass)

  const entities = await repository.findAll(query)
  let count = await repository.count(query)

  if( count instanceof Array )
    count = count.length // Group by count records in each distinct record

  await sendOK(req, res, {
    [entitiesName]: entities.map(c => c.toJSON()),
    pagination: makePagination(req, count)
  })

})

export default paginatedList