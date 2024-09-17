import * as Logger from 'bunyan'
import { Sequelize } from 'sequelize-typescript'
import { Moment } from 'moment'
import Mail = require('nodemailer/lib/mailer')

declare module 'restify' {
  interface Request {
    context: Context
    user: TokenData
    filterByRole?: any
    dbQuery?: any
  }
}

export interface Context {
  logger: Logger
  webDB: Sequelize
  infoTransport: Mail
  adminTransport: Mail
}

export type RoleValue = 'administrator' | 'other' | 'person'
  
export interface TokenData {
  userId: number
  personId?: number
  countryId?: number
  roles: RoleValue[]
}

export interface EncodedPassword {
  salt: string
  hashedPassword: string
}


export type JSON<Entity> = {
  [Attr in keyof Partial<Entity>]: JSONAtrribute<Entity[Attr]>
} | {
  id?: number
}

type JSONAtrribute<T> = number extends T ? number : string extends T ? string : Date extends T ? string | Date | Moment : JSON<T>

export const isAdmin = (user: TokenData) => user.roles.includes('administrator')
export const isPerson = (user: TokenData) => user.roles.includes('person')
