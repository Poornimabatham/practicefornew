import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
export default class ClientsService {

  constructor() { }

  static async ClientData(a) {
    const OrgId: number = a.orgId;
    const EmpId: number = a.empId;
    const adminSts: number = await Helper.getAdminStatus(EmpId);

    let allClientList: any;

    if (adminSts == 1) {

      allClientList = await Database
        .from('ClientMaster as C')
        .join('CountryMaster as CM', 'C.Country', '=', 'CM.Id')
        .select("C.Id", "C.Company", "C.Name", "C.Contact", "C.Email", "C.Address", "C.City", "C.Country", "CM.Name as countryName", "CM.countrycode", "C.Description", "C.Lat_Long", "C.radius", "C.OrganizationId", "C.status", "C.createdBy", "C.ModifiedDate", "C.ModifiedById", "C.Platform ", "C.Lat_Long", "C.radius", Database.rawQuery('(SELECT FirstName FROM EmployeeMaster WHERE Id = (SELECT employeeid from clientlist WHERE clientlist.clientid=C.Id LIMIT 1) LIMIT 1) as EmployeeName'))
        .where("C.OrganizationId", OrgId)
        .andWhere(Database.rawQuery(`C.Country=SUBSTRING_INDEX(CM.Id , '+', -1)`))
        .andWhereIn('C.status', [1, 2, 0])

    }
    else {

      allClientList = await Database
        .from('ClientMaster as C')
        .select("C.Id", "C.Company", "C.Name", "C.Contact", "C.Email", "C.Address", "C.City", "C.Country", "C.Description", "C.Lat_Long", "C.radius", "C.OrganizationId", "C.status", "C.createdBy", "C.ModifiedDate", "C.ModifiedById", "C.Platform ", "C.Lat_Long", "C.radius",)
        .where("C.OrganizationId", OrgId)
        .andWhereIn('C.status', [1, 2, 0])
        .andWhereNot('Country', 0)
        .groupBy('C.Id')
        .havingRaw('(SELECT count(clientlist.id) as ids FROM clientlist WHERE clientlist.clientid = C.Id and clientlist.organizationid=C.OrganizationId)=0')

    }

    return allClientList
  }

  static async addClient(inclient) {
    const empId = inclient.empId;
    const orgId = inclient.orgId;
    const compName = inclient.compName;
    const name = inclient.name;
    const compAddress = inclient.compAddress;
    const city = inclient.city;
    const countryCode = inclient.countryCode;
    const phone = inclient.phone;
    const email = inclient.email;
    const description = inclient.description;
    const status = inclient.status;
    const platform = inclient.platform;
    const radius = inclient.radius;
    const Lat_Long = inclient.Lat_Long;
    let todayDate = new Date().toISOString().slice(0, 10);
    let ClientList: any;
    let sts: any;
    let insertClient: any;
    let insertClientList: any;

    ////////////validation phone///////////
    ClientList = await Database
      .from('ClientMaster as C')
      .select("C.Id", "C.Company", "C.Contact", "C.Email")
      .where("C.OrganizationId", orgId)
      .andWhere("C.Contact", phone)

    if (ClientList.length > 0) {
      sts = 'contactalreadyexists';
      return sts;
    }

    insertClient = await Database
      .table('ClientMaster')
      .returning('id')
      .insert({
        Company: compName,
        Name: name,
        Contact: phone,
        Email: email,
        Address: compAddress,
        City: city,
        Country: countryCode,
        Description: description,
        Lat_Long: Lat_Long,
        Radius: radius,
        OrganizationId: orgId,
        status: status,
        createdBy: empId,
        createdDate: todayDate,
        ModifiedById: empId,
        Platform: platform,
      })

    if (insertClient != '') {
      insertClientList = await Database
        .table('clientlist')
        .returning('id')
        .insert({
          employeeid: empId,
          clientid: insertClient,
          organizationid: orgId,
          createddate: todayDate,
          AssignStatus: 1,
        })
    }
    return "Client Succesfully Inserted"

  }

  ///////////////////add client function end //////////////////

  static async editClient(editclient) {
    const clientId: number = editclient.clientId;
    const empid: number = editclient.empId;
    const orgid: number = editclient.orgId;
    const compName: string = editclient.compName;
    const name: string = editclient.name;
    const address: string = editclient.compAddress;
    const city: string = editclient.city;
    const countryCode: number = editclient.countryCode;
    const phone: number = editclient.phone;
    const email: string = editclient.email;
    const description: string = editclient.description;
    const status: number = editclient.status;
    const platform: string = editclient.platform;
    const newLatLng: string = editclient.LatLong;
    let todayDate = new Date().toISOString().slice(0, 10);
    var ClientList: any;
    let sts: any;
    let affectedRows;

    ClientList = await Database
      .from('ClientMaster as C')
      .select("C.Id", "C.Company", "C.Contact", "C.Email")
      .where("C.OrganizationId", orgid)
      .andWhere("C.Id", clientId);

    if (ClientList.length > 0) {

      if (ClientList[0].Contact == phone) {
        sts = 'contactalreadyexists';
        return sts;
      }
      else if (ClientList[0].Company == compName) {
        sts = 'companynamealreadyexists';
        return sts;
      }
      else if (ClientList[0].Email == email) {
        sts = 'emailalreadyexists';
        return sts;
      }
      else {
        affectedRows = await Database
          .from('ClientMaster as C')
          .where('id', clientId)
          .andWhere("C.OrganizationId", orgid)
          .update({
            Company: compName,
            Name: name,
            Email: email,
            Contact: phone,
            Address: address,
            City: city,
            Country: countryCode,
            Description: description,
            ModifiedDate: todayDate,
            ModifiedById: empid,
            Platform: platform,
            Lat_Long: newLatLng
          });
        return affectedRows;

      }
    } else {
      return "Client does not exist on this Id";
    }

  }

  static async getClientList(clientdata) {
    const empid: number = clientdata.empId;
    const orgid: number = clientdata.orgId;
    const startwith: string = clientdata.startwith;
    let getClientList: any;

    if (startwith != undefined) {
      getClientList = await Database
        .from('ClientMaster as C')
        .innerJoin('clientlist as CL', 'CL.clientid', '=', 'C.Id')
        .innerJoin('EmployeeMaster as E', 'CL.employeeid', '=', 'E.Id')
        .select("C.Id", "C.Company", "C.Name", "C.Contact", "C.Email", "C.Address", "C.Description", "C.Lat_Long", "CL.employeeid", "E.area_assigned")
        .where("C.OrganizationId", orgid)
        .where("CL.employeeid", empid)
        .andWhereIn('C.status', [1, 2])
        .orderBy('CL.id', 'desc')
    }

    else {
      getClientList = await Database
        .from('ClientMaster as C')
        .innerJoin('clientlist as CL', 'CL.clientid', '=', 'C.Id')
        .innerJoin('EmployeeMaster as E', 'CL.employeeid', '=', 'E.Id')
        .select("C.Id", "C.Company", "C.Name", "C.Contact", "C.Email", "C.Address", "C.Description", "C.radius", "C.Lat_Long", "CL.employeeid", "E.area_assigned")
        .select(Database.raw("CONCAT(E.FirstName, ' ', E.LastName) as EmployeeName"))
        .where("C.OrganizationId", orgid)
        .where("CL.employeeid", empid)
        .andWhereIn('C.status', [1, 2])
        .andWhereIn('CL.AssignStatus', [0, 1])
        .orderBy('CL.id', 'desc')
        .limit(2)
    }

    return getClientList;

  }
}





