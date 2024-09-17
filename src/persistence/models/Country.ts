import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Person } from './Person'

@Table({
  tableName: 'Country',
  schema: 'public',
  timestamps: false,
})

export class Country extends Model<Country> {

  @AllowNull(false)
  @Column
  intlCode: string

  @AllowNull(false)
  @Column
  description: string

  @AllowNull(false)
  @Column
  language: string

  @AllowNull(true)
  @ForeignKey(() => Person)
  @Column
  ownerId: number

  @BelongsTo(() => Person)
  owner: Person

  @AllowNull(true)
  @Column
  active: boolean

}