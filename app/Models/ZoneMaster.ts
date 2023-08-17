import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ZoneMaster extends BaseModel {
  public static table = 'ZoneMaster'

  @column({ isPrimary: true })
  public Id: number
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column({columnName:'Name'})
  public Name: string
}
