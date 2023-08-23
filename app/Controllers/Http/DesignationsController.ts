import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import DesignationService from "App/Services/DesignationService";
import DesignationValidator from "App/Validators/DesignationValidator";
export default class DesignationsController {
  private data = []
  public async retreiveDesign({ request, response }: HttpContextContract) {
    const a = await request.validate(DesignationValidator.Designationschema);

    const b = await DesignationService.getDesignation(a);

    return response.json(b);
  }

  public async AddDesign({ request, response }: HttpContextContract) {
    const a = await request.validate(DesignationValidator.AddDesignationschema);

    const b = await DesignationService.AddDesignation(a);

    return response.json(b);
  }

  public async UpdateDesign({ request, response }: HttpContextContract) {
    const a = await request.validate(
      DesignationValidator.updateDesignationschema
    );

    const b = await DesignationService.updateDesignation(a);

    return response.json(b);
  }

  public async assignDesignation({request,response}: HttpContextContract) {

    const getvalidData = await request.validate(DesignationValidator.assignDesignation)

    this.data['Orgid'] = getvalidData.Orgid ? getvalidData.Orgid: 0;
    this.data['desigid'] = getvalidData.desigid ? getvalidData.desigid : 0;
    this.data['designame'] = getvalidData.designame ? getvalidData.designame : 0;
    this.data['empid'] = getvalidData.empid ? getvalidData.empid : " ";
    this.data['adminid'] = getvalidData.adminid ? getvalidData.adminid : 0;
    this.data['empname'] = getvalidData.empname ? getvalidData.empname : 0;
    this.data['adminname'] = getvalidData.adminname ? getvalidData.adminname : 0;


    const getResponsefromService = await DesignationService.assignDesignation(this.data)

    return response.json(getResponsefromService);
    
  }
}
