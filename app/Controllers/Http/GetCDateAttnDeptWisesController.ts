import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import getCDateAttnDeptWiseService from 'App/Services/getCDateAttnDeptWiseService'
import GetCDateAttnDeptWiseValidator from 'App/Validators/GetCDateAttnDeptWiseValidator'

export default class GetCDateAttnDeptWisesController {
    private data = []
    public async getCDateAttnDeptWise({request,response}:HttpContextContract){

        const getvalidData = await request.validate(GetCDateAttnDeptWiseValidator.GetCDateAttnDeptWise_getx)

        this.data['dept'] = getvalidData.dept ? getvalidData.dept: 0;
        this.data['att'] = getvalidData.att ? getvalidData.att : 0;
        this.data['orgid'] = getvalidData.orgid ? getvalidData.orgid : 0;
        this.data['csv'] = getvalidData.csv ? getvalidData.csv : " ";
        this.data['currentPage'] = getvalidData.currentPage ? getvalidData.currentPage : 2;
        this.data['perPage'] = getvalidData.perPage ? getvalidData.perPage : 10;
        this.data['datafor'] = getvalidData.datafor ? getvalidData.datafor : 0;
        this.data['date'] = getvalidData.date ? getvalidData.date : 0;


        const getResponsefromService = await getCDateAttnDeptWiseService.getCDateAttnDeptWise(this.data)

        return response.json(getResponsefromService);
    }
}
