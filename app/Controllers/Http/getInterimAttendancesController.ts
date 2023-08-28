import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import GetInterimAttendancesService from "App/Services/getInterimAttendancesService";
import GetInterimAttendancesValidator from "App/Validators/GetInterimAttendancesValidator";
export default class getInterimAttendancesController {
public  async getInterimAttendancesdata ({ request,response }: HttpContextContract) {
    const InputValidation = await request.validate(GetInterimAttendancesValidator.getInterimAttendancesschema)
    const ServiceData = GetInterimAttendancesService.getInterimAttendances(InputValidation)
    return response.json(ServiceData);

}

}
