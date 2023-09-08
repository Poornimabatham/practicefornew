import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class EmployeeMaster extends BaseModel {
  public static table = 'EmployeeMaster'

  @column({ isPrimary: true })
  public Id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column({columnName:'timezone'})
  public timezone: string

  @column({columnName:'CurrentCountry'})
  public CurrentCountry: number

  @column({columnName:'Department'})
  public Department: number

  @column({columnName:'Designation'})
  public Designation: number

  @column({columnName:'OrganizationId'})
  public OrganizationId: number

  @column({columnName:'area_assigned'})
  public area_assigned: number

  @column({columnName:'hourly_rate'})
  public hourly_rate: number

  @column({columnName:'OwnerId'})
  public OwnerId: number
  
  @column({columnName:'Shift'})
  public Shift: number
}