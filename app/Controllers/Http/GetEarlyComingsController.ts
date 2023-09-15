import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GetEarlyComingValidator from 'App/Validators/GetEarlyComingValidator';
import GetEarlyComingsService from 'App/Services/GetEarlyComingsService';

export default class GetEarlyComingsController {
  private data = [];
  public async getEarlyComings({ request, response }: HttpContextContract) {
    const ReqData = await request.validate(
      GetEarlyComingValidator.EarlyCommersScehma
    );

    this.data["uid"] = ReqData.uid ? ReqData.uid : 0;
    this.data["orgid"] = ReqData.orgid ? ReqData.orgid : 0;
    this.data["csv"] = ReqData.csv ? ReqData.csv : " ";
    this.data["currentPage"] = ReqData.currentPage ? ReqData.currentPage : 2;
    this.data["perPage"] = ReqData.perPage ? ReqData.perPage : 10;
    this.data["cdate"] = ReqData.cdate ? ReqData.cdate : 0;

    const getResultFromService = await GetEarlyComingsService.EarlyCommers(
      this.data
    );

    return response.json(getResultFromService);
  }

  public async getEarlyComingsCsv({ request, response }: HttpContextContract) {
    const ReqData = await request.validate(
      GetEarlyComingValidator.EarlyCommersCsvScehma
    );

    this.data["uid"] = ReqData.uid ? ReqData.uid : 0;
    this.data["orgid"] = ReqData.orgid ? ReqData.orgid : 0;
    this.data["csv"] = ReqData.csv ? ReqData.csv : " ";
    this.data["cdate"] = ReqData.cdate ? ReqData.cdate : 0;

    const getResultFromService = await GetEarlyComingsService.EarlyCommersCsv(
      this.data
    );

    return response.json(getResultFromService);
  }
}
