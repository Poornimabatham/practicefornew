import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import moment from "moment";
import { DateTime } from "luxon";
export default class TempAssignClientService {
  public static async TempAssignClient(data) {
    var id = data.uid;
    var cid = data.cid;
    var orgid = data.cid;
    var date = new Date();
    var res;
    const selectClientList = await Database.from("clientlist")
      .select("id")
      .where("employeeid", id)
      .andWhere("clientid", cid)
      .andWhere("OrganizationId", orgid)
      .andWhere("AssignStatus", 1);
    res = selectClientList.length;
    const data2 = {};

    if (res > 0) {
      data2["sts"] = "2"; // if row already exist
      //return $data;



    }
    var insertClientList = Database.table("clientlist").insert({
      employeeid: id,
      clientid: cid,
      organizationid: orgid,
      createddate: date,
      AssignStatus: 1,
    });
    var contactPersons: any = []; // Declare an array to store contact persons

    res = (await insertClientList).length;
    data2["sts"] = res
    var selectClientList2 = await Database.from("ClientMaster ")
      .where("Id", cid)
      .select("Name")
      
    var Name: any = selectClientList2;
    Name.forEach((val) => {
      let contactPerson = val.Name;
      contactPersons.push(contactPerson);
    });

    if (Name > 0) {
      const timezone = await Helper.getTimeZone(orgid);
      var defaulttimeZone = moment().tz(timezone).toDate();

      const dateTime = DateTime.fromJSDate(defaulttimeZone);
      const formattedDate = dateTime.toFormat("yy-MM-dd HH:mm:ss");
      var getempname = await Helper.getempnameById(id);

      var appModule = "Client";
      var module = "Attendance App";
      var actionPerformed = `Client <b>".${contactPersons}."</b> has been temporary assign to <b>".${getempname} .
        "</b> from <b> Attendance App  </b>`;
      var activityby = 1;
      const insertActivityHistoryMaster: any =
        await Helper.ActivityMasterInsert(
          formattedDate,
          orgid,
          id,
          activityby,
          appModule,
          actionPerformed,
          module
        );
    }
    return res;
  }
}
