import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";

export default class CheckUserEmailService {
  public static async CheckUserEmail(data) {
    var email = data.email;
    
    var result: any = {};
    var usermail = await Helper.encode5t( data.email);
    console.log(usermail);
    const checkquery = await Database.from("UserMaster")
      .where("Username", usermail)
    const num_rows = checkquery.length;
    console.log(num_rows)
    if (num_rows > 0) {
        console.log("ui")
      result["status"] = "1"; // already exist E-mail
    } else {
        console.log("u")
      result["status"] = "2"; // Not exist E-mail
    }
    return result;
  }
}
