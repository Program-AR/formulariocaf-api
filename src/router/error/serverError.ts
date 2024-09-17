type ServerErrorProps = {
  message: string,
  statusCode: number
}

export default class ServerError extends Error {
  statusCode: number

  constructor({ message, statusCode }: ServerErrorProps) {
    super(message)
    this.statusCode = statusCode
  }
}

export class EntityNotFound extends ServerError {

  constructor(entity: string) {
    super({ message: `Entity ${entity} was not found`, statusCode: 404 })
  }

}

export class BadRequest extends ServerError {

  constructor(message: string = 'BadRequest') {
    super({ message, statusCode: 400 })
  }

}

export class Unauthorized extends ServerError {

  constructor(message: string = 'Unauthorized') {
    super({ message, statusCode: 401 })
  }

}

export class Forbidden extends ServerError {

  constructor(message: string = 'Forbidden') {
    super({ message, statusCode: 403 })
  }

}

export class ForbiddenParameters extends Forbidden {

  constructor(...fields: string[]) {
    super(`Forbidden parameters: ${fields}`)
  }

}

export class PreconditionFailed extends ServerError {

  constructor(message: string = 'PreconditionFailed') {
    super({ message, statusCode: 412 })
  }

}

export class ParametersNotFound extends ServerError {

  constructor(...fields: string[]) {
    super({ message: `Missing parameters: ${fields}`, statusCode: 400 })
  }

}

export class BodyParametersNotFound extends ServerError {

  constructor(...fields: string[]) {
    super({ message: `Missing body parameters: ${fields}`, statusCode: 400 })
  }

}

export class BodyNotFound extends ServerError {

  constructor() {
    super({ message: `Missing body`, statusCode: 400 })
  }

}