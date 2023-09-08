import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";

export default class SendNotificationDiffOrgEmployee {

    public static async SendNotificationDiffOrgEmployee(data) {

        var orgid = data.orgid;
        var contact = data.contact;
        var adminEmail = data.adminEmail;
        var adminId = data.adminId;
        var orgName = await Helper.getOrgName(orgid);
        var encryptContact = await Helper.encode5t(contact);
        var adminName = await Helper.getAdminNamebyOrgId(orgid);
        var result: {} = {};

        var selectQuery = await Database.from('UserMaster as U').select('U.EmployeeId', 'U.OrganizationId', 'U.appSuperviserSts', 'U.Username').where('U.username_mobile', encryptContact)

        // return selectQuery

        if (selectQuery.length > 0) {
            let empid = selectQuery[0].EmployeeId;
            let Orgid = selectQuery[0].OrganizationId;
            let username = selectQuery[0].Username;
            let empName = await Helper.getEmpName(empid);
            empName = empName.replace(/\b\w/g, function (match) {
                return match.toUpperCase();
            });
            empName = empName.replace(/ /g, '-');
            empName = empName.replace(/[^A-Za-z0-9\-]/g, '');
            var employeeTopic = empName + empid;
            var NotificationId: any = await Helper.sendManualPushNotification(`${employeeTopic} in Topics}`, "Employee in another Organization", `You want to join this ${orgName} organization`, empid, Orgid, "HomePage");

            var updateQuery = await Database.from('NotificationList').where('Id', NotificationId).update({ 'PageName': 'HomePage' })

            result['status'] = 0;
            if (updateQuery.length > 0) {
                result['status'] = 1;

                var selectPreventSignupQuery = await
                    Database.from('PreventSignup').select('*').where('contact', contact).where('OrganizationId', Orgid);

                if (selectPreventSignupQuery.length > 0) {
                    var updatePreventsignupQuery = await Database.from('PreventSignup').whereNot('Status', 0).where('contact', contact).where('OrganizationId', Orgid);
                }
                else {
                    var insertPreventSignupQuery = await Database.table('PreventSignup').insert({
                      
                    })
            }
        }

    }
}
}