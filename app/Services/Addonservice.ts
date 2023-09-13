import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import { DateTime } from "luxon";

export default class Addonservice {
    public static async free_addon_three_days(data) {
        const orgid = data.refno ? data.refno : 0;
        const AdminId = data.uid ? data.uid : 0;
        const addon = data.name ? data.name : 0;
        const orgname = await Helper.getOrgName(orgid);
        let result: any = {};
        var res: any = 0;
        let addon_future_enddate = data.today ? data.today : 0;
        if (addon_future_enddate == 0) {
            const today1 = DateTime.now().toFormat('yyyy-MM-dd');
            const inputDate = DateTime.fromISO('2023-09-11');
            // Add three days
            const resultDate = inputDate.plus({ days: 3 });
            addon_future_enddate = resultDate.toFormat('yyyy-MM-dd');


        }
        let Addon_BulkAttn = 0
        const attendanceaddon = 0;
        const advancevisit = 0;
        const basicleave = 0;
        const facerecog = 0;
        const geofence = 0;
        const livelocationtracking = 0;
        const shiftplanner = 0;
        const visitpunch = 0;
        const freestatus = 0;
        const created_date = DateTime.now().toFormat('yyyy-MM-dd');
        const addon_invoice_id = '0';
        const order_id = 'adminpanel';
        const payment_id = 'adminpanel';
        const addon_amount = 'adminpanel';
        const currency = 'adminpanel';
        const query123: any = await Database.query().from('addons_master').select('Free_Trial_Status').where('OrganizationId', orgid).andWhere('Free_Trial_Status', 1);
        const count123 = query123.length;
        if (count123 < 3) {
            result['status'] = 'false';
            return result;
        } else {

            const query22 = await Database.query().from('Paid_addon_name').select('addon_name').where(Database.raw(' name Like "%' + addon + '%"')).limit(1);
            let addon_name: string = '';
            const count22 = query22.length;
            if (count22) {
                addon_name = query22[0].addon_name;
            }
            // Define a mapping object for addon names to their respective variables
            const addonMapping = {
                'Addon_BulkAttn': 'Addon_BulkAttn',
                'Addon_advancevisit': 'Addon_advancevisit',
                'Addon_BasicLeave': 'Addon_BasicLeave',
                'Addon_FaceRecognition': 'Addon_FaceRecognition',
                'Addon_GeoFence': 'Addon_GeoFence',
                'addon_livelocationtracking': 'addon_livelocationtracking',
                'Addon_ShiftPlanner': 'Addon_ShiftPlanner',
                'Addon_VisitPunch': 'Addon_VisitPunch',
            };

            // Check if addon_name exists in the mapping and assign the corresponding value
            const selectedAddon = addonMapping[addon_name];
            if (selectedAddon !== undefined) {
                res = [selectedAddon];
                // Use the selectedAddon value as needed
                const query1 = await Database.table('addons_master').returning('id').insert({
                    "Addon_name": selectedAddon, "OrganizationId": orgid, "created_date": created_date, "end_date": addon_future_enddate, "PaymentInvoiceid": addon_invoice_id, "Order_id": order_id, "Payment_id": payment_id, "addon_amount": addon_amount, "Currency": currency, "Free_Trial_Status": 1,
                })
                const query33: any = await Database.query().from('licence_ubiattendance').where('OrganizationId', orgid).update({
                    [selectedAddon]: 1
                })

                if (query33 > 0) {
                    result['status'] = [selectedAddon];
                    const zone = await Helper.getEmpTimeZone(AdminId, orgid);
                    const defaultZone = DateTime.now().setZone(zone);
                    const admin = await Helper.getempnameById(AdminId);
                    const end_date_new = '';

                }

                // console.log(`Selected Addon: ${selectedAddon}`);
            }
        }


        return result;


    }

    public static async registeredFaceIDList(getData) {

        var orgid = getData.refno;
        var empid = getData.empid;
        var dataFor = getData.dataFor;
        var pageName = getData.pageName;
        var perPage = getData.perPage;
        var currentPage = getData.currentPage;
        var begin = (currentPage - 1) * perPage;
        var limit;
        var offset;
        if (currentPage != 0 && (pageName == 'RegisterEmployeeList' || pageName == 'UnregisterEmployeeList')) {
            limit = perPage;
            offset = begin;
        }
        var result: {} = {};
        var RegisteredData: {} = {};
        var UnRegisteredData: {} = {};

        var adminStatus = await Helper.getAdminStatus(empid);
        var departmentCondition;
        if (adminStatus == 2) {
            var deptId = await Helper.getDepartmentIdByEmpID(empid);
            departmentCondition = `AND Department =${deptId}`;
        }
        var selectRegisteredQuery
        if (dataFor == 'registered') {
            selectRegisteredQuery = Database.from('Persisted_Face as PF').select(
                Database.raw(`E.FirstName as FirstName `),
                Database.raw(`E.LastName as LastName`),
                Database.raw(`SUBSTRING_INDEX(profileimage, '.com/', -1) as profileimage`),
                Database.raw(`EmployeeId as Id`)
            )
                .whereNot('PersistedFaceId', 0)
                .where('PF.OrganizationId', orgid)
                .whereRaw('1 in (SELECT archive from EmployeeMaster E Where E.Id=EmployeeId)')
                .innerJoin('EmployeeMaster as E', 'E.Id', 'PF.EmployeeId')
                .orderBy('FirstName')
                .limit(limit)
                .offset(offset)

            if (departmentCondition != undefined || departmentCondition != null) {
                selectRegisteredQuery.whereRaw(departmentCondition);
            }

            var selectRegisteredQueryResult = await selectRegisteredQuery

            selectRegisteredQueryResult.forEach((row) => {
                RegisteredData['Id'] = row.Id;
                var FirstName = row.FirstName.trim();
                FirstName = FirstName.replace(/\s+/g, '');
                var LastName = row.LastName.trim();
                LastName = LastName.replace(/\s+/g, '');
                RegisteredData['name'] = `${FirstName} ${LastName}`;
                RegisteredData['name'] = RegisteredData['name']
                    .toLowerCase()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                RegisteredData['profile'] = row.profileimage;
                RegisteredData['orgid'] = orgid;
                result = RegisteredData;
            })

        }
        else if (dataFor == "unregistered") {
            var selectUnregisteredQuery = Database.from('EmployeeMaster').select('*').where('OrganizationId', orgid)
                .whereRaw(`Id NOT IN (Select EmployeeId from Persisted_Face where PersistedFaceId != '0' and OrganizationId= ${orgid})`)
                .where('Is_Delete', 0)
                .where('archive', 1)
                .orderBy('FirstName')
                .limit(limit)
                .offset(offset);

            if (departmentCondition != undefined || departmentCondition != null) {
                selectUnregisteredQuery.whereRaw(departmentCondition);
            }

            var selectUnregisteredQueryResult = await selectUnregisteredQuery;

            selectUnregisteredQueryResult.forEach((row) => {
                UnRegisteredData['Id'] = row.Id;
                var FirstName = row.FirstName.trim();
                FirstName = FirstName.replace(/\s+/g, '');
                var LastName = row.LastName.trim();
                LastName = LastName.replace(/\s+/g, '');
                UnRegisteredData['name'] = `${FirstName} ${LastName}`;
                UnRegisteredData['name'] = UnRegisteredData['name']
                    .toLowerCase()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                UnRegisteredData['Profile'] = '';
                UnRegisteredData['orgid'] = orgid;
                result = UnRegisteredData;

            })
        }
        return result;

    }

    public static async disapprovefaceid(getData) {
        let empid = getData.empid;
        let orgid = getData.orgid;
        let orgTopic = getData.orgTopic;
        let adminId = getData.adminId;
        let personid = "";
        let persistedfaceid = "";
        let zone = await Helper.getEmpTimeZone(empid, orgid);
        const defaultZone = DateTime.now().setZone(zone);
        let date: string = defaultZone.toFormat("yyyy-MM-dd HH:mm:ss");
        let FaceIdDisapprovedPerm = await Helper.getNotificationPermission(orgid, 'FaceIdDisapproved')

        var selectQuery = await Database.from('Persisted_Face').select('*').where('EmployeeId', empid);
        if (selectQuery.length > 0) {
            personid = selectQuery[0].PersonId;
            persistedfaceid = selectQuery[0].PersistedFaceId;
        }

        var selectQuery2 = await Database.from('EmployeeMaster').select('FirstName', 'PersonId').where('Id', empid);

        if (selectQuery2.length > 0) {
            var name = selectQuery2[0].FirstName.trim();
        }
        var PersonGroupId = '0';

        var selectQuery3 = await Database.from('licence_ubiattendance ').select('PersonGroupId')
            .where('OrganizationId', orgid);

        if (selectQuery3.length > 0) {
            PersonGroupId = selectQuery3[0].PersonGroupId;
        }
        var status = 'No affect';
        function ucwords(str) {
            return str.replace(/(^|\s)\S/g, function (match) {
                return match.toUpperCase();
            });
        }
        name = ucwords(name);
        name = name.replace(/ /g, '-');
        var EmployeeTopic = name + empid;
        var del_res;
        var deleteQuery;
        var deleteQuery2;
        var data: {} = {};
        if (personid.trim() != "" && persistedfaceid.trim() != "") {
            //  del_res = await Helper.person_delete(personid,PersonGroupId);
            if ((del_res == 200) || (del_res == 404)) {
                deleteQuery = await Database.from('Persisted_Face').delete().where('OrganizationId', orgid).where('EmployeeId', empid);

                deleteQuery2 = await Database.from('Persisted_Face').delete().where('OrganizationId', orgid).where('PersonId', personid);

                var updateQuery = await Database.from('EmployeeMaster').update({ PersonId: '' }).where('Id', empid).where('OrganizationId', orgid);

                // var persongrouptrain_res = persongrouptrain(PersonGroupId);
                status = 'Face ID disapproved successfully';
            }
            else {
                var res = 0;
            }
        }
        else {
            res = 0;
        }
        if (deleteQuery && deleteQuery2) {
            data['status'] = status;
        }

        if (FaceIdDisapprovedPerm == 9 || FaceIdDisapprovedPerm == 11 || FaceIdDisapprovedPerm == 13 || FaceIdDisapprovedPerm == 15) {
            var pageName = "Face Recognition";

            var NotificationId = await Helper.sendManualPushNotification(`${orgTopic} in topics && 'admin' in topics`, "FaceRecogntition", `${name} Face ID has been Disapproved`, empid, orgid, pageName);

            var updateQuery = await Database.from('NotificationsList').update({ PageName: 'FaceIdList' }).where('Id', NotificationId);
        }

        if (FaceIdDisapprovedPerm == 10 || FaceIdDisapprovedPerm == 11 || FaceIdDisapprovedPerm == 14 || FaceIdDisapprovedPerm == 15) {
            var pageName = "Face Recognition";

            var NotificationId = await Helper.sendManualPushNotification(`${EmployeeTopic} in topics `, "FaceRecogntition", `Your Face ID has been Disapproved`, empid, orgid, pageName);

            var updateQuery = await Database.from('NotificationsList').update({ PageName: 'FaceIdList' }).where('Id', NotificationId);
        }

        if (FaceIdDisapprovedPerm == 5 || FaceIdDisapprovedPerm == 13 || FaceIdDisapprovedPerm == 7 || FaceIdDisapprovedPerm == 7) {

            //  mail   '.$name."'s".' Face ID has been Disapproved

        }
        else {
            data['status'] = 'Unable to disapprove Face Id';
        }

        if (deleteQuery && deleteQuery2) {
            var EmployeeName = await Helper.getEmpName(empid);
            var adminname = await Helper.getEmpName(adminId);
            let zone = await Helper.getEmpTimeZone(empid, orgid);
            const defaultZone = DateTime.now().setZone(zone);
            let date: string = defaultZone.toFormat("yyyy-MM-dd HH:mm:ss");
            data['sts'] = 1;
            var appModule = 'disapprove Face ID';
            var module = "Attendance App";
            var actionperformed = `<b>${EmployeeName}</b> Face ID has been Disapproved by <b>${adminname}</b> from<b> Attendance App  </b>`;
            var activityBy = 1;
            await Database.table('ActivityMaster').insert({
                LastModifiedDate: date, LastModifiedById: adminId, Module: module, ActionPerformed: actionperformed, OrganizationId: orgid, ActivityBy: activityBy, adminid: adminId, AppModule: appModule
            })
        }
        return data;
    }
}