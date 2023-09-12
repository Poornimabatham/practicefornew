import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
export default class getInfoService
{
    constructor(){}
    static async getInfo(alldata)
    { 
       const orgid:number  = alldata.refno;
       const uid:number  = alldata.uid;
       const platform:string  = alldata.platform;
       if(orgid == 0)
       {
          const refid:number  = alldata.refid;
       }
       const zone =  await Helper.getEmpTimeZone(uid,orgid);
       const dayjs = require('dayjs'); // You might use a library like "dayjs" for date manipulation
       const now = dayjs(); // Current date and time
       const time = now.format('HH:mm:ss'); 
       const stypeD = 0;
       let data:any = []; // Initialize an empty object
       let date1 = ''; // Initialize an empty string
       let MultipletimeStatus = 0; // Initialize with the value 0
       
      // Initialize an object to store your data
      data = {
      UnderTime: '',
      Visit: '',
      OutsideGeofence: '',
      FakeLocation: '',
      FaceIdReg: '',
      FaceIdDisapproved: '',
      SuspiciousSelfie: '',
      SuspiciousDevice: '',
      DisapprovedAtt: '',
      AttEdited: '',
      ChangedPassword: '',
      TimeOffStart: '',
      TimeOffEnd: '',
      Remark_Time_IN_OUT: 0,
      sstatus:0,
      CurrentOrgStatus:'',
      defaultShiftTimings:'',
      Addon_RegularizationPunch:0,
      UnderTimeMessage: '',
      VisitMessage: '',
      OutsideGeofenceMessage: '',
      FakeLocationMessage: '',
      FaceIdRegMessage: '',
      FaceIdDisapprovedMessage: '',
      SuspiciousSelfieMessage: '',
      SuspiciousDeviceMessage: '',
      DisapprovedAttMessage: '',
      AttEditedMessage: '',
      ChangedPasswordMessage: '',
      TimeOffStartStatusMessage: '',
      TimeOffEndStatusMessage: '',
      Rating:0,
      persistedface: '0',
      admin_password_sts:0,
      visitImage:0,
      attImage:0,
      visitAct:''
      };
      data.CurrentOrgStatus =  await Helper.getCurrentOrgStatus(orgid);
      data.defaultShiftTimings =  await Helper.getShiftIdByEmpID(uid);
      data.Addon_RegularizationPunch =  await Helper.getAddon_Regularization(orgid);

      //////////////////////////push notification//////////////////////
      let notificationStatus = await Database.from("NotificationStatus")
      .select([
         "UnderTime",
         "Visit",
         "OutsideGeofence",
         "FakeLocation",
         "FaceIdReg",
         "FaceIdDisapproved",
         "SuspiciousSelfie",
         "SuspiciousDevice",
         "DisapprovedAtt",
         "AttEdited",
         "ChangedPassword",
         "TimeOffStart",
         "TimeOffEnd"
      ])
      .where("OrganizationId", orgid)
      .first();

      data.UnderTime=notificationStatus.UnderTime;
      data.Visit=notificationStatus.Visit;
      data.OutsideGeofence=notificationStatus.OutsideGeofence;
      data.UnderTime=notificationStatus.FakeLocation;
      data.FaceIdReg=notificationStatus.FaceIdReg;
      data.FaceIdDisapproved=notificationStatus.FaceIdDisapproved;
      data.SuspiciousSelfie=notificationStatus.SuspiciousSelfie;
      data.SuspiciousDevice=notificationStatus.SuspiciousDevice;
      data.DisapprovedAtt=notificationStatus.DisapprovedAtt;
      data.AttEdited=notificationStatus.AttEdited;
      data.ChangedPassword=notificationStatus.ChangedPassword;
      data.TimeOffStart=notificationStatus.TimeOffStart;
      data.TimeOffEnd=notificationStatus.TimeOffEnd;

      //console.log(notificationStatus) ;
      let queryResult = await Database
      .from('NotificationMessage')
      .select('*')
      .where('id', 1)
      .first();

      if (queryResult) {
         data.UnderTimeMessage = queryResult.UnderTimeMessage;
         data.VisitMessage = queryResult.VisitMessage;
         data.OutsideGeofenceMessage = queryResult.OutsideGeofenceMessage;
         data.FakeLocationMessage = queryResult.FakeLocationMessage;
         data.FaceIdRegMessage = queryResult.FaceIdRegMessage;
         data.FaceIdDisapprovedMessage = queryResult.FaceIdDisapprovedMessage;
         data.SuspiciousSelfieMessage = queryResult.SuspiciousSelfieMessage;
         data.SuspiciousDeviceMessage = queryResult.SuspiciousDeviceMessage;
         data.DisapprovedAttMessage = queryResult.DisapprovedAttMessage;
         data.AttEditedMessage = queryResult.AttEditedMessage;
         data.ChangedPasswordMessage = queryResult.ChangedPasswordMessage;
         data.TimeOffStartStatusMessage = queryResult.TimeOffStartMessage;
         data.TimeOffEndStatusMessage = queryResult.TimeOffEndMessage;
      }
      ///////// Push Notification /////////////////
      //////////////////prevent Signup//////////////////////////////
      let preventSignupVar = {
         preventStatus: '',
         OldOrgName: '',
         OldOrgId: '',
       };
     
       const queryResult1 = await Database.from('PreventSignup')
         .select('Id', 'EmployeeId', 'OrganizationId', 'OldOrgId', 'OldOrgName', 'Status')
         .where('OrganizationId', orgid)
         .where('EmployeeId', uid)
         .first();
     
       if (queryResult1 > 0) {
         preventSignupVar.preventStatus = queryResult1.Status;
         preventSignupVar.OldOrgName = queryResult1.OldOrgName;
         preventSignupVar.OldOrgId = queryResult1.OldOrgId;
       }
       

       //////////////////prevent Signup//////////////////////////////
       ///////////////Rating/////////////
      
       const ratingData = await Database.from('ubiAttendanceRatings')
         .select('Rating')
         .where('EmployeeId', uid)
         .orderBy('CreatedDate', 'desc')
         .first();
     
       if (ratingData) {
         data.Rating = ratingData.Rating;
       }
      ////////////////******persistedface******/////////////
      const PFData = await Database.from('Persisted_Face')
         .select('PersistedFaceId')
         .where('EmployeeId', uid)
         .orderBy('Id', 'desc')
         .first();

         if (PFData) {
            data.persistedface = PFData.PersistedFaceId;
         }
      ///////////////change pwd//////////////////////////
         const ALdata = await Database.from('admin_login')
         .select('changepasswordStatus', 'visitImageStatus', 'AttnImageStatus')
         .where('OrganizationId', orgid)
         .andWhere('status', 1)
         .first();

         if (ALdata) { 
            data.admin_password_sts = ALdata.changepasswordStatus,
            data.visitImage = ALdata.visitImageStatus,
            data.attImage =  ALdata.AttnImageStatus
         } 
         //////////////visit Act//////////
         const todayDate = new Date().toISOString().split('T')[0];
         const query = await Database
         .from('checkin_master')
         .select(Database.raw("CASE WHEN (time != '00:00:00' AND time_out != '00:00:00') THEN 'Visit In' ELSE 'Visit Out' END as visitAct"))
         .where('OrganizationId', orgid)
         .where('EmployeeId', uid)
         .where('date', todayDate)
         .orderBy('id', 'desc')
         .limit(1);

         if (query.length > 0) {
            data.visitAct = query[0].visitAct;
         } else {
            data.visitAct = 'Visit In';
         }
       ////////////////Organization data///////////////
       const orgData = await Database
       .from('Organization')
       .select(
         'mail_varified',
         'Country',
         'CreatedDate',
         'Name',
         'ubihrm_sts',
         'Visit_Restriction',
         Database.raw('(select Name from CountryMaster where Id=Country) as CountryName'),
         Database.raw('(select countrycode from CountryMaster where Id=Country) as countrycode'),
         'deviceverification_setting',
         'GeoFenceRestriction'
       )
       .where('Id', orgid);
       
       if (orgData.length > 0) {
           const row = orgData[0];
           data.ableToMarkAttendance=row.GeoFenceRestriction;
           data.mail_varified= row.mail_varified;
           data.deviceverification_setting= row.deviceverification_setting;
           data.orgcountry = row.Country;
           data.CountryName = row.CountryName.replace(' ', ''),
           data.CreatedDate = row.CreatedDate;
           data.countrycode= row.countrycode,
           data.OrgName = row.Name;
           data.ubihrm_sts = row.ubihrm_sts;
           data.Visit_Restriction = row.Visit_Restriction;
           const string = data.OrgName;
           const capitalizedString = string.charAt(0).toUpperCase() + string.slice(1);
           const stringWithHyphens = capitalizedString.replace(/ /g, '-');
           const cleanedString = stringWithHyphens.replace(/[^A-Za-z0-9\-]/g, '');
           data.OrgTopic = cleanedString + orgid;

            if ( data.OrgName !== '') {
               data.orgDelStatus = "1";
            }else{
               data.orgDelStatus="0"
            }
         }
         /////////////////All Addon Permission////////////////// 
           let addonVar = {
            Addon_BulkAttn: 0,
            Addon_GeoFence: 0,
            Addon_Payroll: 0,
            Addon_Tracking: 0,
            Addon_VisitPunch: 0,
            Addon_TimeOff: 0,
            Addon_flexi_shif: 0,
            Addon_offline_mode: 0,
            Addon_AutoTimeOut: 0,
            Addon_FaceRecognition: 0,
            addon_COVID19: 0,
            Addon_DeviceVerification: 0,
            addon_livelocationtracking: 0,
            User_limit: 0,
            buysts: 0,
            Addon_ShiftPlanner: 0,
            Addon_BasicLeave: 0,
            Addon_advancevisit: 0,
            RemarkPermission: 0,
            Addon_FingerPrint: 0,
            Addon_QrAttendance: 0,
            image_status: 0,
            offline_mode_permission: 0,
            Addon_OffLine_QR: 0,
            allowOverTime: false,
            Addon_GeoFenceNotification:0,
            Geofence_visit:0,
            Remark_Time_IN_OUT:0
          };
          
         const addon_permis = await Database
         .from('licence_ubiattendance')
         .select(
            'Addon_BulkAttn',
            'addon_livelocationtracking',
            'status',
            'Addon_LocationTracking',
            'Addon_VisitPunch',
            'Addon_GeoFence',
            'Addon_Payroll',
            'Addon_TimeOff',
            'Addon_flexi_shif',
            'Addon_offline_mode',
            'addon_COVID19',
            'Addon_AutoTimeOut',
            'Addon_FaceRecognition',
            'Addon_DeviceVerification',
            'user_limit',
            'Addon_ShiftPlanner',
            'Addon_BasicLeave',
            'Addon_advancevisit',
            'RemarkPermission',
            'Addon_FingerPrint',
            'Addon_QrAttendance',
            'image_status',
            'offline_mode_permission',
            'Addon_GeoFenceNotification',
            'Geofence_visit',
            Database.raw('CAST(Remark_Time_IN_OUT AS UNSIGNED) as Remark_Time_IN_OUT'),
            Database.raw('allowOverTime = 0 as allowOverTime'),
            'Addon_OffLine_QR'
         )
         .where('OrganizationId', orgid)
         .first();
         const licData = addon_permis;
         if (licData) 
         {
            addonVar.Addon_BulkAttn= licData.Addon_BulkAttn;
            addonVar.Addon_Payroll=licData.Addon_Payroll;
            addonVar.Addon_Tracking= licData.Addon_LocationTracking;
            addonVar.Addon_VisitPunch= licData.Addon_VisitPunch;
            addonVar.Addon_GeoFence= licData.Addon_GeoFence;
            addonVar.Addon_TimeOff= licData.Addon_TimeOff;
            addonVar.Addon_flexi_shif= licData.Addon_flexi_shif;
            addonVar.Addon_offline_mode= licData.Addon_offline_mode;
            addonVar.Addon_AutoTimeOut= licData.Addon_AutoTimeOut;
            addonVar.Addon_FaceRecognition= licData.Addon_FaceRecognition;
            addonVar.Addon_DeviceVerification= licData.Addon_DeviceVerification;
            addonVar.addon_COVID19= licData.addon_COVID19;
            addonVar.addon_livelocationtracking= licData.addon_livelocationtracking;
            addonVar.buysts= licData.status;
            addonVar.User_limit= licData.user_limit;
            addonVar.Addon_ShiftPlanner= licData.Addon_ShiftPlanner;
            addonVar.Addon_BasicLeave= licData.Addon_BasicLeave;
            addonVar.Addon_advancevisit= licData.Addon_advancevisit;
            addonVar.RemarkPermission= licData.RemarkPermission;
            addonVar.Addon_FingerPrint= licData.Addon_FingerPrint;
            addonVar.Addon_QrAttendance= licData.Addon_QrAttendance;
            addonVar.image_status= licData.image_status;
            addonVar.offline_mode_permission= licData.offline_mode_permission;
            addonVar.Addon_GeoFenceNotification= licData.Addon_GeoFenceNotification;
            addonVar.Geofence_visit= licData.Geofence_visit;
            addonVar.Remark_Time_IN_OUT = parseInt(licData.Remark_Time_IN_OUT);
            addonVar.Addon_OffLine_QR= licData.Addon_OffLine_QR;
            addonVar.allowOverTime= licData.allowOverTime === 0 ? false : true;
         };
      /////////////////employeeMaster Data/////////////////
         let empVar = {
            areaId: 0,
            areaId1: 0,
            assign_lat: 0,
            assign_long: 0,
            assign_radius: 0,
            facePersonId:'',
            deviceid:'',
            faceSettingSts:0,
            archiveStatus:0,
            is_DelStatus:0,
            NotificationStatus:0,
            MultipletimeStatus:0,
            FirstName:'',
            geofencerestriction:0,
            fencearea:0,
            area_assigned:0,
            EmployeeTopic:'',
            TrackLocationEnabled:0,
            currentDate:'',
            departmentid:0,
            designationid:0,shiftId:0,
            InPushNotificationStatus:0,
            OutPushNotificationStatus:0,emputilizedleave:'',
            empbalanceleave:'0.0',
            departmentname:'',
            designationname:'',
            Is_Delete:0,
            ShiftTimeIn:'00:00',
            ShiftTimeOut:'00:00',
            ShiftType:0,
            EmpShiftTimeIn:'',
            EmpShiftTimeOut:'',shiftName:'',MinimumWorkingHours:'00:00:00',
            aid:0,stypeD:"00:00:00"
         };
         const EmpData = await Database
         .from('EmployeeMaster')
         .select(
            'Id','EmployeeCode','FirstName','LastName','Designation','fencearea',
            'Department','shift','area_assigned','ImageName','OrganizationId',
            'Is_Delete','archive','InPushNotificationStatus','OutPushNotificationStatus',
            'livelocationtrack','MultipletimeStatus','DeviceId','NotificationStatus','PersonId'
         )
         .where('id', uid)
         .first();
         if (EmpData) {
            // Assuming the result is an object with properties corresponding to the columns
            empVar.areaId = EmpData.area_assigned;
            empVar.facePersonId = EmpData.PersonId || '';
           // empVar.faceSettingSts = '0'; // 0 for off, 1 for on in Flutter
            empVar.deviceid = EmpData.DeviceId;
            empVar.archiveStatus = EmpData.archive;
            empVar.is_DelStatus = EmpData.Is_Delete;
            empVar.NotificationStatus = EmpData.NotificationStatus;
            empVar.MultipletimeStatus = 0;
            const EmployeeId = EmpData.Id;
            empVar.FirstName = EmpData.FirstName + ' ' + EmpData.LastName;
            empVar.geofencerestriction = EmpData.fencearea;
            empVar.fencearea = EmpData.fencearea;
            empVar.area_assigned = EmpData.area_assigned;
            const formattedFirstName = empVar.FirstName.replace(/\s+/g, '-').replace(/[^A-Za-z0-9\-]/g, '');
            empVar.EmployeeTopic = formattedFirstName + EmployeeId;
            empVar.TrackLocationEnabled = EmpData.livelocationtrack;
            empVar.departmentid = EmpData.Department;
            empVar.designationid = EmpData.Designation;
            empVar.shiftId = EmpData.shift;
            empVar.OutPushNotificationStatus = EmpData.OutPushNotificationStatus;
            empVar.InPushNotificationStatus = EmpData.InPushNotificationStatus;
            empVar.Is_Delete= EmpData.Is_Delete;
            empVar.areaId = 0;
            const temp = EmpData.area_assigned.trim();
            empVar.areaId1 = temp !== '' ? temp : '0';            
            const areafirst = temp.split(',');
            empVar.areaId = areafirst[0] !== '' ? areafirst[0] : '0';

            const areada = await Helper.getAreaInfo(empVar.areaId);
            if (areada !== '0') {
               empVar.assign_lat = areada.lat;
               empVar.assign_long = areada.long;
               empVar.assign_radius = parseFloat(areada.radius);
            }
          }

          if(addonVar.Addon_BasicLeave == 1)
          {
            const todayDate = new Date().toISOString().split('T')[0];
            const getLeaveCountApp = await Helper.getLeaveCountApp(orgid,uid,todayDate);
            empVar.emputilizedleave = getLeaveCountApp !== '' ? parseFloat(getLeaveCountApp).toFixed(1) : '0.0';
            const getBalanceLeave = await Helper.getBalanceLeave(orgid,uid,todayDate);
            if ( getLeaveCountApp !== '' && getBalanceLeave !== '' && getBalanceLeave.trim() !== 'undefined') {
               const difference = parseFloat(getBalanceLeave) - parseFloat(getLeaveCountApp);
               empVar.empbalanceleave = difference.toFixed(1);
            }  
          }
            empVar.departmentname = await Helper.getDepartmentName(empVar.departmentid);
            empVar.designationname = await Helper.getDesignationName(empVar.designationid);
            empVar.MultipletimeStatus = await Helper.getshiftmultipletime_sts(uid,todayDate,empVar.shiftId);

         ///////////////////////Shift Info//////////////////////
            const {shifttype,ShiftTimeOut,shiftTimeIn,shiftName,minworkhrs,diffShiftTime} = await Helper.getShiftTimeByEmpID(uid) ;

            empVar.ShiftTimeIn = shiftTimeIn;  
            empVar.ShiftTimeOut = ShiftTimeOut;  
            empVar.ShiftType = shifttype; 
            empVar.EmpShiftTimeIn = todayDate+' '+shiftTimeIn ;
            empVar.EmpShiftTimeOut = todayDate+' '+ShiftTimeOut ;
            empVar.shiftName = shiftName;
            empVar.MinimumWorkingHours = minworkhrs;
            empVar.stypeD = diffShiftTime;
            //console.log(stypeD);
            
         ///////////////////////Attendance Act/////////////////////////////

         let attVar = {
            aid:0,
            TimeOut:'00:00:00',
            act : ''
         };
         const { subDays, format } = require('date-fns');
         const yesterDate = format(subDays(new Date(), 1), 'yyyy-MM-dd');

         
         if((empVar.ShiftType == 3) || (empVar.ShiftType == 1  && empVar.MultipletimeStatus==1))
         {

            const ActValue = await Database.from('AttendanceMaster').select('id','TimeOut').where('EmployeeId',uid).first();
            if(ActValue)
            {
               const aid = ActValue.id ;
               const InterimData = await Database.from('InterimAttendances').select('TimeIn','TimeOut').where('Id',aid).first();
               if(InterimData)
               {
                  if(InterimData.TimeOut == InterimData.TimeIn)
                  {
                     attVar.act = 'TimeOut';
                  }
                  else
                  {
                     attVar.act = 'TimeIn';
                  }

               }
               else
               {
                  attVar.act = 'TimeIn';
               }
            }
            else{
               
               const ActValue = await Database
               .from('AttendanceMaster')
               .select('id','TimeOut')
               .where('EmployeeId',uid)
               .andWhere('AttendanceDate', yesterDate)
               .first();
               if(ActValue)
               {
                  const aid = ActValue.id ;
                  const InterimData = await Database.from('InterimAttendances')
                  .select('TimeOut','TimeIn')
                  .where('AttendanceMasterId',aid)
                  .andWhere('EmployeeId',uid)
                  .first();
                  
                  if(InterimData)
                  {
                     if(InterimData.TimeOut == InterimData.TimeIn) 
                     {
                        attVar.act = 'TimeIn';
                     }

                  }
                  else
                  {
                      const InterimData = await Database
                     .from('InterimAttendances')
                     .select('TimeOut', 'TimeIn')
                     .where('AttendanceMasterId', aid)
                     .andWhere('EmployeeId', uid)
                     .orderBy('id', 'desc')
                     .limit(1)
                     .first(); 

                     if(InterimData)
                     {
                       if(InterimData.TimeOut == InterimData.TimeIn)
                       {
                          let Emp ='';
                          if(empVar.ShiftType == 3)
                          {
                              Emp = InterimData.TimeIn;
                          }
                          else{
                             Emp = empVar.EmpShiftTimeIn;
                          }
                           
                           const shiftedTime = new Date(Emp);
                           shiftedTime.setHours(shiftedTime.getHours() - 2);  
                           const dateObj = new Date(shiftedTime);
                           const shiftT = await Helper.dateFormate(dateObj); ////minus 2 hour with sift timeout time
                           const currentDate = await Helper.dateFormate(dateObj);////current date
                           shiftedTime.setHours(shiftedTime.getHours() - 2);
                           if(shiftT < currentDate)
                           {
                              attVar.act = 'TimeIn';
                           }
                           else{
                              attVar.act = 'TimeOut';
                           }
                        }else{
                           attVar.act = 'TimeIn';
                        }
                  
                     }else{
                        attVar.act = 'TimeIn';
                     }
                  }
                  
               }else{
                  attVar.act = 'TimeIn';
               }
            }
               
         }///////////////flexi and sigle date multiple time in time out  condition End here//////// 
         else
         {   //// if shift is end whithin same date
             if(empVar.ShiftType <= 1){

             }
         }
         
      
      const  test = { ...data, ...preventSignupVar, ...addonVar , ...empVar , ...attVar}
      return test
      
    }
}