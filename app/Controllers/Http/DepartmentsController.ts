import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import DepartmentValidator from "App/Validators/DepartmentValidator";
import DepartmentService from "App/Services/DepartmentService";
export default class DepartmentsController {
  private data = [];
  public async getdepartment({ request, response }: HttpContextContract) {
    const requestValidate = await request.validate(
      DepartmentValidator.getDepartment
    );

    const service: any = await DepartmentService.getdepartment(requestValidate);

    if (service.length > 0) {
      response.status(200).send({ message: "Success", data: service });
    } else {
      response.status(400).send({ message: "Unsuccess", data: service });
    }
  }

  public async addDepartment({ request, response }: HttpContextContract) {
    const requestValidate = await request.validate(
      DepartmentValidator.addDepartment
    );

    const service = await DepartmentService.addDepartment(requestValidate);

    return response.json(service);
  }

  public async updateDepartment({ request, response }: HttpContextContract) {
    const requestValidate = await request.validate(
      DepartmentValidator.updateDepartment
    );

    const service = await DepartmentService.updateDepartment(requestValidate);

    return response.json(service);
  }

  public async assignDepartment({ request, response }: HttpContextContract) {
    const getvalidData = await request.validate(
      DepartmentValidator.assignDepartment
    );

    this.data["Orgid"] = getvalidData.Orgid ? getvalidData.Orgid : 0;
    this.data["deptid"] = getvalidData.deptid ? getvalidData.deptid : 0;
    this.data["deptname"] = getvalidData.deptname ? getvalidData.deptname : 0;
    this.data["empid"] = getvalidData.empid ? getvalidData.empid : " ";
    this.data["adminid"] = getvalidData.adminid ? getvalidData.adminid : 0;
    this.data["empname"] = getvalidData.empname ? getvalidData.empname : 0;
    this.data["adminname"] = getvalidData.adminname
      ? getvalidData.adminname
      : 0;

    const getResponsefromService = await DepartmentService.assignDepartment(
      this.data
    );

    return response.json(getResponsefromService);
  }

  public async GetDepartmentStatus({ request, response }: HttpContextContract) {
    const requestValidate = await request.validate(
      DepartmentValidator.DepartmentStatusSchema
    );

    const service = await DepartmentService.DepartmentStatus(requestValidate);

    return response.json(service);
  }

  public async getEmpdataDepartmentWiseCount({ request, response }: HttpContextContract) {
    const requestValidate = await request.validate(
      DepartmentValidator.getEmpdataDepartmentWiseCount);

    const service = await DepartmentService.getEmpdataDepartmentWiseCount(requestValidate);

    return response.json(service);
  }
}
