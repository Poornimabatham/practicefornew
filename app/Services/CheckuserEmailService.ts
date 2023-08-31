import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";

export default class CheckUserEmailService {
  public static async CheckUserEmail(data) {
    var email = data.email;
    
    var result: any = {};
    var usermail = await Helper.encode5t( data.email);
    const checkquery = await Database.from("UserMaster")
      .where("Username", usermail)
      .limit(2);
    const num_rows = checkquery.length;
    if (num_rows > 0) {
      result["status"] = "1"; // already exist E-mail
    } else {
        
      result["status"] = "2"; // Not exist E-mail
    }
    return result;
  }


  public static async CheckUserPhone(data){
    var phone =data.phone
        var  result:any={}
        var userphone = await  Helper.encode5t(phone);  
        
        var selectOrganizationList = await Database.from("Organization").where("PhoneNumber",phone).select("Id as OId","Name as OName")
        
const Organization_num_rows = selectOrganizationList
        const selectUserMasterList = await Database.from("UserMaster")
        .innerJoin('EmployeeMaster as E', 'E.Id', 'U.EmployeeId').innerJoin('EmployeeMaster as E2', 'E2.organizationId', 'U.organizationId')
        .select(
          'U.username_mobile',
          Database.raw("CONCAT(E.FirstName, ' ', E.lastname) as Name"),
          'Password',
          'E.OrganizationId'
        )
        .from('UserMaster as U')
        .andWhere('U.username_mobile', userphone)

      var checkquery_num_row =selectUserMasterList;
      if(checkquery_num_row.length>0 || Organization_num_rows.length > 0 )
      {
        if (checkquery_num_row.length > 0) {
          console.log("op")
            result['name'] = checkquery_num_row[0].Name;
            result['password'] =await Helper.decode5t(checkquery_num_row[0].Password);
            var organizationId = checkquery_num_row[0].OrganizationId
            result['orgName'] =await Helper.getOrgName(organizationId);
            result['orgId'] = checkquery_num_row[0].OrganizationId;


        
          }
    
          if (Organization_num_rows.length > 0) {
            console.log("o")
            result['orgName'] = Organization_num_rows[0].Name;
            result['orgId'] = Organization_num_rows[0].Id;
          }
          
          
         result['status'] = '1'; 
      }
      else {
          result['status'] = '2';  
      }
return result
    }

  }

