import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GetEarlyLeavingValidator from 'App/Validators/GetEarlyLeavingValidator'
import getEarlyLeavingsService from 'App/Services/getEarlyLeavingsService';
import { Response } from '@adonisjs/core/build/standalone';

export default class GetEarlyLeavingsController {
    private data: any = [];
    public async getEarlyLeavings({request,response}:HttpContextContract){

      var getvalidData = await request.validate(GetEarlyLeavingValidator.EarlyLeavingScehma);
      
      this.data['empid'] = getvalidData.empid ? getvalidData.empid : 0;
      this.data['deptId'] = getvalidData.deptId ? getvalidData.deptId : 0;
      this.data['orgid'] = getvalidData.orgid ? getvalidData.orgid : 0;
      this.data['csv'] = getvalidData.csv ? getvalidData.csv : " ";
      this.data['currentPage'] = getvalidData.currentPage ? getvalidData.currentPage : 2;
      this.data['perPage'] = getvalidData.perPage ? getvalidData.perPage : 10;
      this.data['date'] = getvalidData.date ? getvalidData.date : 0;

      var fetchEarlyLeavers = await getEarlyLeavingsService.EarlyLeavers(this.data) ;
      return response.json(fetchEarlyLeavers)
    }
}
