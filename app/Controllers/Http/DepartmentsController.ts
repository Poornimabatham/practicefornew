import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import DepartmentValidator from "App/Validators/DepartmentValidator";
import DepartmentService from "App/Services/DepartmentService";


export default class DepartmentsController {

  public async getdepartment({ request, response }: HttpContextContract) {

    const requestValidate = await request.validate(DepartmentValidator.getDepartment);

    const service: any = await DepartmentService.getdepartment(requestValidate);

    if (service.length > 0) {
      response.status(200).send({ message: "Success", data: service });
    } else {
      response.status(400).send({ message: "Unsuccess", data: service });
    }
  }

  public async addDepartment({ request, response }: HttpContextContract) {

    const requestValidate = await request.validate(DepartmentValidator.addDepartment);

    const service = await DepartmentService.addDepartment(requestValidate);

    return response.json(service);
  }

  public async updateDepartment({ request, response }: HttpContextContract) {

    const requestValidate = await request.validate(DepartmentValidator.updateDepartment);

    const service = await DepartmentService.updateDepartment(requestValidate);

    return response.json(service);
  }
}
