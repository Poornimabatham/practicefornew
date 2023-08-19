import Database from "@ioc:Adonis/Lucid/Database";

export default class getgeofenceservice {
  public static async getgeofence(data) {
    let location: string;
    var begin: number = (data.currentpage - 1) * data.perpage;

    if (data.currentPage != 0 && data.pagename == "getgeofenceList") {
      var limit = data.perPage;
    }
    const query = await Database.from("Geo_Settings")
      .select("Id", "Name", "Location", "Status", "Lat_Long", "Radius")
      .where("OrganizationId", "=", data.OrganizationId)
      .limit(limit)
      .offset(begin);

    interface geofence {
      Id: number;
      Name: string;
      Location: string;
      Status: number;
      Lat_Long: string;
      Radius: number;
    }

    var res: any = [];

    query.forEach((row) => {
      if (row.Location != " ") {
        location = row.Location;
      } else {
        location = row.Name;
      }
      const data: geofence = {
        Id: row.Id,
        Name: row.Name,
        Location: location,
        Status: row.Status,
        Lat_Long: row.Lat_Long,
        Radius: row.Radius,
      };

      res.push(data);
    });

    return res;
  }

  public static async addgeofence(data) {
    var curdate = new Date();
    var archive = 1;
    var Status = 1;
    var result = {};

    const query = await Database.from("Geo_Settings")
      .select("Id")
      .where("Name", "=", data.Name)
      .andWhere("OrganizationId", "=", data.OrganizationId);

    if (query.length > 0) {
      result["status"] = "duplicate";
    } else {
      const query = await Database.insertQuery().table("Geo_Settings").insert({
        Name: data.Name,
        Lat_Long: data.Lat_Long,
        Location: data.Location,
        Radius: data.Radius,
        archive: archive,
        OrganizationId: data.OrganizationId,
        Status: Status,
        LastModifiedById: data.LastModifiedById,
        LastModifiedDate: curdate,
      });
      if (query.length > 0) {
        result["status"] = true;
      } else {
        result["status"] = false;
      }
    }

    return result;
  }
}
