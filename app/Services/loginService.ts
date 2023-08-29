import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import moment from "moment";
// import Helper from "App/Helper/Helper";

export default class loginService {
  public static async login(getData) {
    let userName1: string = getData.userName;
    let password1: string = getData.password;
    const query = await Database.from("OrganizationTemp")
      .where("Email", userName1)
      .andWhere("password", password1)
      .select("*");

    if (query.length > 0) {
      const arr: any = [];
      arr.push(query[0].Name);
      arr.push(query[0].Email);
      arr.push(query[0].password);
      arr.push(query[0].Id);
      arr.push(10);
      return arr;
    } else {
      return 0;
    }
  }
  public static async storetoken(arr: any = {}) {
    const query1 = await Database.query()
      .select("*")
      .from("Emp_key_Storage")
      .where("EmployeeId", arr.id)
      .andWhere("OrganizationId", arr.orgid);
    if (query1.length > 0) {
      await Database.query()
        .from("Emp_key_Storage")
        .where("EmployeeId", arr.id)
        .andWhere("OrganizationId", arr.orgid)
        .update("token", arr.token);
      return arr.id; //id where is updation perform
    } else {
      await Database.table("Emp_key_Storage")
        .insert({
          EmployeeId: arr.id,
          OrganizationId: arr.orgid,
          Token: arr.token,
        })
        .returning("id");

      return arr.id; // last inserted Id;
    }
  }

  public static async logout(getData) {
    try {
      let empid = getData.empid;
      let orgid = getData.orgid;
      let token = "";
      const query = await Database.query()
        .from("Emp_key_Storage")
        .where("EmployeeId", empid)
        .andWhere("OrganizationId", orgid)
        .update("token", token);
      if (query.length > 0) {
        return 1;
      }
    } catch (err) {
      console.log(err);
      return 0;
    }
  }

  public static async newregister_orgTemp(data){

    const username      = data.username;
    const Org_Name      = data.companyName;
    const useremail     = data.useremail;
    const userpassword  = data.userpassword;
    const countrycode   = data.countrycode;
    const countrycodeid = data.countrycodeid;
    const phoneno       = data.phoneno;
    const appleAuthId   = data.appleAuthId;
    const platform      = data.platform;
    const app           = data.app;
    const skipOTP       = data.skipOTP;
    const emailVerification = data.emailVerification;

    const date = moment().format("YY-MM-DD"); 
    const empid = 0;
    const orgid = 0;
    const result:any = {};
    const email = await Helper.encode5t(useremail);
    const phone = await Helper.encode5t(phoneno);
    const Password = await Helper.encode5t(userpassword)
    const res:any = {};
    let id = 0;
    let timezone = 0;
    let days     = 1;
    let emplimit = 0; 
    let addonbulkatt = 0;
    let addonlocationtrack = 0;
    let addonvisit = 0;
    let addongeofence = 0;
    let addonpayroll = 0;
    let addontimeoff = 0;
    let address ='';
    

    const query1 = await Database.query().from('Organization').select('Id').where('Email',useremail);   
    if(query1.length > 0){
        res['status'] = "false1";
        return res;
    }

    const query2 = await Database.query().from('Organization').where('PhoneNumber',phoneno) 
    if(query2.length > 0){
        res['status'] = "false2";
        return res;
    }

    const query3 = await Database.query().from('Organization').where('Email',useremail).andWhereNot('cleaned_up',1).andWhereNot('delete_sts','1').andWhereNot('delete_sts','2')
    if(query3.length > 0){
        res['status'] = "false1";               /////emailid duplicate
        return res;
    }

    const query4 = await Database.query().from('UserMaster').where('Username',email);
    if(query4.length > 0){
        res['status'] = "false1"              ///////emailid duplicate
        return res;
    }

    const query5 = await Database.query().from('Organization').where('PhoneNumber',phoneno).andWhereNot('cleaned_up',1).andWhereNot('delete_sts','1');
    if(query5.length > 0){
        res['status'] = "false2";
        return res;
    }

    const query6 = await Database.query().from('UserMaster').where('username_mobile',phone);
    if(query6.length > 0){
        res['status'] = "false2";
        return res;
    }
    
    const insertorgquery = await Database.table('Organization').insert({Name:Org_Name,smtpuser:username,Email:useremail,countrycode:countrycode,PhoneNumber:phoneno,smtppassword:userpassword,platform:platform,app:app,Country:countrycodeid}).returning('Id');
   
    if(insertorgquery.length > 0){
         id = insertorgquery[0];
    }
  
    // if(query7.length > 0)
    // {
    //    const id = query7[0].Id;
    //    let otp = id.length;
    //    if(skipOTP == '1'){
    //        otp = '0000';
    //    }else{
    //     $tempotp = rand(pow(10, $digits-1), pow(10, $digits)-1);
    //     $otp = $otp.$tempotp;
    //    }
    // }

    // query8 = await Database.query().from('Organization').where('id',id).update({OTP:otp})

    // Email functionality

    //  const FetchOrg = await Database.query().from('Organization').select('*').where('Id',id);
    //  if(FetchOrg.length > 0){
    //     const Org_Name = FetchOrg[0].Name;
    //     const Person_Name = FetchOrg[0].smtpuser;
    //     const email = FetchOrg[0].Email;
    //     const password = FetchOrg[0].smtppassword;
    //     const country_code = FetchOrg[0].countrycode;
    //     const phone = FetchOrg[0].PhoneNumber;
    //     const country = FetchOrg[0].Country;
    //     const platform = FetchOrg[0].platform;
    //     const App = FetchOrg[0].app;
    //  }

     const FetchZone = await Database.query().from('ZoneMaster').select('*').where('CountryId',countrycodeid); 
     if(FetchZone.length > 0){
         timezone = FetchZone[0].Id;
     }

     const fetchquery = await Database.query().from('ubitech_login').select('*');
     if(fetchquery.length > 0){
         days = fetchquery[0].trial_days;
         emplimit = fetchquery[0].user_limit;
         addonbulkatt = fetchquery[0].bulk_attendance;
         addonlocationtrack =fetchquery[0].location_tracing;
         addonvisit = fetchquery[0].visit_punch;
         addongeofence = fetchquery[0].geo_fence;
         addonpayroll = fetchquery[0].payroll;
         addontimeoff = fetchquery[0].time_off;

     }

     const start_date = moment().format('YY-MM-DD')
     const a = moment() 
     const b = moment.duration(`${days}`, 'days');
     const end_date = a.add(b).format('YY-MM-DD')
    
     const UpdateOrg = await Database.query().from('Organization').where('Id',id).update({Address:address,TimeZone:timezone,CreatedDate:date,LastModifiedDate:date,Country:countrycodeid,mail_varified:emailVerification,fiscal_start:'1 April',fiscal_end:'31 March',});
     if(UpdateOrg)
     {
        // Email functionality

     const insert_adminlogin = await Database.table('admin_login').insert({username:username,password:userpassword,email:useremail,OrganizationId:id,name:username});

     ///////////write function encrypted form for password

     const insert_notification = await Database.table('NotificationStatus').insert({OrganizationId:id});

     const insert_whitelabel = await Database.table('WhiteLabeling').insert({OrganizationId:id});
     
     const insert_alert = await Database.table('Alert_Settings').insert({OrganizationId:id,Created_Date:date});

     const column_value:{[key:string]:any}={}
     column_value['OrganizationId']=id
     column_value['start_date'] = start_date
     column_value['end_date'] = end_date
     column_value['extended']="1"
     column_value['user_limit']=emplimit
     column_value['Addon_BulkAttn']=addonbulkatt
     column_value['Addon_VisitPunch']=addonvisit
     column_value['Addon_GeoFence']=addongeofence
     column_value['Addon_Payroll']=addonpayroll
     column_value['Addon_TimeOff']=addontimeoff
     if(app == "ubiSales"){
       column_value['Addon_LocationTracking']=addonlocationtrack
     }

     let  insert_licence = await Database.table('licence_ubiattendance').insert(column_value).toQuery();

     let dept_array:any = {};
     
     dept_array = [
          {
            "Name":'Trial Department',
            "OrganizationId":`${id}`
          },
          {
            "Name":'Human Resource',
            "OrganizationId":`${id}`
          },
          {
            "Name":'Finance',
            "OrganizationId":`${id}`
          },
          {
            "Name":'Clerk',
            "OrganizationId":`${id}`
          }

     ]

      const insert_Department = await Database.table('DepartmentMaster').insert(dept_array)
     
      let shift_array:any = {}

      shift_array = [
        {
          "Name":"Trial Shift",
          "TimeIn":"09:00:00",
          "TimeOut":"18:00:00",
          "OrganizationId":`${id}`,
          "HoursPerDay":"09:00:00"
        }
      ]

      const insert_shift = await Database.table('ShiftMaster').insert(shift_array);

      let desi_array:any = {}

      desi_array = [
        {
          "Name":'Trial Designation',
          "OrganizationId":`${id}`
        },
        {
          "Name":'Manager',
          "OrganizationId":`${id}`
        },
        {
          "Name":'HR',
          "OrganizationId":`${id}`
        },
        {
          "Name":'Clerk',
          "OrganizationId":`${id}`
        }
      ]

      const insert_desi = await Database.table('DesignationMaster').insert(desi_array);

      const roleid = await Helper.getDesignationId("Trial Designation",id);

      let permission_array:any = {};

      permission_array = [
        {
          "RoleId":roleid,
           "ModuleId":"12",
           "ViewPermission":1,
           "EditPermission":1,
           "DeletePermission":1,
           "AddPermission":1,
           "OrganizationId":id,
           "LastModifiedDate":date,
           "CreatedDate":date
        },
        {
          "RoleId":roleid,
           "ModuleId":"13",
           "ViewPermission":1,
           "EditPermission":1,
           "DeletePermission":1,
           "AddPermission":1,
           "OrganizationId":id,
           "LastModifiedDate":date,
           "CreatedDate":date
        },
        {
          "RoleId":roleid,
           "ModuleId":"18",
           "ViewPermission":1,
           "EditPermission":1,
           "DeletePermission":1,
           "AddPermission":1,
           "OrganizationId":id,
           "LastModifiedDate":date,
           "CreatedDate":date
        },
        {
          "RoleId":roleid,
           "ModuleId":"42",
           "ViewPermission":1,
           "EditPermission":1,
           "DeletePermission":1,
           "AddPermission":1,
           "OrganizationId":id,
           "LastModifiedDate":date,
           "CreatedDate":date
        },
        {
          "RoleId":roleid,
           "ModuleId":"179",
           "ViewPermission":1,
           "EditPermission":1,
           "DeletePermission":1,
           "AddPermission":1,
           "OrganizationId":id,
           "LastModifiedDate":date,
           "CreatedDate":date
        },
        {
          "RoleId":roleid,
           "ModuleId":"305",
           "ViewPermission":1,
           "EditPermission":1,
           "DeletePermission":1,
           "AddPermission":1,
           "OrganizationId":id,
           "LastModifiedDate":date,
           "CreatedDate":date
        },
        {
          "RoleId":roleid,
           "ModuleId":"19",
           "ViewPermission":1,
           "EditPermission":1,
           "DeletePermission":1,
           "AddPermission":1,
           "OrganizationId":id,
           "LastModifiedDate":date,
           "CreatedDate":date
        },
        {
          "RoleId":roleid,
           "ModuleId":"47",
           "ViewPermission":1,
           "EditPermission":1,
           "DeletePermission":1,
           "AddPermission":1,
           "OrganizationId":id,
           "LastModifiedDate":date,
           "CreatedDate":date
        },
        {
          "RoleId":roleid,
           "ModuleId":"60",
           "ViewPermission":1,
           "EditPermission":1,
           "DeletePermission":1,
           "AddPermission":1,
           "OrganizationId":id,
           "LastModifiedDate":date,
           "CreatedDate":date
        }
      ]

      const insert_permission = await Database.table('UserPermission').insert(permission_array);

      let shift = 0;
      let desg = 0;
      let dept = 0;

      let fetchshift = await Database.query().from('ShiftMaster').select('Id').where('OrganizationId',id).orderBy('Id','asc').limit(1);
      if(fetchshift.length > 0){
          shift = fetchshift[0].Id;
      }

      let fetchdept = await Database.query().from('DepartmentMaster').select('Id').where('OrganizationId',id).orderBy('Id','asc').limit(1);
      if(fetchdept.length > 0){
          dept = fetchdept[0].Id;
      }

      let fetchdesg = await Database.query().from('DesignationMaster').select('Id').where('OrganizationId',id).orderBy('Id','asc').limit(1);
      if(fetchdesg.length > 0){
         desg = fetchdesg[0].Id;
      }

      let insert_EmployeeMaster = await Database.table('EmployeeMaster').insert({FirstName:username,doj:'0000-00-00',countrycode:countrycode,PersonalNo:phone,Shift:shift,OrganizationId:id,Department:dept,Designation:desg,CompanyEmail:email}).returning('Id');
      let Emp_id = insert_EmployeeMaster[0].Id;
      result['empid'] = Emp_id;
      
      if(insert_EmployeeMaster.length > 0)
      {
         
         const insert_UserMaster = await Database.table('UserMaster').insert({EmployeeId:Emp_id,appSuperviserSts:1,AuthorizationAppleID:appleAuthId,Password:Password,Username:username,OrganizationId:id,CreatedDate:start_date,LastModifiedDate:date,username_mobile:phone,archive:1,HRSts:1,Password_sts:1})

         for(let i=0; i<8; i++)
         {
           const query = await Database.table('ShiftMasterChild').insert({ShiftId:shift,Day:i,WeekOff:'0,0,0,0,0',OrganizationId:id,ModifiedBy:Emp_id,ModifiedDate:date})
           result['ord_id'] = id;

         }


      }

      let referrerId = 0;
      let referringOrg = 0;
      let referrencedOrg = id;
      let currentReferrerDiscount=0;
      let currentReferenceDiscount=0;
      let currentReferrerDiscountType=2;
      let currentReferenceDiscountType=2;
      let validFrom = "00:00:00";
      let validTo = "00:00:00";
      let referrerDiscountValidUpTo = "0000-00-00";

      const query = await Database.query().from('OrganizationTemp').select('*').where('id',id);

      if(query.length > 0){
         
        referrerId = query[0].referrerId;
        // referringOrg = getOrgIdByEmpId(referrerId)
        currentReferrerDiscount = query[0].referrerAmt;
        currentReferenceDiscount = query[0].referrenceAmt;
        validFrom = query[0].ReferralValidFrom;
        validTo = query[0].ReferralValidTo;
      }

      const fetchquery2 = await Database.query().from('licence_ubiattendance').select('*').where('OrganizationId',referringOrg);
      if(fetchquery2.length > 0){

        let end_date2 = fetchquery2[0].end_date
        let a = moment(end_date2)
        let b = moment.duration(1, 'months');
        referrerDiscountValidUpTo = a.add(b).format('YY-MM-DD')
      }

      if(referrerId != 0 && id != 0){
        validFrom = query[0].ReferralValidFrom;
        const queryref = await Database.table('Referrals').insert({ReferrerId:referrerId,ReferringOrg:referringOrg,ReferenceId:Emp_id,ReferrencedOrg:referrencedOrg,DiscountForReferrer:currentReferrerDiscount,DiscountForReferrence: currentReferenceDiscount,ReferrerDiscountType:currentReferrerDiscountType,ReferenceDiscountType:currentReferenceDiscountType,DiscountType:2,ValidFrom:validFrom,ValidTo:validTo,ReferrerDiscountValidUpTo:referrerDiscountValidUpTo,ReferrenceDate:date})
      }
      result['sts'] = true;

    }else{
      result['sts'] = 0;
    }

    return result
    
  }
}
