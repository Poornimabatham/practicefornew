import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
export default class ClientsService{

    constructor(){}

    static async ClientData(a)
    { 
      const OrgId:number = a.orgid;
      const EmpId:number = a.empid;
      const adminSts:number = await Helper.getAdminStatus(EmpId);
      return adminSts
      
      let allClientList:any;
      //return adminSts
      if(adminSts == 1)
      {
        //console.log('admin');
        allClientList = await Database
        .from('ClientMaster as C')
        .join('CountryMaster as CM', 'C.Country', '=', 'CM.Id')
        .select("C.Id", "C.Company", "C.Name", "C.Contact", "C.Email", "C.Address", "C.City", "C.Country", "CM.Name as countryName", "CM.countrycode", "C.Description", "C.Lat_Long", "C.radius", "C.OrganizationId", "C.status", "C.createdBy", "C.ModifiedDate", "C.ModifiedById", "C.Platform ", "C.Lat_Long", "C.radius", Database.rawQuery('(SELECT FirstName FROM EmployeeMaster WHERE Id = (SELECT employeeid from clientlist WHERE clientlist.clientid=C.Id LIMIT 1) LIMIT 1) as EmployeeName'))
        .where("C.OrganizationId",10)
        .andWhere(Database.rawQuery(`C.Country=SUBSTRING_INDEX(CM.Id , '+', -1)`))
        .andWhereIn('C.status',[1,2,0])
        
      }
      else{
        //console.log('user');
        allClientList= await Database
        .from('ClientMaster as C')
        .select("C.Id", "C.Company", "C.Name", "C.Contact", "C.Email", "C.Address", "C.City", "C.Country", "C.Description", "C.Lat_Long", "C.radius", "C.OrganizationId", "C.status", "C.createdBy", "C.ModifiedDate", "C.ModifiedById", "C.Platform ", "C.Lat_Long", "C.radius",)
        .where("C.OrganizationId",10)
        .andWhereIn('C.status',[1,2,0])
        .andWhereNot('Country',0)
        .groupBy('C.Id')
        .havingRaw('(SELECT count(clientlist.id) as ids FROM clientlist WHERE clientlist.clientid = C.Id and clientlist.organizationid=C.OrganizationId)=0')
 
      }

      return allClientList
      //const query:any =  await Database.query().from('C').select('*').limit(10)
      //return query
    }

    static async addClient(inclient)
    {
          const empid = inclient.empid;
          const orgid = inclient.orgid;
          const comp_name = inclient.comp_name;
          const name = inclient.name;
          const address = inclient.address;
          const country = inclient.country;
          const city = inclient.city;
          const countrycode = inclient.countrycode;
          const phone = inclient.phone;
          const email = inclient.email;
          const description = inclient.description;
          const status = inclient.status;
          const platform = inclient.platform;
          const radius= inclient.radius;
          const Lat_Long = inclient.Lat_Long;
          const empSts = inclient.empSts;//which permission user have
          let todayDate = new Date().toISOString().slice(0, 10);
          let ClientList:any;
          let sts:any;
          let insertClient:any;
          let insertClientList:any;

          const res:number = 0;
        ////////////validation phone///////////
          ClientList= await Database
          .from('ClientMaster as C')
          .select("C.Id", "C.Company", "C.Contact", "C.Email")
          .where("C.OrganizationId",10)
          .andWhere("C.Contact",7555950577);

          //return ClientList;
          if(ClientList[0]['Contact'] == phone){
              sts ='contactalreadyexists';
          }
          else
          {
             insertClient = await Database
              .table('ClientMaster')
              .returning('id')
              .insert({
                Company: comp_name,
                Name: name,
                Contact: phone,
                Email: email,
                Address: address,
                City: city,
                Country: country,
                Description: description,
                Lat_Long: Lat_Long,
                Radius: radius,
                OrganizationId: orgid,
                status: status,
                createdBy: empid,
                createdDate: todayDate,
                ModifiedById: empid,
                Platform: platform,
              }) 
              
              if(insertClient != '')
              {
                insertClientList = await Database
                .table('clientlist')
                .returning('id')
                .insert({
                  employeeid: empid,
                  clientid: insertClient,
                  organizationid: orgid,
                  createddate: todayDate,
                  AssignStatus: 1,
                  
                })
              }
          }
          //return sts;
    }

    ///////////////////add client function end //////////////////
    static async editClient(editclient)
    {
          const clientid:number = editclient.clientid;
          const empid:number = editclient.empid;
          const orgid:number = editclient.orgid;
          const comp_name:string = editclient.comp_name;
          const name:string = editclient.name;
          const address:string = editclient.address;
          const country:number = editclient.country;
          const city:string = editclient.city;
          const countrycode:number = editclient.countrycode;
          const phone:number = editclient.phone;
          const email:string = editclient.email;
          const description:string = editclient.description;
          const status:number = editclient.status;
          const platform:string = editclient.platform;
          const radius:string= editclient.radius;
          const Lat:string = editclient.newLat;
          const Long:string = editclient.newLong;
          const newLatLng:string = Lat.Long;
          const empSts:number = editclient.empSts;//which permission user have 
          let todayDate = new Date().toISOString().slice(0, 10);
          let ClientList:any;
          let sts:any;
          

          ClientList= await Database
          .from('ClientMaster as C')
          .select("C.Id", "C.Company", "C.Contact", "C.Email")
          .where("C.OrganizationId",orgid)
          .andWhereNot("C.Id",clientid);
          
          if(ClientList[0]['Contact'] == phone)
          {
             sts ='contactalreadyexists';
          }
          else if(ClientList[0]['Company'].toUpperCase( ) == comp_name.toUpperCase( ))
          {
             sts ='companynamealreadyexists';
          }
          else if(ClientList[0]['Email'] == email)
          {
             sts ='emailalreadyexists';
          }
          else
          {
            const affectedRows = await Database
            .from('ClientMaster')
            .where('id', clientid)
            .andWhere("C.OrganizationId",orgid)
            .update({ 
              Company:comp_name,
              Name:name,
              Email: email ,
              Contact:phone,
              Address:address,
              City:city,
              Country:country,
              Description:description,
              ModifiedDate:todayDate,
              ModifiedById:empid,
              Platform:platform,
              Lat_Long:newLatLng
            });
            
            return affectedRows;
          }

    }

    static async getClientList(clientdata)
    {
          const empid:number = clientdata.empid;
          const orgid:number = clientdata.orgdir;
          const startwith:string = clientdata.startwith;
          let getClientList:any;

          if(startwith != '')
          {
            getClientList = await Database
            .from('ClientMaster as C')
            .join('clientlist as CL', 'CL.clientid', '=', 'C.Id')
            .join('EmployeeMaster as E', 'CL.employeeid', '=', 'E.Id')
            .select("C.Id", "C.Company", "C.Name", "C.Contact", "C.Email", "C.Address",  "C.Description","C.Lat_Long", "CL.employeeid","E.area_assigned")
            .where("C.OrganizationId",orgid)
            .where("CL.employeeid",empid)
            .andWhereIn('C.status',[1,2])
            .orderBy('CL.id','desc')

            
          }
          else
          {

            getClientList = await Database
            .from('ClientMaster as C')
            .join('clientlist as CL', 'CL.clientid', '=', 'C.Id')
            .join('EmployeeMaster as E', 'CL.employeeid', '=', 'E.Id')
            .select("C.Id", "C.Company", "C.Name", "C.Contact", "C.Email", "C.Address",  "C.Description","C.radius","C.Lat_Long", "CL.employeeid","E.area_assigned")
            .select(Database.raw("CONCAT(E.FirstName, ' ', E.LastName) as EmployeeName"))
            .where("C.OrganizationId",orgid)
            .where("CL.employeeid",empid)
            .andWhereIn('C.status',[1,2])
            .andWhereIn('CL.AssignStatus',[0,1])
            .orderBy('CL.id','desc')
            
          }

          return getClientList;
        
    }
}

  



