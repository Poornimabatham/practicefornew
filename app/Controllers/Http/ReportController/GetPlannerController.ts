
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
export default class GetplannerController {
  public async data({ request }: HttpContextContract) {
    const userid = 7295;
    request.input("refno");
    request.input("attDate");
    //  const zone = getEmpTimeZone(userid,refno)

    // const datastart = new Date();
    // const overtime = "";
    // const overtime1 = "";
    // const overtime3 = "";
    // const loggedHours = "00:00:00";
    // const shiftin = "";
    // const shiftout = "";






    interface department {
      AttendanceDate: number,
     
    }

export default class GetplannerController {
  public async getplannerwisesummary({ request, response }: HttpContextContract) {
    const a = await request.validate(Plannervalidator.FetchPlannerchema);
    const b = await GetplannerWiseSummary.Getlannerwisesummary(a);
    return response.json(b);
  }
}