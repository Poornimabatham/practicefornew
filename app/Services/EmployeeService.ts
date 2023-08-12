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
        const zone = await Helper.getTimeZone(reqdata['Orgid']);
        const currentDateTime = moment().tz(zone).format('YYYY-MM-DD HH:mm:ss');
        const column_value:{[key:string]:any}={}//object creation        
        if(reqdata['DeviceRestrictSts'] == false){
            column_value['Device_Restriction']= +reqdata['DeviceRestrictSts'];
            column_value['Finger_Print']= 0;
        }else{
            column_value['Device_Restriction']= +reqdata['DeviceRestrictSts'];
        }
        column_value['LastModifiedDate']=currentDateTime;
        column_value['LastModifiedById']=reqdata['adminid'];
        const update_permission:any = await Database.query()
        .from("UserMaster")
        .where("EmployeeId",reqdata['empid'])
        .andWhere("OrganizationId",reqdata['Orgid'])
        .update(column_value);
        if(update_permission > 0){
            status=true;
            const module:string =  "Attendance App";
            const actionperformed:string = "<b>" + reqdata['empname'] + "</b> Device Restriction permission has been updated by <b>" + reqdata['adminname'] + "</b> from<b> Attendance App  </b>";
            const activityby:any = '1';
            const appmodule:string= "Device Restriction";
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
    public async fingerPrintPermissionUpdate(reqdata:[]) {
        var status = false;
        const zone = await Helper.getTimeZone(reqdata['Orgid']);
        const currentDateTime = moment().tz(zone).format('YYYY-MM-DD HH:mm:ss');
        const Device_Restriction:number = +reqdata['DeviceRestrictSts'];
        const FingerPrintSts:number= +reqdata['FingerPrintSts'];
        const update_permission:any = await Database.query()
        .from("UserMaster")
        .where("EmployeeId",reqdata['empid'])
        .andWhere("OrganizationId",reqdata['Orgid'])
        .andWhere("Device_Restriction",'1')
        .update({Device_Restriction:Device_Restriction,Finger_Print:FingerPrintSts,LastModifiedDate:currentDateTime,LastModifiedById:reqdata['adminid']});
        if(update_permission > 0){
            status=true;
            const module:string =  "Attendance App";
            const actionperformed:string = "<b>" + reqdata['empname'] + "</b> Touch ID permission has been updated by <b>" + reqdata['adminname'] + "</b> from<b> Attendance App  </b>";
            const activityby:any = '1';
            const appmodule:string= "Touch ID";
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
    public async EmpDetailUpdate(reqdata:[]) {
        var status = false;
        const zone = await Helper.getTimeZone(reqdata['Orgid']);
        const currentDateTime = moment().tz(zone).format('YYYY-MM-DD HH:mm:ss');
        const column_value:{[key:string]:any}={}//object creation 
        column_value['Id']=reqdata['empid'];
        column_value['LastModifiedDate']=currentDateTime;
        column_value['LastModifiedById']=reqdata['adminid'];
        let update_EmpDetail:any;
        if(reqdata['username'] != ''){
            const username:string=Helper.encode5t(reqdata['username']); 
            const CheckUsername:any = await Database.query().select('Id','username').from("UserMaster").where({username:username,EmployeeId:reqdata['empid']});
            if(CheckUsername.length>0){
                return 2;
            }else{
                update_EmpDetail  = await Database.query()
                .from("UserMaster")
                .where("EmployeeId",reqdata['empid'])
                .andWhere("OrganizationId",reqdata['Orgid'])
                .update({username:username});
               
            }
        }
        if(reqdata['f_name']!=''){
            column_value['FirstName'] = Helper.FirstLettercapital(reqdata['f_name']);
        }
        if(reqdata['department']!=''){
            column_value['Department']=reqdata['department'];
        }
        if(reqdata['designation']!=''){
            column_value['Designation']=reqdata['designation']; 
        }
        if(reqdata['designation'] !=''){
            column_value['Designation']= reqdata['designation'];
        }
        if(reqdata['shifts'] != '')
        {
            column_value['Shift']=reqdata['shifts'];
        }
        update_EmpDetail = await Database.query()
        .from("EmployeeMaster")
        .where("Id",reqdata['empid'])
        .andWhere("OrganizationId",reqdata['Orgid'])
        .update(column_value);
        if(update_EmpDetail > 0){
            status=true;
            const module:string =  "Attendance App";
            const actionperformed:string = "<b>" + reqdata['empname'] + "</b> Details has been Updated by<b>" + reqdata['adminname'] + "</b> from<b> Attendance App  </b>";
            const activityby:any = '1';
            const appmodule:string= "Employees";
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

    public async RegitserEmpDetail(reqdata:[]) {
        var status = false;
        const zone = await Helper.getTimeZone(reqdata['Orgid']);
        const currentDateTime = moment().tz(zone).format('YYYY-MM-DD HH:mm:ss');
        const countryId=await Helper.getCountryIdByOrg(reqdata['Orgid']);
        var username:string;
        if(reqdata['username'] != '' ){
             username=Helper.encode5t(reqdata['username']); 
            const CheckUsername:any = await Database.query().select('Id','username').from("UserMaster").where({username:username});
            if(CheckUsername.length > 0){
                return 2; //email already Exist
            }
        }
        var contact:string;
        if(reqdata['contact'] != '' ){
           
            contact= Helper.encode5t(reqdata['contact'].toString()); 
          
            const CheckContact:any = await Database.query().select('Id','username','archive','EmployeeId','OrganizationId').from("UserMaster").where({username_mobile:contact});
          
            if(CheckContact.length > 0){
                const orgid:any=CheckContact[0].OrganizationId;
                const archive:any=CheckContact[0].archive;
                if(reqdata['Orgid'] == orgid){
                    if(archive == 1){
						
                       return 3;///Active employee with same org exist
                       
                   }else{
                       
                        return 4;///InActive employee with same org
                       
                   }
                }else{
                    return 5; //1.sign up another organization ,2. Email or msg  notification!
                }   
            }
        }

        if((reqdata['shifts']== '') ||(reqdata['shifts'] == 0)){
            const CheckShift:any = await Database.query().select('Id').from("ShiftMaster").where({OrganizationId:reqdata['Orgid']}).orderBy('Id', 'asc').limit(1).offset(0); 
            if(CheckShift.length > 0 ){
                reqdata['shifts']= CheckShift[0].Id;
            }
        }
        if((reqdata['department']== '') ||(reqdata['department'] == 0)){
            const CheckDepartment:any = await Database.query().select('Id').from("DepartmentMaster").where({OrganizationId:reqdata['Orgid']}).orderBy('Id', 'asc').limit(1).offset(0); 
            if(CheckDepartment.length > 0 ){
                reqdata['department']= CheckDepartment[0].Id;
            } 
        }
        if((reqdata['Designation']== '') || (reqdata['Designation'] == 0)){
            const CheckDesignation:any = await Database.query().select('Id').from("DesignationMaster").where({OrganizationId:reqdata['Orgid']}).orderBy('Id', 'asc').limit(1).offset(0); 
            if(CheckDesignation.length > 0 ){
                reqdata['designation']= CheckDesignation[0].Id;
            } 
        }

        const column_value:{[key:string]:any}={}//object creation 
        column_value['FirstName']=reqdata['name'];
        column_value['LastName']='';
        column_value['PersonalNo']=contact;
        column_value['Shift']=reqdata['shifts'];
        column_value['OrganizationId']=reqdata['Orgid'];
        column_value['Department']=reqdata['department'];
        column_value['Designation']=reqdata['designation'];
        column_value['CompanyEmail']=username;
        column_value['countrycode']='';
        column_value['CurrentCountry']='';
        column_value['CreatedDate']=currentDateTime;
        column_value['doj']='0000-00-00';
        column_value['livelocationtrack']='';
       
//   console.log(column_value);
//             return false;
        var lastInsertedId:any = (await Database.table("EmployeeMaster").insert(column_value).returning('Id')).toString();
       console.log("EmployeeId"+lastInsertedId);
        if(lastInsertedId.length > 0){
            status =true;
            const column_value1:{[key:string]:any}={}//object creation 
            column_value1['EmployeeId']=lastInsertedId;
            column_value1['Password']= await Helper.encode5t(reqdata['password']);
            column_value1['Username']=username;
            column_value1['OrganizationId']=reqdata['Orgid'];
            column_value1['CreatedDate']=currentDateTime;
            column_value1['LastModifiedDate']=currentDateTime;
            column_value1['username_mobile']=contact;
            column_value1['LastModifiedById']=reqdata['adminid'];
            column_value1['CreatedById']=reqdata['adminid'];
            // console.log(column_value1);
            // return false;
            let lastInsertedId1 = (await Database.table("UserMaster").insert(column_value1).returning('Id')).toString();
            if(lastInsertedId1.length > 0){

                const module:string =  "Attendance App";
                const actionperformed:string = "<b>" + reqdata['name'] + "</b>Details has been added by<b>" + reqdata['adminname'] + "</b> from<b> Attendance App  </b>";
                const activityby:any = '1';
                const appmodule:string= "Employees";
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
                return 1;//successfully added;
            }else{
                return 6;//not inserted  in usermaster
            }

        }else{
            return 6;//not inserted in EmployeeMaster
        }

    }
    


}