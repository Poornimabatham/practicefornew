import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SendNotificationDiffOrgEmployeeValidator from 'App/Validators/SendNotificationDiffOrgEmployeeValidator';
import SendNotificationDiffOrgEmployee from 'App/Services/SendNotificationDiffOrgEmployee';

export default class SendNotificationDiffOrgEmployeesController {

    public async SendNotificationDiffOrgEmployees({ request, response }: HttpContextContract) {

        const requestValidate = await request.validate(SendNotificationDiffOrgEmployeeValidator.SendNotificationDiffOrgEmployee);

        const serviceResult = await SendNotificationDiffOrgEmployee.SendNotificationDiffOrgEmployee(requestValidate);

        return response.json(serviceResult);
    }
}
