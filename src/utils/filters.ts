import { inClause, orClause } from '../handlers/sequelizeUtils'

export const booleanFilter = (value: string): boolean | undefined => {
  switch (value) {
    case 'true':
      return true
    case 'false':
      return false
  }
}

export const deleteUndefined = (obj) => {
  Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])
  return obj
}

export const inFilter = (params: any) => {
  return ( params && params.indexOf(',') > 0 ) ? inClause(params.split(',')) : params
}

export const multipleOrFilter = (params: string, oneFilter: any): any => {

  const arrayParams = params.split(',')

  return arrayParams && arrayParams.reduce((result: any, type: string) => orClause(result, oneFilter(type)), oneFilter(arrayParams[0]))
}

export const multipleOrFilters = ( params: string, oneFilter: any ): any => {
  if( params !== undefined )
  {
    if( params.indexOf(',') > 0 ) 
      return multipleOrFilter(params, oneFilter)
    else
      return oneFilter(params)
  }
  return undefined
}
