import * as Logger from 'bunyan'
import * as dotenv from 'dotenv'
import { setupWebDatabase } from './persistence'

dotenv.config()

async function seed() {

  process.env.SEED_DATABASE = 'true'

  // init logger
  const logger = Logger.createLogger({
    name: 'hd-api',
    level: process.env.LOG_LEVEL as Logger.LogLevel
  })

  // setup database connection
  await setupWebDatabase(logger)

}

process.on('uncaughtException', err => {
  console.error(err, 'Uncaught Exception thrown')
  process.exit(1)
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason)
  process.exit(1)
})

seed()