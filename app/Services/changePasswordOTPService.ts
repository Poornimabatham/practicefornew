import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";

export default class changePasswordOTPService {

    public static async changePasswordOTP(data) {

        var email = data.email;
        var phone = data.phone;
        var result: [] = [];
       
        
        if (phone != undefined) {
          
            var phoneEncode = await Helper.encode5t(phone);
            var selectphoneQuery = await Database.from('UserMaster').select('*').where('username_mobile', phoneEncode)

            if (selectphoneQuery.length > 0) {
                result['status'] = '4';
            }
            else {
                result['status'] = '5';
            }
        }

        else if (email != undefined) {
            var emailEncode = await Helper.encode5t(email);
            var selectemailQuery = await Database.from('UserMaster').select('*').where('Username', emailEncode);
            if (selectemailQuery.length > 0) {
                result['status'] = '4';
            }
            else {
                result['status'] = '5';
            }

        }
        return result['status'];

    }
}