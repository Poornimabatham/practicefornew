import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query";

export default class ResetPasswordLinkService {
  public static async ResetPassword(data) {
    const una = await Helper.encode5t(data.una);
    const query = await Database.from('EmployeeMaster AS E')
    .innerJoin('UserMaster', 'E.Id', 'UserMaster.EmployeeId')
    .select([
      'E.Id',
      'E.OrganizationId',
      'E.FirstName',
      'E.LastName',
      Database.raw(`(SELECT resetPassCounter	 FROM UserMaster WHERE Username = ${una}
         OR username_mobile = ${una}) as ctr`),Database.raw(` (SELECT  Username FROM UserMaster WHERE Username = ${una} or username_mobile = ${una})as email`)
     ] )
    .where("E.Id", 134946)
     return query
  }
}
