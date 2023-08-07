import moment from "moment-timezone";
import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";

export default class EmployeeService{
    public async Employeelist(reqdata:[]) {
        const orgid= reqdata['orgid'];
        var searchtext=reqdata['searchval'];
        const data1: any = [];
        const query = await Database.query().select('Addon_FaceRecognition').from('licence_ubiattendance')
        .where('OrganizationId',orgid);
        if(query.length > 0){    
         var face_addon =query[0].Addon_FaceRecognition;  
        }
       let query1:any =  Database.query()
       .select('E.Id','E.FirstName',Database.raw(`IF(E.lastname != '', CONCAT(E.FirstName, ' ', E.lastname), E.FirstName) as Name`),'E.Department','D.Name as DepartmentName','E.Designation','Desig.Name as DesignationName','E.Shift','S.name as Shiftname','U.Username as Email','U.username_mobile as mobile','U.Password','U.appSuperviserSts as adminsts','VisibleSts as archive','E.ImageName','U.Selfie','U.Device_Restriction as Device_Restriction','U.Finger_Print','U.Face_Id','U.QR_code',Database.raw("IFNULL((SELECT countrycode FROM CountryMaster WHERE Id = (SELECT CurrentCountry FROM EmployeeMaster as Emp WHERE Emp.Id = U.EmployeeId)), 0) as CountryCode"))
       .from('EmployeeMaster as E')
       .innerJoin('UserMaster as U','E.Id','U.EmployeeId')
       .innerJoin('DepartmentMaster as D','D.Id','E.Department')
       .innerJoin('DesignationMaster as Desig','Desig.Id','E.Designation')
       .innerJoin('ShiftMaster as S','S.Id','E.shift')
       .where('E.OrganizationId',orgid)
       .andWhere('U.VisibleSts',1)
       .andWhere('U.archive',1)
       .andWhere('E.archive',1)
       .andWhere('E.Is_Delete',0).limit(reqdata['perpage']).offset(reqdata['currentPage']);   
       if(searchtext!=''){
            query1 = query1.andWhere('FirstName','LIKE',"%"+searchtext+"%");
       }
    //    if(reqdata['status'] == 2){   /// for department HEad conditon
    //     query1 = query1.andWhere('E.Department','D.Id');
    //     }
        const quer= await query1;
        quer.forEach((row: any)=>{
        const data: any = {};
        data["EmployeeId"] = row.Id;
        data["Name"] = row.Name.trim();
        data['DepartmentId']=row.Department;
        data['Department']='-';
        if(row.DepartmentName != '' || row.DepartmentName != 'NULL'){
            data['Department'] = row.DepartmentName;
        }
        data['DesignationId']=row.Designation;
        data['DesignationName']='-';
        if(row.DesignationName != '' || row.DesignationName != 'NULL'){
            data['DesignationName'] = row.DesignationName;
        }
        data['ShiftId']=row.Shift;
        data['DesignationName']='-';
        if(row.DesignationName != '' || row.Shiftname != 'NULL'){
            data['Shiftname'] = row.Shiftname;
        }
        data['archive']=row.archive;
        data['Admin']= row.adminsts;
        //////////////
        data['Email']= Helper.decode5t(row.Email);
        
        data['Mobile']=Helper.decode5t(row.mobile);
        data['Password']=Helper.decode5t(row.Password);
        //console.log(data['Password'])
        //////////////////////
        data['Selfie'] = row.Selfie;
        data['Finger_Print'] = row.Finger_Print;
        data['Device_Restriction'] = row.Device_Restriction;
        data['Face_Id'] = row.Face_Id;
        data['QR_code'] = row.QR_code;
        data['CountryCode']=row.CountryCode;
        data['AddonFaceRecognition']=face_addon;
        data1.push(data);
      });
      return data1;
        
    }

    public async changests(reqdata:[]) {
        var status=false;
        const zone = await Helper.getTimeZone(reqdata['Orgid']);
        const currentDateTime = moment().tz(zone).format('YYYY-MM-DD HH:mm:ss');
        const affectedrows_1:any = await Database.query()
                .from("UserMaster")
                .where("EmployeeId",reqdata['empid'])
                .andWhere("OrganizationId",reqdata['Orgid'])
                .update({archive:reqdata['status'],LastModifiedDate:currentDateTime,LastModifiedById:reqdata['adminid']})
        const  affectedrows_2:any = await Database.query()
                .from("EmployeeMaster")
                .where("Id",reqdata['empid'])
                .andWhere("OrganizationId",reqdata['Orgid'])
                .update({archive:reqdata['status'],LastModifiedDate:currentDateTime,LastModifiedById:reqdata['adminid']})

        if(affectedrows_1 == 1 &&  affectedrows_2 == 1 ){
            status=true;
            const module:string = "Attendance App"; 
            const actionperformed:string = "<b>" + reqdata['empname'] + "</b> has been made inactive by <b>" + reqdata['adminname']  + "</b> from<b> Attendance App  </b>";
            const activityby:any = '1';
            const appmodule:string="Inactive";
            const InsertActivity = await Database.table("ActivityHistoryMaster")
                        .insert({
                                LastModifiedDate: currentDateTime,
                                LastModifiedById:reqdata['adminid'],
                                Module: module,
                                ActionPerformed:actionperformed,
                                OrganizationId:reqdata['Orgid'],
                                ActivityBy:activityby,
                                adminid:reqdata['adminid'],
                                AppModule:appmodule
                            });
        }
        return status;
    }

    public async updateSelfistatus(reqdata:[]) {
        var status = false;
        const selfistatus:number = +reqdata['selfistatus'];
        const zone = await Helper.getTimeZone(reqdata['Orgid']);
        const currentDateTime = moment().tz(zone).format('YYYY-MM-DD HH:mm:ss');
        const affectedrows:any = await Database.query()
        .from("UserMaster")
        .where("EmployeeId",reqdata['empid'])
        .andWhere("OrganizationId",reqdata['Orgid'])
        .update({Selfie:selfistatus,LastModifiedDate:currentDateTime,LastModifiedById:reqdata['adminid']});
        if(affectedrows > 0){
            status=true;
            const module:string = "Attendance App"; 
            const actionperformed:string = "<b>" + reqdata['empname'] + "</b> Selfie permission has been updated by <b>" + reqdata['adminname'] + "</b> from<b> Attendance App  </b>";
            const activityby:any = '1';
            const appmodule:string="Selfie";
            const InsertActivity = await Database.table("ActivityHistoryMaster")
                        .insert({
                                LastModifiedDate: currentDateTime,
                                LastModifiedById:reqdata['adminid'],
                                Module: module,
                                ActionPerformed:actionperformed,
                                OrganizationId:reqdata['Orgid'],
                                ActivityBy:activityby,
                                adminid:reqdata['adminid'],
                                AppModule:appmodule
                            });

        }
        return status; 
    }

    public async updateAllowAttToUser(reqdata:[]) {
        var status = false;
        const attRestrictSts:number = +reqdata['attRestrictSts'];
        const zone = await Helper.getTimeZone(reqdata['Orgid']);
        const currentDateTime = moment().tz(zone).format('YYYY-MM-DD HH:mm:ss');
        const update_permission:any = await Database.query()
        .from("UserMaster")
        .where("EmployeeId",reqdata['empid'])
        .andWhere("OrganizationId",reqdata['Orgid'])
        .update({Att_restrict:attRestrictSts,LastModifiedDate:currentDateTime,LastModifiedById:reqdata['adminid']});
        if(update_permission > 0){
            status=true;
            const module:string = "Attendance App"; 
            const actionperformed:string = "<b>" + reqdata['empname'] + "</b> Attendance Restrected By Permission has been updated by <b>" + reqdata['adminname'] + "</b> from<b> Attendance App  </b>";
            const activityby:any = '1';
            const appmodule:string="Attendance  Restrication";
            const InsertActivity = await Database.table("ActivityHistoryMaster")
                        .insert({
                                LastModifiedDate: currentDateTime,
                                LastModifiedById:reqdata['adminid'],
                                Module: module,
                                ActionPerformed:actionperformed,
                                OrganizationId:reqdata['Orgid'],
                                ActivityBy:activityby,
                                adminid:reqdata['adminid'],
                                AppModule:appmodule
                            });

        }
        return status; 
    }

    public async FacePermissionUpdate(reqdata:[]) {
        var status = false;
        const faceRestrictSts:number = +reqdata['faceRestrictSts'];
        const zone = await Helper.getTimeZone(reqdata['Orgid']);
        const currentDateTime = moment().tz(zone).format('YYYY-MM-DD HH:mm:ss');
        const update_permission:any = await Database.query()
        .from("UserMaster")
        .where("EmployeeId",reqdata['empid'])
        .andWhere("OrganizationId",reqdata['Orgid'])
        .update({Face_Id:faceRestrictSts,LastModifiedDate:currentDateTime,LastModifiedById:reqdata['adminid']});
        if(update_permission > 0){
            status=true;
            const module:string = "Attendance App"; 
            const actionperformed:string = "<b>" + reqdata['empname'] + "</b> Face Recognition permission has been updated by <b>" + reqdata['adminname'] + "</b> from<b> Attendance App  </b>";
            const activityby:any = '1';
            const appmodule:string="Face Recognition";
            const InsertActivity = await Database.table("ActivityHistoryMaster")
                        .insert({
                                LastModifiedDate: currentDateTime,
                                LastModifiedById:reqdata['adminid'],
                                Module: module,
                                ActionPerformed:actionperformed,
                                OrganizationId:reqdata['Orgid'],
                                ActivityBy:activityby,
                                adminid:reqdata['adminid'],
                                AppModule:appmodule
                            });

        }
        return status; 
    }
    
    public async DevicePermissionUpdate(reqdata:[]) {
        var status = false;
        const DeviceRestrictSts:number = +reqdata['DeviceRestrictSts'];
        const FingerPrintsts:number = +reqdata['FingerPrintSts'];
        const zone = await Helper.getTimeZone(reqdata['Orgid']);
        const currentDateTime = moment().tz(zone).format('YYYY-MM-DD HH:mm:ss');
        const update_permission:any = await Database.query()
        .from("UserMaster")
        .where("EmployeeId",reqdata['empid'])
        .andWhere("OrganizationId",reqdata['Orgid'])
        .update({Device_Restriction:DeviceRestrictSts,Finger_Print:FingerPrintsts,LastModifiedDate:currentDateTime,LastModifiedById:reqdata['adminid']});
        if(update_permission > 0){
            status=true;
            const module:string = "Device Restriction"; 
            const actionperformed:string = "<b>" + reqdata['empname'] + "</b> Device Restriction permission has been updated by <b>" + reqdata['adminname'] + "</b> from<b> Attendance App  </b>";
            const activityby:any = '1';
            const appmodule:string="Face Recognition";
            const InsertActivity = await Database.table("ActivityHistoryMaster")
                        .insert({
                                LastModifiedDate: currentDateTime,
                                LastModifiedById:reqdata['adminid'],
                                Module: module,
                                ActionPerformed:actionperformed,
                                OrganizationId:reqdata['Orgid'],
                                ActivityBy:activityby,
                                adminid:reqdata['adminid'],
                                AppModule:appmodule
                            });

        }
        return status; 
    }
    


}