import * as Logger from 'bunyan'
import { Sequelize } from 'sequelize-typescript'
import { seedDatabase, seedQuestionData } from './seedDatabase'

export const setupWebDatabase = async (logger: Logger, testing = false): Promise<Sequelize> => {

  const webDB = new Sequelize(
    process.env.WEB_DB_CONNECTION_URI || 'sqlite::memory:',
    { logging: console.log/*(query, data: any) => {
        const bindedQuery = data?.bind?.reduce(
           (newestQuery, value, i) => newestQuery.replace(`$${i+1}`, value), 
        query)
        logger.debug(bindedQuery || query)
      } */
    }
  )

  webDB.addModels([__dirname + '/models'])

  await seedDatabase(webDB, testing)

  await seedQuestionData(webDB)

  return webDB

}
