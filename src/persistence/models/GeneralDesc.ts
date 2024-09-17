import { AllowNull, BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Person } from './Person';

export enum DescTypes {
  reg = 'Region',
  are = 'Area',
  }
  
export type DescType = 'reg' | 'are'

@Table({
  tableName: 'GeneralDesc',
  schema: 'public',
  timestamps: false
})

export class GeneralDesc extends Model<GeneralDesc> {

  @AllowNull(true)
  @Column
  type: DescType

  @AllowNull(true)
  @Column
  description: string

  @AllowNull(true)
  @Column
  remarks: string
 
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
