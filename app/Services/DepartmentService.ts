import Database from "@ioc:Adonis/Lucid/Database";

export default class DepartmentService {

  public static async getdepartment(data) {

    interface department {
      Id: number,
      Name: string,
      OrganizationId: number,
      archive: number
    }

    const query = await Database.from('DepartmentMaster').select('Id', Database.raw(`if(LENGTH("Name") > 30, concat(SUBSTR("Name", 1, 30), '....'), Name) as Name ,'archive'`)).where('OrganizationId', data.OrganizationId).orderBy('Name');


    var res: any[] = [];

    query.forEach((row) => {
      const data: department = {
        Id: row.Id,
        Name: row.Name,
        OrganizationId: row.OrganizationId,
        archive: row.archive
      }
      res.push(data)
    });
    return res;

  }

  public static async addDept(data) {
    var currentdate = new Date();

    const query = await Database.from("DepartmentMaster")
      .where("Name", data.Name)
      .andWhere("OrganizationId", data.OrganizationId);

    if (query.length > 0) {
      return false;
    }
    const query1 = await Database.insertQuery()
      .table("DepartmentMaster")
      .insert({
        Name: data.Name,
        OrganizationId: data.OrganizationId,
        CreatedDate: currentdate,
        CreatedById: data.CreatedById,
        LastModifiedDate: currentdate,
        LastModifiedById: data.LastModifiedById,
        OwnerId: data.OwnerId,
        archive: data.archive,
      });
    // console.log(query1)
    return query1;
  }

  public static async updatedept(data)
   {
    var currentdate = new Date();
    const query = await Database.from("DepartmentMaster")
      .select("Id", "OrganizationId", "Name")
      .where("Id", data.Id)
      .andWhere("OrganizationId", data.OrganizationId)
      .andWhere("Name", data.Name);
    if (query.length > 0) {
      return false;
    }

    const query2 = await Database.query()
      .from("DepartmentMaster")
      .where("Id", data.Id)
      .update({
        Name: data.Name,
        LastModifiedDate: currentdate,
        LastModifiedById: data.LastModifiedById,
        archive: data.archive,
      });

    return query2;
  }
}
