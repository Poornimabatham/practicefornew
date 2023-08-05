import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GetEarlyComingValidator from 'App/Validators/GetEarlyComingValidator';
import GetEarlyComingsService from 'App/Services/GetEarlyComingsService';

export default class GetEarlyComingsController {
 
private data: any = [];
public async getEarlyComings({request,response}:HttpContextContract){

  const ReqData = await request.validate(GetEarlyComingValidator.EarlyCommersScehma);

  this.data['empid'] = ReqData.empid ? ReqData.empid : 0;
  this.data['deptId'] = ReqData.deptId ? ReqData.deptId : 0;
  this.data['orgid'] = ReqData.orgid ? ReqData.orgid : 0;
  this.data['csv'] = ReqData.csv ? ReqData.csv : " ";
  this.data['currentPage'] = ReqData.currentPage ? ReqData.currentPage : 2;
  this.data['perPage'] = ReqData.perPage ? ReqData.perPage : 10;
  this.data['date'] = ReqData.date ? ReqData.date : 0;
  
  const getResultFromService = await GetEarlyComingsService.EarlyCommers(this.data)
  
  return response.json(getResultFromService);

  }
}
