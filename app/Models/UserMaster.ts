import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserMaster extends BaseModel {
  public static table = 'UserMaster'

  @column({columnName: "Id", isPrimary: true })
  public Id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column({ columnName: "Password" })
  public password: String

  @column({columnName: "username_mobile" })
  public usernamemobile: String

  @column({columnName: "Username"})
  public username: String

}
