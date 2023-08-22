import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ShiftMaster extends BaseModel {
  public static table = 'ShiftMaster'

  @column({ isPrimary: true , columnName:'Id'})
  public Id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column({columnName:'shifttype'})  
  public shifttype: number

  @column({columnName:'MultipletimeStatus'})  
  public MultipletimeStatus: number
}