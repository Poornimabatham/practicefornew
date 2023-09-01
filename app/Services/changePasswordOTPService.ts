import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import { DateTime } from "luxon";
export default class changePasswordOTPService {
    public static async changePasswordOTP(data) {
        var email = data.email;
        var phone = data.phone;
        var result: [] = [];

        if (phone != undefined) {
            var phoneEncode = await Helper.encode5t(phone);
            var selectphoneQuery = await Database.from("UserMaster")
                .select("*")
                .where("username_mobile", phoneEncode);

            if (selectphoneQuery.length > 0) {
                result["status"] = "4";
            } else {
                result["status"] = "5";
            }
        } else if (email != undefined) {
            var emailEncode = await Helper.encode5t(email);
            var selectemailQuery = await Database.from("UserMaster")
                .select("*")
                .where("Username", emailEncode);
            if (selectemailQuery.length > 0) {
                result["status"] = "4";
            } else {
                result["status"] = "5";
            }
        }
    }

    public static async newchangepass(data) {
        var phone = data.changepassphone;
        var newpassword = data.newpass;
        var result = {};

        if (phone != undefined) {
            var encodephone = await Helper.encode5t(phone);
            var affectedRows;
            var encodeNewPassword;
            if (newpassword != undefined) {
                encodeNewPassword = await Helper.encode5t(newpassword);
            }

            var selectQuery = await Database.from("UserMaster")
                .select("Id", "appSuperviserSts", "Username", "Password")
                .where("username_mobile", encodephone);

            if (selectQuery[0].Password == encodeNewPassword) {
                return "Password should not be same as previous Password";
            }
            if (selectQuery.length > 0) {
                var Id = selectQuery[0].Id;
                var sts = selectQuery[0].appSuperviserSts;
                var email = await Helper.decode5t(selectQuery[0].Username);

                if (Id != undefined && Id != 0) {
                    var updateQuery = await Database.from("UserMaster")
                        .where("Id", Id)
                        .update({ Password: encodeNewPassword });

                    if (updateQuery) {
                        affectedRows = 1;
                    }
                    if (sts == 1) {
                        var updateAdminLoginQuery = await Database.from("admin_login")
                            .where("email", email)
                            .update({
                                changepasswordStatus: 1,
                                password: encodeNewPassword,
                            });
                        if (updateAdminLoginQuery) {
                            affectedRows = 1;

                        }
                    }

                    if (affectedRows > 0) {
                        result["status"] = 1;
                    } else {
                        result["status"] = 2;
                    }
                }
            }
        } else {
            result["status"] = 2;
        }
        return result;
    }

    public static async changepass(inp) {
        var uid = inp.uid;
        var orgid = inp.refno;
        var pwd = inp.pwd;
        var npwd = inp.npwd;
        var email = inp.email;
        const data2 = {};
        const res: any = [];
        let querysts: number = 0;
        let sts = 0;

        const selectUserList = await Database.from("UserMaster")
            .select("*")
            .where("EmployeeId", uid)
            .whereRaw("BINARY Password =?", pwd)
            .andWhere("OrganizationId", orgid);
        var rows = selectUserList.length;

        if (rows) {
            sts = selectUserList[0].appSuperviserSts;
        }
        if (rows < 1) {
            data2["status"] = 2;
        } else {
            if ((pwd = npwd)) {
                data2["status"] = 3;
            }
        }
        // return data2;
        if (data2["status"] == 2 && data2["status"] != 3) {
            const updateusermaster: any = await Database.from("UserMaster")
                .where("EmployeeId", uid)
                .andWhere(" OrganizationId", orgid)
                .update({
                    Password: npwd,
                    Password_sts: 1,
                });
            querysts = querysts + updateusermaster;
            if (sts == 1) {
                const updateusermaster1: any = await Database.from("admin_login")
                    .where("email", email)
                    .andWhere("OrganizationId", orgid)
                    .update({
                        password: npwd,
                        changepasswordStatus: "1",
                    });
                querysts = querysts + updateusermaster1;
            }

            if (querysts > 0) {
                data2["status"] = 1;

                const today = DateTime.now();
                const formattedDate = today.toFormat("yy-MM-dd HH:mm:ss");

                var id = uid;

                var appModule = "Password";
                var getEmpName = await Helper.getEmpName(uid);

                var module = "Attendance app";
                var actionperformed = `<b> Password </b>  has been updated for <b>"${getEmpName}."</b>from <b> Attendance App </b>`;
                var activityby = 1;

                const insertActivityHistoryMaster: any =
                    await Helper.ActivityMasterInsert(
                        formattedDate,
                        orgid,
                        id,
                        activityby,
                        appModule,
                        actionperformed,
                        module
                    );
            }
            return data2;
        }
    }
}
