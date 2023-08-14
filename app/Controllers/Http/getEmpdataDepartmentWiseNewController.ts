import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import getEmpdataDepartmentWiseNewService from 'App/Services/getEmpdataDepartmentWiseNewService'
import getEmpdataDepartmentWiseNewValidator from 'App/Validators/getEmpdataDepartmentWiseNewValidator'

export default class getEmpdataDepartmentWiseNewController{
    private data = []
    public async getEmpdataDepartmentWise({request,response}:HttpContextContract){

    const ReqData = await request.validate(getEmpdataDepartmentWiseNewValidator.getEmpdataDepartmentWiseNewScehma);
    
    this.data["orgid"] = ReqData.orgid? ReqData.orgid:0;
    this.data["date"] = ReqData.date? ReqData.date: 0;

    const result = await getEmpdataDepartmentWiseNewService.getEmpDepartmentWise(this.data)

    return result;
 }
}