import * as Logger from 'bunyan'
import * as dotenv from 'dotenv'
import * as moment from 'moment'
import 'moment/locale/es'
import 'moment-timezone'
import { createServer, plugins } from 'restify'
import * as corsMiddleware from 'restify-cors-middleware'
import { setupWebDatabase } from './persistence'
import { setupRoutes } from './router'
import { Context } from './typings/common'
import { createMailerTransport } from './utils/emails'

dotenv.config()
moment.locale('es')
moment.tz.setDefault("Argentina/Buenos_Aires");

async function start() {

  // init logger
  const logger = Logger.createLogger({
    name: 'hd-api',
    level: process.env.LOG_LEVEL as Logger.LogLevel
  })

  // init server
  const server = createServer()
  server.use(plugins.queryParser({ mapParams: true }))
  server.use(plugins.bodyParser({ mapParams: true, mapFiles: true }))

  const cors = corsMiddleware({
    origins: ['*'],
    allowHeaders: ['Authorization'],
    exposeHeaders: ['Authorization']
  })

  server.pre(cors.preflight)
  server.use(cors.actual)

  // setup web database connection
  const webDB = await setupWebDatabase(logger)
  
  // setup smtp
  const infoTransport = createMailerTransport(process.env.SMTP_USER, process.env.SMTP_PASS)
  const adminTransport = createMailerTransport(process.env.SMTP_ADMINUSER, process.env.SMTP_ADMINPASS)

  // init context
  const context: Context = { logger, webDB, infoTransport, adminTransport }

  // setup routes
  setupRoutes(server, context)

  const doCronJobs = process.env.CRON_PENDING_MAILS === 'true' || process.env.CRON_PENDING_MAILS === undefined
  //if(doCronJobs) schedulePendingClassesAlerts(context)

  // start server
  server.listen(process.env.PORT || 8080, () => {
    logger.info(`Server started at ${process.env.PORT} or ${8080}`)
  })

}

process.on('uncaughtException', err => {
  console.error(err, 'Uncaught Exception thrown')
  process.exit(1)
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason)
  process.exit(1)
})

start().catch(err => {
  console.log('Error in is-api', err)
  process.exit(1)
})
