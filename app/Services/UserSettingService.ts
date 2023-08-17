import Database from "@ioc:Adonis/Lucid/Database";
import helper from '../Helper/Helper'
import Helper from "../Helper/Helper";
import { DateTime } from "luxon";


export default class Usersettingservice{
  constructor(){}

  static async changepassword(data){
    const orgid = data.uid;
    const empid = data.empid;
    const cpassword = await helper.encode5t(data.cpassword);
    const npass = await helper.encode5t(data.npassword);
    const rptpass  = await helper.encode5t(data.rtpassword);
    const res: any[] = [];
    const res1= {};
    let data1:any;

     const query = await Database.query().from('UserMaster').select('*').where('EmployeeId',empid).andWhere('OrganizationId',orgid).andWhere('Password',cpassword);
      if(query.length == 1){
        query.forEach(async function(row){
          var data = {};
          data['sts'] = row.appSuperviserSts;
          res.push(data);
       })
          data1 = res[0].sts;
      }
      else
      {
         if(cpassword == npass){
           res1['status'] = 3;
         }else{
          res1['status'] = "password has been  changed"
         }
       }
     
      if(query.length == 1)
      {
          if(npass == rptpass)
          {
              const qur = await Database.from('UserMaster').where('EmployeeId',empid).andWhere('OrganizationId',orgid).update({Password:rptpass,Password_sts:1});
              res1['status']=qur;
              res1['message']="Changed Password";
              if(data1 == 1)
              {
                  const qur1 = await Database.from('admin_login').where('OrganizationId',orgid).update({password:rptpass,changepasswordStatus:1});
                  res1['status'] = qur1;
                  res1['message']="Changed Password";
              }
            }
        }
      return res1;

  }


  // static async UpdateProfilePhoto(data){
  //    const Emplid = data.empid;
  //    const orgid = data.orgid;
  //    var new_name = Emplid + "jpg";
  //    var filePath = data.file; 
     
   
  //    }


    static async getPunchInfoCsv(data)
    {
       const Empid       = data.Empid;
       const Orgid       = data.Orgid;                                       /////write function getEmpTimeZone
       const csv         = data.Csv;
       const today       = data.Date;
       const loginEmp    = data.loginEmp;
       const currentPage = data.currentPage;
       const perpage     = data.perpage;
       const begin       = (currentPage-1)*perpage;
       const adminstatus = await Helper.getAdminStatus(loginEmp);
       const res:any[]   = [];

       let date = new Date(today)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      const new_date = `${year}-${month}-${day}`; 

       if(Empid != 0){
            var query = Database.query().from('checkin_master').select('Id','EmployeeId','location','location_out','time','time_out',Database.raw(`SUBSTRING_INDEX(checkin_img, '.com/', -1) as checkin_img`),Database.raw(`SUBSTRING_INDEX(checkout_img, '.com/', -1) as checkout_img`),'client_name','description','latit','longi','latit_out','longi_out').where('OrganizationId',Orgid).andWhere('EmployeeId',Empid).andWhere('date',new_date).andWhereIn('EmployeeId',Database.raw(`SELECT Id from EmployeeMaster where OrganizationId = ${Orgid} AND Is_Delete = 0`)).orderBy("Id","asc").limit(perpage).offset(begin);  
          
        }else{
            var query = Database.query().from('checkin_master').select('Id','EmployeeId','location','location_out','time','time_out',Database.raw(`SUBSTRING_INDEX(checkin_img, '.com/', -1) as checkin_img`),Database.raw(`SUBSTRING_INDEX(checkout_img, '.com/', -1) as checkout_img`),'client_name','description','latit','longi','latit_out','longi_out').where('OrganizationId',Orgid).andWhere('EmployeeId',Empid).andWhere('date',new_date).andWhereIn('EmployeeId',Database.raw(`SELECT Id from EmployeeMaster where OrganizationId = ${Orgid} AND Is_Delete = 0`)).orderBy("Id","asc").limit(perpage).offset(begin);
        }

        if(adminstatus == 2){
          var dptid = await Helper.getDepartmentIdByEmpID(loginEmp);
          query = query.andWhere("Department",dptid) ;
        }
         
         var querydata = await query
          
          querydata.forEach((row) => {
           
          const data: any    = {};
          data['Id']         = row.Id;
          data['Employeeid'] = row.EmployeeId;
          data['Emp_Name']   = Helper.getempnameById(row.EmployeeId);
          data['loc_in']     = row.location;
          data['loc_out']    = row.location_out;
          data['timein']     = row.time;
          data['timeout']    = row.time_out;
          data['latit']      = row.latit;
          data['logit']      = row.longi;
          data['latit_in']   = row.latit_out;
          data['longi_out']  = row.longi_out;
          data['client']     = row.client_name;
          data['description']= row.description;

          if(row.checkin_img != "")
          {
            data['checkin_img'] = row.checkin_img;                      /////write aws function getPresignedURL
          }else{
            data['checkin_img'] = "";
          }
          if(row.checkout_img ! = "")
          {
            data['checout_img'] = row.checkout_img;
          }else{
            data['checout_img'] = "";
          }
         
           res.push(data);
        })
         
           return res;
    }
    
    
    static async getPunchInfo(data){

      const Empid        = data.Empid;
      const Orgid        = data.Orgid;
      const csv          = data.Csv;
      const today        = data.Date;
      const loginEmp     = data.loginEmp;
      const currentPage  = data.currentPage;                              /////write function getEmpTimeZone
      const perpage      = data.perpage;
      const begin        = (currentPage-1)*perpage;  
      const adminstatus  = await Helper.getAdminStatus(Empid);
      const res:any[]    = [];

      let date = new Date(today)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      const new_date = `${year}-${month}-${day}`;  
    
  
      if(Empid != 0){
           var query =  Database.query().from('checkin_master').select('Id','EmployeeId','location','location_out','time','time_out',Database.raw(`SUBSTRING_INDEX(checkin_img, '.com/', -1) as checkin_img`),Database.raw(`SUBSTRING_INDEX(checkout_img, '.com/', -1) as checkout_img`),'client_name','description','latit','longi','latit_out','longi_out','GeofenceStatusVisitIn','GeofenceStatusVisitOut').where('OrganizationId',Orgid).andWhere('EmployeeId',Empid).andWhere('date',new_date).andWhereIn('EmployeeId',Database.raw(`SELECT Id from EmployeeMaster where OrganizationId = ${Orgid} AND Is_Delete = 0`)).orderBy("Id","asc");     
        }
      else{
           var query = Database.query().from('checkin_master').select('Id','EmployeeId','location','location_out','time','time_out',Database.raw(`SUBSTRING_INDEX(checkin_img, '.com/', -1) as checkin_img`),Database.raw(`SUBSTRING_INDEX(checkout_img, '.com/', -1) as checkout_img`),'client_name','description','latit','longi','latit_out','longi_out','GeofenceStatusVisitIn','GeofenceStatusVisitOut').where('OrganizationId',Orgid).andWhere('EmployeeId',Empid).andWhere('date',new_date).andWhereIn('EmployeeId',Database.raw(`SELECT Id from EmployeeMaster where OrganizationId = ${Orgid} AND Is_Delete = 0`)).orderBy("Id","asc").limit(perpage).offset(begin);
         }     
          
        if(adminstatus == 2){
          var dptid = await Helper.getDepartmentIdByEmpID(Empid);
          query = query.andWhere("Department",dptid) ;
        }
        
         var querydata = await query;
         
         querydata.forEach((row) => {
          
         const data: any = {};
         data['Id']         = row.Id;
         data['Employeeid'] = row.EmployeeId;
         data['Emp_Name']   = Helper.getempnameById(row.EmployeeId);
         data['loc_in']     = row.location;
         data['loc_out']    = row.location_out;
         data['timein']     = row.time;
         data['timeout']    = row.time_out;
         data['latit']      = row.latit;
         data['logit']      = row.longi;
         data['latit_in']   = row.latit_out;
         data['longi_out']  = row.longi_out;
         data['client']     = row.client_name;
         data['description']= row.description;
         data['GeofenceStatusVisitIn']=row.GeofenceStatusVisitIn;
         data['GeofenceStatusVisitOut']=row.GeofenceStatusVisitOut;

         if(row.checkin_img != "")
         {
           data['checkin_img'] = row.checkin_img;                      /////write aws function getPresignedURL
         }else{
           data['checkin_img'] = "";
         }
         if(row.checkout_img != "")
         {
           data['checout_img'] = row.checkout_img;
         }else{
           data['checout_img'] = "";
         }
        
          res.push(data);
       })
        
          return res;

    }

    static async getEmployeesList(data){

      const Empid = data.Empid;
      const Orgid = data.Orgid;
      const adminstatus = await Helper.getAdminStatus(Empid);
      const res:any[] = [];

     var query = Database.query().from('EmployeeMaster').select('Id','FirstName','EmployeeCode','NotificationStatus',Database.raw(`CONCAT(FirstName, ' ', lastname) as Name`)).where('archive', 1).andWhere('is_Delete',0).andWhere('OrganizationId',Orgid).orderBy("FirstName","asc");

     if(adminstatus == 2)
     {
        var dptid = await Helper.getDepartmentIdByEmpID(Empid);
        query = query.andWhere("Department",dptid)
     }

    var getquerydata = await query
    getquerydata.forEach((row) => {
          const data: any = {};
          data['Id'] = row.Id;
          data['name'] = row.Name;
          if(row.NotificationStatus == 1){
            data['sts'] = true;
          }else{
            data['sts'] =false;
          }
          if(row.EmployeeCode != "" || row.EmployeeCode != null){
            data['ecode'] = row.EmployeeCode;
          }else{
            data['ecode'] = "-";
          }

          res.push(data);

      })
     
          return res;
    }

   
    static async getOrgCheck(data)
    {

       const Orgid = data.Orgid;
       let status = false;
       const result:any[] = [];

       const querydata = await Database.query().from('NotificationStatus').select('*').where('OrganizationId',Orgid);

       querydata.forEach((row) => {
            const data: any           = {};
            data['Visit']             = row.Visit;
            data['OutsideGeofence']   = row.OutsideGeofence;
            data['FakeLocation']      = row.FakeLocation;
            data['FaceIdReg']         = row.FaceIdReg;
            data['FaceIdDisapproved'] = row.FaceIdDisapproved;
            data['SuspiciousSelfie']  = row.SuspiciousSelfie;
            data['SuspiciousDevice']  = row.SuspiciousDevice;
            data['DisapprovedAtt']    = row.DisapprovedAtt;
            data['AttEdited']         = row.AttEdited;
            data['TimeOffStart']      = row.TimeOffStart;
            data['TimeOffEnd']        = row.TimeOffEnd;
            data['OrganizationId']    = row.OrganizationId;
            data['BasicLeave']        = row.BasicLeave;
            data['status']            = true;

            result.push(data);
       })
            return result;
    }

    static async NotificationTest(data){

      const Columnname = data.ColumnName;
      const value      = data.Value;
      const orgid      = data.OrgId;
      var Data ;

      const result:any = {}

      if(Columnname == 'TimeOffStart'){
          Data = 0
      }else{
          Data = 1;
      }

      if(Data == 0){
        
        var query = await Database.query().from('NotificationStatus').where('OrganizationId',orgid).
        update(`${Columnname}`, value).update(`TimeOffEnd`,value);
        result['status'] = 1;

      }else{
        var query = await Database.query().from('NotificationStatus').where('OrganizationId',orgid).
        update(`${Columnname}`, value);
        
        if(query.length > 0){
           result['status'] = 2;
        }else{
           result['status'] = "No Update";
        }
        
      }
         return result;

    }

    static async UpdateNotificationStatus(data){

      const orgid   = data.orgid;
      const status  = data.status;
      const empid   = data.empid;
      const res:any = {};

      const query = await Database.query().from('EmployeeMaster').where('Id',empid).andWhere('OrganizationId',orgid).update({NotificationStatus:status});

      if(query.length > 0){
         if(status == 0){
           res['status'] = false
         }else{
           res['status'] = true
         }

          return res;

      }else{
          res['status'] = 'No Update';
          return res;
      }
    
    }

    static async setQrKioskPin(data){
      const orgId      = data.orgId;
      const empId      = data.empId;
      const Qr         = data.qRKioskPin;
      const result:any = {};

      const query = await Database.query().from('UserMaster').select('*').where('EmployeeId',empId).andWhere('OrganizationId',orgId);

      if(query.length > 0){
         
          const query2 = await Database.query().from('UserMaster').where('EmployeeId',empId).andWhere('OrganizationId',orgId).update({ kioskPin:Qr});
          result['response'] = 1;
      }else{
          result['response'] = 0;
      }
        return result;
    }

}