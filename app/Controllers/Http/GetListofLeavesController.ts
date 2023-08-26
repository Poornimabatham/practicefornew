import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GetListofLeaveValidator from 'App/Validators/GetListofLeaveValidator'
import getListofLeave from 'App/Services/getListofLeaveService';
export default class GetListofLeavesController {

    public async getListofLeaveAll({ request, response }: HttpContextContract) {

        const requestValidate = await request.validate(GetListofLeaveValidator.getListofLeaveAll);

        const service = await getListofLeave.getListofLeaveAll(requestValidate);

        return response.json(service);
    }

    public async getListofLeave({ request, response }: HttpContextContract) {

        const requestValidate = await request.validate(GetListofLeaveValidator.getListofLeave);

        const service = await getListofLeave.getListofLeave(requestValidate);

        return response.json(service);
    }

    public async withdrawLeave({ request, response }: HttpContextContract) {

        const requestValidate = await request.validate(GetListofLeaveValidator.withdrawLeave);

        const service = await getListofLeave.withdrawLeave(requestValidate);

        return response.json(service);
    }
}
