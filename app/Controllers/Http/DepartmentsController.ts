import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import DepartmentValidator from "App/Validators/DepartmentValidator";
import DepartmentService from "App/Services/DepartmentService";


export default class DepartmentsControllerepartmentsController {
  public async getdepartment({request,response}: HttpContextContract) {

    const a = await request.validate(DepartmentValidator.getdepartment);
    const b:any = await DepartmentService.getdepartment(a);
  
    if(b.length > 0) 
    {
      response.status(200).send({ message: "Success", data: b });   
    } else {
      response.status(400).send({ message: "Unsuccess", data: b });
    }
  }

  public async addDept({ request, response }: HttpContextContract) {
    const a = await request.validate(DepartmentValidator.addepartment);

    const b = await DepartmentService.addDept(a);

    console.log(b)
    // return b;
     return response.json(b);
  }

  public async updatedept({ request, response }: HttpContextContract) {
    const a = await request.validate(DepartmentValidator.updatedept);

    const b = await DepartmentService.updatedept(a);

    return response.json(b);
  }
}
