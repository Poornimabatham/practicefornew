import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class EmployeeMaster extends BaseModel {
  public static table = 'EmployeeMaster'

  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column({columnName:'timezone'})
  public timezone: string

  @column({columnName:'CurrentCountry'})
  public CurrentCountry: number
}
