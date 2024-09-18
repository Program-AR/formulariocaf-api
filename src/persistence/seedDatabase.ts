import { Sequelize } from 'sequelize-typescript'
import { generatePassword } from '../utils'
import moment = require('moment')
import { delimiter } from 'path'

const postgresExistTable = async (sequelize: Sequelize) => {
  const { 0: { 0: response } } = await sequelize.query(
    'SELECT EXISTS(SELECT * FROM information_schema.tables WHERE table_schema = \'public\' AND table_name = \'User\')'
  )

  return (response as any).exists as boolean
}

export const seedQuestionData = async (sequelize: Sequelize) => {

  const shouldCreateData = process.env.SEED_DATABASE_QUESTIONS === 'true'

  if (shouldCreateData) {
    const csv = require('csvtojson');
    const csvQuestionFilePath = "data/questions.csv";
    

    // JSON-array of courses from CSV
    const questions = await csv({delimiter: '|'}).fromFile(csvQuestionFilePath);
    
    //await Questions.bulkCreate(questions);
  }
}


export const seedDatabase = async (sequelize: Sequelize, testing = false) => {

  const shouldCreateData = testing || !await postgresExistTable(sequelize)
  const shouldCreateFullData = testing || process.env.SEED_DATABASE === 'true'

  if (shouldCreateData || shouldCreateFullData) {
    await sequelize.sync({ force: true })

    const { User, Role, UserRole, Country } = sequelize.models

    const encodedPassword = generatePassword('admin')

    await Role.create({ id: 1, name: 'administrator' })
    await Role.create({ id: 2, name: 'person' })

    await User.create({
      id: 1,
      email: 'admin@test.com',
      ...encodedPassword
    })

    await Country.create({ id: 1, intlCode: 'ARG', description: 'Argentina', language: 'ES', ownerId: null, active: true })

    await UserRole.create({ userId: 1, roleId: 1 })
  }

  if (shouldCreateFullData) {

    const encodedPassword = generatePassword('person')

    const { User, UserRole, Person } = sequelize.models

    await User.create({
      id: 2,
      email: 'person@test.com',
      ...encodedPassword
    })

    await UserRole.create({ userId: 2, roleId: 2 })

    await Person.create({ ...basePerson, personType: 'A', id: 1, userId: 1 })

    await Person.create({
      id: 2,
      address: 'address 222',
      firstName: 'Roberto',
      lastName: 'Martinez',
      documentNumber: '22222222',
      phoneNumber: '1122222222',
      countryId: 1, 
      province: 'CABA',
      personType: 'U',
      userId: 2,
      locality: 'CABA',
      zipCode: '1402',
    })

  }

}

export const basePerson = {
  address: 'address 111',
  firstName: 'Pedro',
  lastName: 'Perez',
  documentNumber: '11111111',
  phoneNumber: '1122222222',
  province: 'Buenos Aires',
  countryId: 1, 
  userId: 2,
  locality: 'Olivos',
  zipCode: '1636'
}

