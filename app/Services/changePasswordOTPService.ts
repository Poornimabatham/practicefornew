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

    public static async newchangepass(data) {

        var phone = data.changepassphone;
        var newpassword = data.newpass;
        var result = {};

        if (phone != undefined) {
            var encodephone = await Helper.encode5t(phone);
            var affectedRows;
            if (newpassword != undefined) {
                var encodeNewPassword = await Helper.encode5t(newpassword);
            }

            var selectQuery = await Database.from('UserMaster').select('Id', 'appSuperviserSts', 'Username', 'Password').where('username_mobile', encodephone);

            if (selectQuery[0].Password == encodeNewPassword) {
                return "Password should not be same as previous Password";
            }
            if (selectQuery.length > 0) {
                var Id = selectQuery[0].Id;
                var sts = selectQuery[0].appSuperviserSts;
                var email = await Helper.decode5t(selectQuery[0].Username);

                if (Id != undefined && Id != 0) {
                    var updateQuery = await Database.from('UserMaster')
                        .where('Id', Id)
                        .update({ 'Password': encodeNewPassword })

                    if (updateQuery) {
                        affectedRows = 1;
                    }
                    if (sts == 1) {
                        var updateAdminLoginQuery = await Database.from('admin_login').where('email', email).update({
                            'changepasswordStatus': 1,
                            'password': encodeNewPassword
                        })
                        if (updateAdminLoginQuery) {
                            affectedRows = 1;
                        }
                    }

                    if (affectedRows > 0) {
                        result['status'] = 1;
                    }
                    else {
                        result['status'] = 2;
                    }

                }
            }

        }
        else {
            result['status'] = 2;
        }
        return result;
    }

}













