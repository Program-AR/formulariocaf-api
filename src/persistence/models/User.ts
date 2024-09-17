import { AllowNull, BelongsToMany, Column, DataType, Default, HasOne, IsEmail, Model, Table, Unique } from 'sequelize-typescript'
import { RoleValue } from '../../typings/common'
import { Person } from './Person'
import { Role } from './Role'
import { UserRole } from './UserRole'
import { Moment } from 'moment'
import moment = require('moment')

@Table({
  tableName: 'User',
  schema: 'public',
  timestamps: false,
  defaultScope: {
    attributes: { exclude: ['hashedPassword', 'salt'] }
  }
})
export class User extends Model<User> {

  @AllowNull(false)  
  @IsEmail
  @Unique
  @Column
  email: string

  @AllowNull(false)
  @Column
  hashedPassword: string

  @AllowNull(false)
  @Column
  salt: string

  @AllowNull(false)
  @Default(true)
  @Column
  shouldUpdatePassword: boolean

  @AllowNull(true)
  @Column(DataType.DATE)
  expiredDate: Date

  @BelongsToMany(() => Role, () => UserRole)
  roles: Role[]

  roleValues() {
    return this.roles.map(r => r.name) as RoleValue[]
  }

  @HasOne(() => Person)
  profile: Person | null

  expired(): Moment {
    return moment(this.expiredDate)
  }

}