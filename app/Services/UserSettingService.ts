import Database from "@ioc:Adonis/Lucid/Database";
import helper from '../Helper/Helper'
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

     const query = await Database.query().from('UserMaster').select('*').where('EmployeeId',empid)
     .andWhere('OrganizationId',orgid)
        .andWhere('Password',cpassword)
        //  return query
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
        console.log('ashi')
          if(npass == rptpass)
          {
            console.log('mini')
              const qur = await Database.from('UserMaster').where('EmployeeId',empid).andWhere('OrganizationId',orgid).update({Password:rptpass,Password_sts:1});
              res1['status']=qur;
              if(data1 == 1)
              {
                  const qur1 = await Database.from('admin_login').where('OrganizationId',orgid).update({password:rptpass,changepasswordStatus:1});
                  res1['status'] = qur1;
              }
            }
        }
      return res1;

  }

  

}