import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GeofenceValidator from 'App/Validators/GeofenceValidator'
import getgeofenceservice from 'App/Services/GeofenceService';

export default class GeofencesController {
  public async getgeofence({ request, response }: HttpContextContract) {
    const req = await request.validate(GeofenceValidator.getgeofence);

    const ser = await getgeofenceservice.getgeofence(req);

    return response.json(ser);
  }

  public async addgeofence({ request, response }: HttpContextContract) {
    const req = await request.validate(GeofenceValidator.addgeofence);

    const ser = await getgeofenceservice.addgeofence(req);

    return response.json(ser);
  }
  public async addpolygon({ request, response }: HttpContextContract) {
    const req = await request.validate(GeofenceValidator.addpolygon);
    const result = await getgeofenceservice.addpolygon(req);
    console.log(result);
    return response.json(result);
  }
  public async assignGeoFenceEmployee({
    request,
    response,
  }: HttpContextContract) {
    const req = await request.validate(GeofenceValidator.assignGeofence);
    const res = await getgeofenceservice.assignGeoFenceEmployee(req);
    return response.json(res);
  }
    private data= []
    public async deleteGeoFence({ request, response }: HttpContextContract){
        let validdata = await request.validate(GeofenceValidator.deleteGeoFence);
        this.data["area_assigned"] = validdata.area_assigned ? validdata.area_assigned : " ";
        this.data["OrganizationId"] = validdata.OrganizationId ? validdata.OrganizationId : " ";
      let serviceresp = await getgeofenceservice.deleteGeoFence(validdata)
      return response.json(serviceresp);
  }
}
