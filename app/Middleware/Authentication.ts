import Redis from '@ioc:Adonis/Addons/Redis';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Authentication {
  public async handle({response}: HttpContextContract, next: () => Promise<void>) {
 
      const apitoken:any = await Redis.get('token')
      
      
      response.header('Authorization','Bearer Y2xsdXdjOGJ3MDAwMDdndXM1dTNyOGZ3cA.hEO2bMSCK7l3KLsH5iGooOxpf6IeyElgjDQA1RVDtBtA0b3EaHi90IPBeOL7'
);

    await next()
  }
}
