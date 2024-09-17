import { Server } from 'restify'
import validateBody from './middleware/validateBody'
import validateParams from './middleware/validateParams'
import authByRole from './middleware/authByRole'
import authWithToken from './middleware/authWithToken'
import { Context } from '../typings/common'
import errorHandler from './error/errorHandler'
import login from '../handlers/auth/login'
import passwordRecovery from '../handlers/auth/passwordRecovery'
import passwordUpdate from '../handlers/auth/passwordUpdate'
import session from '../handlers/auth/session'

import profile from '../handlers/profile/profile'
import profileUpdate from '../handlers/profile/profileUpdate'
import personDetail from '../handlers/person/personDetail'
import personList from '../handlers/person/personList'
import personUpsert from '../handlers/person/personUpsert'
import generalDescList from '../handlers/generalDescList'
import countries from '../handlers/countries'

//import uploadComplaintMessageFile from '../handlers/complaint/uploadComplaintMessageFile'
//import downloadComplaintMessageFile from '../handlers/complaint/downloadComplaintMessageFile'

export const setupRoutes = (server: Server, context: Context) => {

  server.use((req, _res, next) => {
    req.context = context
    next()
  })

  server.post('/auth', validateBody('email', 'password'), login)
  server.post('/auth/password-recovery', validateBody('email'), passwordRecovery)
  server.get('/session', authWithToken, session)
  server.put('/session/password', authWithToken, validateBody('newPassword'), passwordUpdate)

  server.get('/generalDesc', authWithToken, generalDescList )
  server.get('/countries', authWithToken, countries )

  server.get('/profile', authWithToken, profile)
  server.put('/profile', authWithToken, profileUpdate)

  server.get('/people', authByRole('administrator'), personList)
  server.post('/people', authByRole('administrator'), validateBody('firstName', 'lastName', 'phoneNumber', 'documentNumber', 'province', 'email'), personUpsert)
  server.get('/people/:personId', authByRole('administrator'), personDetail)
  server.put('/people/:personId', authByRole('administrator'), validateBody('firstName', 'lastName', 'phoneNumber', 'documentNumber', 'province', 'email'), personUpsert)

//  server.post('/complaints/message/upload/:complaintId', authByRole('administrator', 'headsales', 'staff', 'client'), uploadComplaintMessageFile)
//  server.get('/complaints/message/download', authByRole('administrator', 'headsales', 'staff', 'client'), downloadComplaintMessageFile)
 
  server.on('restifyError', errorHandler)
}