import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ClientService from 'App/Services/ClientsService'
import ClientValidator from 'App/Validators/ClientValidator'

export default class ClientsController {
  public async index({ request, response }: HttpContextContract) {
    await request.validate(ClientValidator.ClientSchema);
    const alldata = await request.all();
    const b = await ClientService.ClientData(alldata);
    response.json(b);
  }

  public async create({ request, response }: HttpContextContract) {
    const inclient = await request.validate(ClientValidator.addClientSchema);
    const res = await ClientService.addClient(inclient);
    response.json(res);
  }

  public async edit({ request, response }: HttpContextContract) {
    const editclient = await request.validate(
      ClientValidator.updateClientSchema
    );
    const res = await ClientService.editClient(editclient);
    response.json(res);
  }

  public async getClientList({ request, response }: HttpContextContract) {
    const clientdata = await request.validate(
      ClientValidator.getClientListSchema
    );
    const res = await ClientService.getClientList(clientdata);
    response.json(res);
  }
  private data = [];
  public async assignMultipleClient({ request, response }: HttpContextContract) {
    const getclientdata = await request.validate(ClientValidator.assignMultipleClient);
    
      this.data["Orgid"] = getclientdata.Orgid ? getclientdata.Orgid : 0;
      this.data["clientid"] = getclientdata.clientid ? getclientdata.clientid : 0;
      this.data["clientname"] = getclientdata.clientname? getclientdata.clientname: 0;
      this.data["empid"] = getclientdata.empid ? getclientdata.empid : " ";
      this.data["adminid"] = getclientdata.adminid ? getclientdata.adminid : 0;
      this.data["empname"] = getclientdata.empname ? getclientdata.empname : 0;
      this.data["adminname"] = getclientdata.adminname? getclientdata.adminname: 0;
    const res = await ClientService.assignMultipleClient(this.data);
    return response.json(res);
  }
  
  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
