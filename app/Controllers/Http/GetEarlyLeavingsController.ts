import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GetEarlyLeavingValidator from 'App/Validators/GetEarlyLeavingValidator'
import getEarlyLeavingsService from 'App/Services/getEarlyLeavingsService';

export default class GetEarlyLeavingsController {
  private data = [];
  public async getEarlyLeavings({ request, response }: HttpContextContract) {
    var getvalidData = await request.validate(
      GetEarlyLeavingValidator.EarlyLeavingScehma
    );
    this.data["uid"] = getvalidData.uid ? getvalidData.uid : 0;
    this.data["orgid"] = getvalidData.orgid ? getvalidData.orgid : 0;
    this.data["csv"] = getvalidData.csv ? getvalidData.csv : " ";
    this.data["currentPage"] = getvalidData.currentPage
      ? getvalidData.currentPage
      : 2;
    this.data["perPage"] = getvalidData.perPage ? getvalidData.perPage : 10;
    this.data["cdate"] = getvalidData.cdate ? getvalidData.cdate : 0;

    var fetchEarlyLeavers = await getEarlyLeavingsService.EarlyLeavers(
      this.data
    );
    return response.json(fetchEarlyLeavers);
  }

  public async getEarlyLeavingsCsv({ request, response }: HttpContextContract) {
    var getvalidData = await request.validate(
      GetEarlyLeavingValidator.EarlyLeavingCsvScehma
    );
    this.data["uid"] = getvalidData.uid ? getvalidData.uid : 0;
    this.data["orgid"] = getvalidData.orgid ? getvalidData.orgid : 0;
    this.data["csv"] = getvalidData.csv ? getvalidData.csv : " ";
    this.data["cdate"] = getvalidData.cdate ? getvalidData.cdate : 0;

    var fetchEarlyLeavers = await getEarlyLeavingsService.EarlyLeaversCsv(
      this.data
    );
    return response.json(fetchEarlyLeavers);
  }
}
