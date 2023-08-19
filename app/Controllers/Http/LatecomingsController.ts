import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LateComingService from 'App/Services/LateComingService'
import LatecomingValidator from 'App/Validators/LatecomingValidator'
export default class LatecomingsController {
    public async FetchLateComings({request,response  }: HttpContextContract) {
    const a = await  request.validate(LatecomingValidator.fetchlatecomingsschema)
    const b = await  LateComingService.getLateComing(a)
    return  response.json(b)
    
    }
}
