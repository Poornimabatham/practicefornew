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

        var selectQuery = await Database.from('UserMaster as U').select('U.EmployeeId', 'U.OrganizationId', 'U.appSuperviserSts', 'U.Username').whereRaw(` U.username_mobile like '%${encryptContact}%'`)

        if (selectQuery.length > 0) {
            let empid = selectQuery[0].EmployeeId;
            let Orgid = selectQuery[0].OrganizationId;
            let username = await Helper.decode5t(selectQuery[0].Username);
            let empName = await Helper.getEmpName(empid);
            empName = empName.replace(/\b\w/g, function (match) {
                return match.toUpperCase();
            });
            empName = empName.replace(/ /g, '-');
            empName = empName.replace(/[^A-Za-z0-9\-]/g, '');
            var employeeTopic = empName + empid;
            var NotificationId: any = await Helper.sendManualPushNotification(`${employeeTopic} in Topics}`, "Employee in another Organization", `You want to join this ${orgName} organization`, empid, Orgid, "HomePage");
            var updateQuery = await Database.from('NotificationsList').where('Id', NotificationId).update({ PageName: 'HomePage' })

            result['status'] = 0;
            if (updateQuery) {
                result['status'] = 1;

                var selectPreventSignupQuery = await
                    Database.from('PreventSignup').select('*').whereRaw(` contact like '%${contact}%'`).where('OrganizationId', Orgid);

                if (selectPreventSignupQuery.length > 0) {
                    await Database.from('PreventSignup').whereNot('Status', 0).whereRaw(`contact like '%${contact}%'`).where('OrganizationId', Orgid).update({ Status: 0 });
                }
                else {

                    await Database.table('PreventSignup').insert({
                        'EmployeeId': empid, 'contact': contact, 'OrganizationId': Orgid, 'OldOrgId': orgid, 'OldOrgName': orgName, 'Status': 0
                    })
                }
            }
            var selectBodyQuery = await Database.from('All_mailers').select('Body', 'Subject').where('Id', 40);

            if (selectBodyQuery.length > 0) {
                var body = selectBodyQuery[0].Body;
                var Subject = selectBodyQuery[0].Subject;
            }

            var Username = username + contact;
            var body1 = body.replace('{Admin Name}', adminName);
            var message_body = body1.replace('{Employee name(Number)}', Username, body1);
            var headers = "MIME-Version: 1.0" + "\r\n";
            headers = headers + "Content-type:text/html;charset=UTF-8" + "\r\n";
            headers = headers + "From: <noreply@ubiattendance.com>" + "\r\n";
            await Helper.sendEmail(adminEmail, Subject, message_body, headers)

        }
        return result;


    }
}
