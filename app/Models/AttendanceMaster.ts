import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class AttendanceMaster extends BaseModel {
  public static table = 'AttendanceMaster'

  @column({ isPrimary: true })
  public Id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
 
  @column({ columnName:"multitime_sts"})
  public multitime_sts: number

  @column({ columnName:"TimeIn"})
  public TimeIn: string

  @column({ columnName:"TimeOut"})
  public TimeOut: string
  
  @column({ columnName:"EmployeeId"})
  public EmployeeId: number

}
