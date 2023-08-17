import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import getInfoService from "App/Services/getInfoService";
import GetInfoValidator from "App/Validators/GetInfoValidator";

export default class GetInfoController 
{
    public async getInfo({request,response}: HttpContextContract)
    { 
        await request.validate(GetInfoValidator.GetInfoSchema)
        const alldata =await request.all()  
        const res = await getInfoService.getInfo(alldata)
        response.json(res);
    }
}
