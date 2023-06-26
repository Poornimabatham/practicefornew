import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User2 extends BaseModel {
  public static table = 'employee'
  @column({ isPrimary: true })
  public empid: number
  

  @column()
  public fname: string

  
  @column()
  public lname: string

  
  @column()
  public password: number

  
  @column()
  public email: string

  
  @column()
  public phone:number

}
