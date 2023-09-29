import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'

import Hash from '@ioc:Adonis/Core/Hash'
export default class User2 extends BaseModel {
  public static table = 'employee'
  @column({ isPrimary: true })
  public empid: number
  

  @column()
  public fname: string

  
  @column()
  public lname: string

  
  @column()
  public password:string
  @beforeSave()
  public static async hashPassword (user: User2) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
  
  @column()
  public email: string

  
  @column()
  public phone:number

}
