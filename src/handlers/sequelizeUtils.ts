import * as sequelize from 'sequelize'
import { Op, FindOptions } from 'sequelize'
import { deleteUndefined } from '../utils/filters'

/**
 * It is a database independant LIKE Sequelize where object, case insensitive, and accent/diacritic insensitive.
 * 
 * Example:
 * `Client.findOne({where: textLikeFilter('boss.name','rau')})`
 * Will find client whose boss' name is "Raúl" in the db
 * @param field The column name
 * @param value The value to be compared
 * 
 * Why is this needed?
 * Every damn database solves this in a different way. 
 * SQLITE (our testing database) solves accentuations and case-insensitive queries with collations that are not supported by PosgreSQL (our production database).
 * If you also didn't know what a collation was: https://dba.stackexchange.com/a/4272
 * PostgreSQL solves case-insensitiveness with "ILIKE" operator and accentuation queries with the "unaccented" function, both of which are not supported by SQLITE.
 * Shame on PostgreSQL, collations like Latin1_General_CI_AI are a very easy way to forget about this, and could be set via sequelize globally.
 */
export const textLikeFilter = (field: string, value: string) => {
  //if (field.indexOf('.') < 0) throw new Error("Field name should have at least one point")
  return {
    [`$${field}$`]: value && sequelize.where(
      withoutAccentsField(toLowercase(field)),
      'LIKE',
      `%${withoutAccents(value.toLowerCase())}%`)
  }
}

export const textNotLikeFilter = (field: string, value: string) => {
  //if (field.indexOf('.') < 0) throw new Error("Field name should have at least one point")
  return {
    [`$${field}$`]: value && sequelize.where(
      withoutAccentsField(toLowercase(field)),
      'NOT LIKE',
      `%${withoutAccents(value.toLowerCase())}%`)
  }
}

export const personNameFilter = (fullName: string, table: string = 'person') => {
  return {
    [`$${table}$`]: fullName && sequelize.where(withoutAccentsField(sequelize.fn('LOWER', sequelize.literal(`"${table}"."lastName" || ' ' || "${table}"."firstName"`))),
    withoutAccents(fullName.toLowerCase()))
  }
}

export const numFilter = (name: string, value?: number) => value !== undefined
  ? { [`$${name}$`]: value }
  : {}

const withoutAccents = (theText: string): string =>
  theText.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

/**
 * Shitty composition of REPLACES to replace one by one the problematic chars.
 * @param field The column name
 */
const withoutAccentsField = field =>
  accented.reduce((replaced, car, i) => sequelize.fn('REPLACE', replaced, car, unaccented[i]), field)

// I didn't put more chars because SQL logs would be even harder to read with tens of nested REPLACE
const accented = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', 'Á', 'É', 'Í', 'Ó', 'Ú', 'Ü', 'Ñ']
const unaccented = ['a', 'e', 'i', 'o', 'u', 'u', 'n', 'a', 'e', 'i', 'o', 'u', 'u', 'n']

const toLowercase = (fieldName: string) =>
  sequelize.fn('LOWER', sequelize.col(fieldName))


export const assignWhere = (filter: any) => (query: FindOptions) => {
  const { where } = query
  query.where = deleteUndefined(Object.assign(where || {}, filter))
  return query
}

export const andClause = (where1: any, where2: any) => where1 && where2 ? { [Op.and]: [where1, where2] } : where1 || where2
export const orClause = (where1: any, where2: any) => where1 && where2 ? { [Op.or]: [where1, where2] } : where1 || where2
export const inClause = (inArray: any) => inArray ? { [Op.in]: inArray } : inArray