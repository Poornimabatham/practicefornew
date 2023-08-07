import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Post extends BaseModel {
  public static table = 'shiftmaster'
  @column({ isPrimary: true })
  public id: number

  @column()
  public Name:string

  
  @column()
  public Timein:DateTime
  
  @column()
  public Timeout:DateTime
  
  @column()
  public shifttype:string
  
  @column()
  public Hoursperday:number

}
