import { isEmpty } from 'ramda'
import { FindOptions, Op, Sequelize } from 'sequelize'
import { textLikeFilter } from './sequelizeUtils'

export default class Omnisearch {

    makeQuery({ model, search, fields }): FindOptions {
        const where = {}
        const searchTexts: string[] = search.split(" ").filter((searchField: string) => !isEmpty(searchField))

        if (!isEmpty(searchTexts) && !isEmpty(fields)) {
            where[Op.and] = searchTexts.map(searchText => Sequelize.or(...fields.map((fieldName: string) =>
                textLikeFilter(`${model.name}.${fieldName}`, searchText)))
            )
        }

        return { where }
    }

}