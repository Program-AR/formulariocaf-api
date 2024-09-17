import { Model, ModelCtor } from 'sequelize/types'
import { EntityNotFound } from '../router/error/serverError'

export const findOne = async (model: ModelCtor<Model<any, any>>, options: any) => {

    const requested = await model.findOne(options)

    if (!requested) {
        throw new EntityNotFound(model.name)
    }

    else {
        return requested
    }

}