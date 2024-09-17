import { AllowNull, Column, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Role } from './Role'
import { User } from './User'

@Table({
  tableName: 'UserRoleMap',  
  schema: 'public',
  timestamps: false
})
export class UserRole extends Model<UserRole> {

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  userId: number

  @AllowNull(false)
  @ForeignKey(() => Role)
  @Column
  roleId: number

}