import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from './User'
import { GeneralDesc } from './GeneralDesc'
import { Country } from './Country'

export enum PersonTypes {
  Other = "O",
  Admin = "A",
  Person = "U"
}

export const personTypeToDescription = (type: PersonType): string => {
  switch (type) {
    case 'O': return "other"
    case 'A': return "admin"
    case 'U': return "person"
  }
  return "not"
}



export type PersonType = 'O' | 'A' | 'U'

export const PersonTypeToRoleId = (pt: PersonType) => {
  switch (pt) {
    case 'A': return 1;
    case 'U': return 2;
    case 'O': return 99;
  }
}

@Table({
  tableName: 'Person',
  schema: 'public',
  timestamps: false,
})

export class Person extends Model<Person> {

  @AllowNull(false)
  @Column
  documentNumber: string

  @AllowNull(false)
  @Column
  lastName: string

  @AllowNull(false)
  @Column
  firstName: string

  @Column({
    type: DataType.VIRTUAL,
    get(this: Person): string {
      return `${this.lastName} ${this.firstName}`
    }
  })
  fullName: string

  @Column({
    type: DataType.VIRTUAL,
    get(this: Person): string | undefined {
      return this.user ? this.user.email : undefined
    }
  })
  email?: string

  @Column({
    type: DataType.VIRTUAL,
    get(this: Person): Date | undefined {
      return this.user ? this.user.expiredDate : undefined
    }
  })
  expiredDate?: Date

  @AllowNull(true)
  @Column
  personType: PersonType

  @AllowNull(false)
  @Column
  phoneNumber: string

  @AllowNull(false)
  @ForeignKey(() => Country)
  @Column
  countryId: number

  @Column({
    type: DataType.VIRTUAL,
    get(this: Person): string | undefined {
      return this.countryId && this.countries ? this.countries.description : undefined
    }
  })
  country?: string

  @BelongsTo(() => Country)
  countries?: Country

  @AllowNull(true)
  @ForeignKey(() => GeneralDesc)
  @Column
  regionId: number

  @BelongsTo(() => GeneralDesc, { as: 'generalRegions', foreignKey: 'regionId' }  )
  regions?: GeneralDesc

  @Column({
    type: DataType.VIRTUAL,
    get(this: Person): string | undefined {
      return this.regionId && this.regions ? this.regions.description : undefined
    }
  })
  region?: string

  @AllowNull(true)
  @ForeignKey(() => GeneralDesc)
  @Column
  areaId: number

  @BelongsTo(() => GeneralDesc, { as: 'generalAreas', foreignKey: 'areaId' }  )
  areas?: GeneralDesc

  @Column({
    type: DataType.VIRTUAL,
    get(this: Person): string | undefined {
      return this.areaId && this.areas ? this.areas.description : undefined
    }
  })
  area?: string

  @AllowNull(true)
  @Column
  position: string

  @AllowNull(true)
  @Column
  organization: string

  @AllowNull(true)
  @Column
  gender: string

  @AllowNull(true)
  @Column
  seniority: number

  @AllowNull(true)
  @Column
  province: string

  @AllowNull(true)
  @Column
  locality: string

  @AllowNull(true)
  @Column
  address: string

  @AllowNull(true)
  @Column
  zipCode: string

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  userId: number

  @BelongsTo(() => User)
  user: User

}