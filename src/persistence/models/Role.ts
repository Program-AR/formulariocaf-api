import { AllowNull, BelongsToMany, Column, Model, Table, Unique } from 'sequelize-typescript'
import { User } from './User'
import { UserRole } from './UserRole'

@Table({
  tableName: 'Role',
  schema: 'public',
  timestamps: false
})
export class Role extends Model<Role> {

  @AllowNull(false)
  @Unique
  @Column
  name: string

  @BelongsToMany(() => User, () => UserRole)
  users: User[]

}