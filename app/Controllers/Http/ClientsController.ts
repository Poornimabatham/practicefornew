import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ClientService from 'App/Services/ClientsService'
import ClientValidator from 'App/Validators/ClientValidator'

export default class ClientsController {
  public async index({ request, response }: HttpContextContract) {
    await request.validate(ClientValidator.ClientSchema)
    const alldata = await request.all()
    const b = await ClientService.ClientData(alldata)
    response.json(b);
  }

  public async create({ request, response }: HttpContextContract) {
    const inclient = await request.validate(ClientValidator.addClientSchema)
    const res = await ClientService.addClient(inclient);
    response.json(res);
  }

  public async edit({ request, response }: HttpContextContract) {
    const editclient = await request.validate(ClientValidator.updateClientSchema);
    const res = await ClientService.editClient(editclient);
    response.json(res);
  }


  public async getClientList({ request, response }: HttpContextContract) {
    const clientdata = await request.all();
    const res = await ClientService.getClientList(clientdata);
    response.json(res);

  }

  public async show({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
