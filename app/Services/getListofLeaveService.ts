import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import { DateTime } from "luxon";
import moment from "moment";

export default class getListofLeave {

    public static async getListofLeaveAll(data) {

        var empId = data.empId;
        var orgId = data.orgId;
        var pageName = data.pageName;
        var perPage = data.perPage;
        var currentPage = data.pageName;
        var begin = (currentPage - 1) * perPage;
        var departmentCondition
        var limit;
        var offset;
        var result = {};
        if (currentPage != 0 && pageName == 'getListofLeaveAll') {
            limit = perPage;
            offset = begin;
        }

        var adminStatus = await Helper.getAdminStatus(empId);
        if (adminStatus == 2) {
            var departmentId = await Helper.getDepartmentIdByEmpID(empId);
            departmentCondition = `E.Department=${departmentId}`;
        }

        var getListofLeaveQuery = Database.from('AppliedLeave as A').select('A.Id', 'A.LeaveId', 'A.Reason', 'E.Department', 'A.ApprovalStatus', 'A.ApproverId', 'A.ApproverName', 'A.Remarks', 'A.EmployeeId', 'A.CreatedDate as AppliedDate',
            Database.raw(`CONCAT(E.FirstName,' ',E.LastName) as name`),
            Database.raw(`(CASE WHEN(A.HalfDayStatus=1) THEN 0.5 ELSE 1 END) as NoofLeaves1`))
            .min('A.Date as StartDate')
            .max('A.Date as EndDate')
            .count('A.LeaveId as NoofLeaves')
            .innerJoin('EmployeeMaster as E', 'E.Id', 'A.EmployeeId')
            .where('A.OrganizationId', orgId)
            .groupBy('A.LeaveId')
            .orderBy('FirstName', 'asc')
            .limit(limit)
            .offset(offset);

        if (departmentCondition != undefined) {
            getListofLeaveQuery.whereRaw(departmentCondition)
        }

        var getListofLeaveQueryResult = await getListofLeaveQuery;
        interface getListofLeaveAll {
            Id: number,
            name: string,
            Reason: string,
            Date: string,
            ToDate: string,
            ApproverName: string,
            ApproverId: number,
            ApprovalStatus: number,
            Remarks: string,
            AppliedDate: string,
            NoofLeaves: number,
            NoofLeaves1: number,
            EmployeeId: number
        }

        var getListofLeaveAll: getListofLeaveAll[] = []

        getListofLeaveQueryResult.forEach(async (row) => {
            var StartDate = row.StartDate;
            var Dateto = row.EndDate;
            var DateApplied = row.AppliedDate;
            var startDate = moment(StartDate).format('D-MMM');
            var toDate = moment(Dateto).format('D-MMM');
            var appliedDate = moment(DateApplied).format('D-MMM-YYYY');
            var approverName = row.ApproverName;
            if (approverName == undefined) {
                approverName = await Helper.getEmpName(data.ApproverId);
            }
            else {
                approverName = row.ApproverName;
            }
            console.log(approverName);

            const getListofLeave: getListofLeaveAll = {
                Id: row.Id,
                name: row.name,
                Reason: row.Reason,
                Date: startDate,
                ToDate: toDate,
                ApproverName: approverName,
                ApproverId: row.ApproverId,
                ApprovalStatus: row.ApprovalStatus,
                Remarks: row.Remarks,
                AppliedDate: appliedDate,
                NoofLeaves: row.NoofLeaves,
                NoofLeaves1: row.NoofLeaves1,
                EmployeeId: row.EmployeeId
            }
            getListofLeaveAll.push(getListofLeave);
        })
        result = getListofLeaveAll;

        return result;
    }


    public static async getListofLeave(data) {

        var empId = data.empId;
        var orgId = data.orgId;
        var pageName = data.pageName;
        var perPage = data.perPage;
        var currentPage = data.pageName;
        var begin = (currentPage - 1) * perPage;
        var limit;
        var offset;
        var result = {};
        if (currentPage != 0 && pageName == 'getListofLeave') {
            limit = perPage;
            offset = begin;
        }

        var getListofLeaveQuery = Database.from('AppliedLeave as A').select('A.Id', 'A.LeaveId', 'A.Reason', 'E.Department', 'A.ApprovalStatus', 'A.ApproverId', 'A.ApproverName', 'A.Remarks', 'A.EmployeeId', 'A.CreatedDate as AppliedDate',
            Database.raw(`CONCAT(E.FirstName,' ',E.LastName) as name`),
            Database.raw(`(CASE WHEN(A.HalfDayStatus=1) THEN 0.5 ELSE 1 END) as NoofLeaves`))
            .min('A.Date as StartDate')
            .max('A.Date as EndDate')
            .innerJoin('EmployeeMaster as E', 'E.Id', 'A.EmployeeId')
            .where('A.OrganizationId', orgId)
            .where('E.Id', empId)
            .groupBy('A.LeaveId')
            .orderBy('FirstName', 'asc')
            .limit(limit)
            .offset(offset)

        var getListofLeaveQueryResult = await getListofLeaveQuery;

        interface getListofLeaveQuery {
            Id: number,
            name: string,
            Reason: string,
            Date: string,
            ToDate: string,
            ApproverName: string,
            ApproverId: number,
            ApprovalStatus: number,
            Remarks: string,
            AppliedDate: string,
            NoofLeaves: number,
            EmployeeId: number
        }

        var getListofLeave: getListofLeave[] = []

        getListofLeaveQueryResult.forEach(async (row) => {
            var StartDate = row.StartDate;
            var Dateto = row.EndDate;
            var DateApplied = row.AppliedDate;
            var startDate = moment(StartDate).format('D-MMM');
            var toDate = moment(Dateto).format('D-MMM');
            var appliedDate = moment(DateApplied).format('D-MMM-YYYY');
            var ApproverName;

            if (row.ApproverName == undefined) {
                ApproverName = await Helper.getEmpName(data.ApproverId);
            }
            else {
                ApproverName = row.ApproverName;
            }

            var ApprovalStatus = row.ApprovalStatus;
            var LeaveStatus;
            if (ApprovalStatus == 1) {
                LeaveStatus = "pending";
            }
            if (ApprovalStatus == 2) {
                LeaveStatus = `Approved By ${row.ApproverName}`;
            }
            if (ApprovalStatus == 3) {
                LeaveStatus = `Reject By ${row.ApproverName}`;
            }
            if (ApprovalStatus == 4) {
                LeaveStatus = "Withdrawn";
            }
            const getListofLeaveResult: getListofLeave = {
                Id: row.Id,
                name: row.name,
                Reason: row.Reason,
                Date: startDate,
                ToDate: toDate,
                ApproverName: row.ApproverName,
                ApproverId: row.ApproverId,
                ApprovalStatus: LeaveStatus,
                Remarks: row.Remarks,
                AppliedDate: appliedDate,
                NoofLeaves: row.NoofLeaves,
                EmployeeId: row.EmployeeId
            }

            getListofLeave.push(getListofLeaveResult);
        })
        result = getListofLeave;

        return result;
    }

    public static async withdrawLeave(data) {
        var empId = data.empId;
        var orgId = data.orgId;
        var LeaveId = data.LeaveId;

        var orgName = await Helper.getOrgName(orgId)
        const capitalizedOrgName: string = orgName.charAt(0).toUpperCase() + orgName.slice(1);
        const hyphenatedOrgName: string = capitalizedOrgName.replace(/ /g, '-');
        const sanitizedOrgName: string = hyphenatedOrgName.replace(/[^A-Za-z0-9\-]/g, '');
        const orgTopic: string = sanitizedOrgName + orgId;
        const EmpName = await Helper.getEmpName(empId);
        const PushNotificationPerm = await Helper.getNotificationPermission(orgId, 'BasicLeave')
        var approvalStatus;

        //  return PushNotificationPerm

        var selectQuery = await Database.from('AppliedLeave').select('ApprovalStatus').where('LeaveId', LeaveId).where('OrganizationId', orgId)
            .groupBy('LeaveId')

        if (selectQuery.length > 0) {
            approvalStatus = selectQuery[0].ApprovalStatus;
        }
        if (approvalStatus == 2) {
            data['status'] = 'false';
            return data['status'];
        }

        var updateQuery = await Database.from('AppliedLeave').where('LeaveId', LeaveId).update({
            'ApprovalStatus': 4
        });

        if (updateQuery.length > 0) {
            data['status'] = 'true';
            if (PushNotificationPerm == '9' || PushNotificationPerm == '13' || PushNotificationPerm == '11' || PushNotificationPerm == '15') {
                var pageName = 'Leave';
                // var NotificationId = sendManualPushNotification("('$orgTopic' in topics) && ('admin' in topics)","Leave", "EmpName has withdrawn leave", "empid","orgId","pageName");
                // var updateNotificationListQuery = await Database.from('NotiicationList').where('Id',NotificationId).update({
                //     'PageName' : 'MyTeamLeave'
                // })
            }
        }
        else{
            data['status'] = 'false';
        }
        

    }
}
