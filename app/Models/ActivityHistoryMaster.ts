import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ActivityHistoryMaster extends BaseModel {
  public static table = 'ActivityHistoryMaster'

  @column({ isPrimary: true })
  public Id: number

  @column.dateTime({ autoCreate: true })
  public LastModifiedDate: DateTime

  @column({columnName:'adminid'})
  public adminid: number

  @column({columnName:'AppModule'})
  public AppModule: string

  @column({columnName:'LastModifiedById'})
  public LastModifiedById: number

  @column({columnName:'Designation'})
  public Designation: string

  @column({columnName:'Module'})
  public Module: string

  @column({columnName:'ActionPerformed'})
  public ActionPerformed: string

  @column({columnName:'OrganizationId'})
  public OrganizationId: number

  @column({columnName:'ActivityBy'})
  public ActivityBy: number
}