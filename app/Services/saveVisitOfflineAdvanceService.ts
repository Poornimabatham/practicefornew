import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import { DateTime } from "luxon";
export default class saveVisitOfflineAdvanceService {
  public static async saveVisitOfflineAdvance(data) {
    var OrganizationId = data.OrganizationId;
    var GeofenceStatusVisitOut=data.GeofenceStatusVisitOut
    var GeofenceStatusVisitIn= data.GeofenceStatusVisitIn
    var EmployeeId = data.EmployeeId;
    var IsVisitInSynced = 1;
    var IsVisitOutSynced = 1;
    var VisitInImageName;
    var VisitInImageBase64;
    var ThumbnailVisitInImageName = "111111114";
    var VisitInLocation;
    var LatitudeIn;
    var LongitudeIn;
    var VisitInTime;
    var VisitDate;
    var ClientName;
    var ClientId;
    var FakeLocationInStatus;
    var VisitOutTime;
    var Id;
    var ThumbnailVisitOutImageName = "111111114";
    var VisitOutImageName;
    var searchString = "public";
    var LatitudeOut;
    var VisitOutImageBase64;
    var insertInChekin_Master;
    var UpdateCheckin_Master;
    var lastVisitSyncedId;
    var VisitOutLocation;
    var LongitudeOut;
    var FakeLocationOutStatus;
    var Description;
    var res: any = [];
    var statusArray = {};
    var AddOnSts = await Helper.getAddonPermission(
      OrganizationId,
      "Addon_advancevisit"
    );
    if (AddOnSts == 0) {
      GeofenceStatusVisitOut = 2;
      GeofenceStatusVisitIn = 2;
    }
    var zone = await Helper.getEmpTimeZone(EmployeeId, OrganizationId);
    const defaultZone = DateTime.now().setZone(zone);

    const time =
      defaultZone.toFormat("HH:mm:ss") == "00:00:00"
        ? "23:59:00"
        : defaultZone.toFormat("HH:mm:ss");
    const stamp = defaultZone.toFormat("yyyy-MM-dd HH:mm:ss");
    const today = defaultZone.toFormat("yyyy-MM-dd");

    // console.log(`Time: {time}`);
    // console.log(`Stamp: {stamp}`);
    // console.log(`Today: {today}`);
    if (IsVisitInSynced == 1 && IsVisitOutSynced != 1) {
      if (ThumbnailVisitInImageName.includes(searchString)) {
        VisitInImageName = ThumbnailVisitInImageName;
      } else {
        VisitInImageName =
          "visits/" +
          OrganizationId +
          "/" +
          EmployeeId +
          "/" +
          ThumbnailVisitInImageName;
      }

      if (VisitInImageBase64 == undefined) {
        VisitInImageName = "https://ubitech.ubihrm.com/public/avatars/male.png";
      }

      const selectCheckin_Master = await Database.from("checkin_master")
        .select("time_out")
        .where("EmployeeId", EmployeeId)
        .andWhere("time_out", "00:00:00")
        .andWhere("time", "!=", "00:00:00")
        .andWhere("OrganizationId", OrganizationId)
        .andWhere("date", today);
      if (selectCheckin_Master.length) {
        console.log("affected_rows");
        UpdateCheckin_Master = await Database.from("checkin_master")
          .where("EmployeeId", EmployeeId)
          .andWhere("OrganizationId", OrganizationId)
          .andWhere("time_out", "00:00:00")
          .update({
            description: "Visit out not punched",
            location_out: "location",
            latit_out: "latit",
            longi_out: "longi",
            time_out: "time",
            checkout_img: "",
            skipped: 1,
          });
      }

      insertInChekin_Master = await Database.insertQuery()
        .table("checkin_master")
        .insert({
          EmployeeId: EmployeeId,
          location: VisitInLocation,
          latit: LatitudeIn,
          longi: LongitudeIn,
          time: VisitInTime,
          date: VisitDate,
          client_name: ClientName,
          ClientId: ClientId,
          OrganizationId: OrganizationId,
          checkin_img: VisitInImageName,
          FakeLocationStatusVisitIn: FakeLocationInStatus,
          GeofenceStatusVisitIn: GeofenceStatusVisitIn,
        });
      statusArray["Id"] = Id;
      statusArray["VisitInTime"] = VisitInTime;
      statusArray["VisitOutTime"] = VisitOutTime;
      statusArray["VisitDate"] = VisitDate;
      statusArray["Action"] = "VisitIn";
      statusArray["EmployeeId"] = EmployeeId;
      statusArray["OrganizationId"] = OrganizationId;
      res.push(statusArray);
    } else if (IsVisitInSynced == 1 && IsVisitOutSynced == 1) {
      if (ThumbnailVisitInImageName.includes(searchString)) {
        // The string contains 'public'
        console.log('String contains "public"');
        VisitInImageName = ThumbnailVisitInImageName;
      } else {
        VisitInImageName =
          "visits/" +
          OrganizationId +
          "/" +
          EmployeeId +
          "/" +
          ThumbnailVisitInImageName;
      }
      if (VisitInImageBase64 == undefined) {
        VisitInImageName = "https://ubitech.ubihrm.com/public/avatars/male.png";
      }
      if (ThumbnailVisitOutImageName.includes(searchString)) {
        VisitOutImageName = ThumbnailVisitOutImageName;
      } else {
        VisitOutImageName =
          "visits/" +
          OrganizationId +
          "/" +
          EmployeeId +
          "/" +
          ThumbnailVisitOutImageName;
      }
      if (VisitOutImageBase64 == undefined) {
        VisitOutImageName =
          "https://ubitech.ubihrm.com/public/avatars/male.png";
      }
      insertInChekin_Master = await Database.insertQuery()
        .table("checkin_master")
        .insert({
          EmployeeId: EmployeeId,
          location: VisitInLocation,
          location_out: VisitOutLocation,
          latit: LatitudeIn,
          longi: LongitudeIn,
          latit_out: LatitudeOut,
          longi_out: LongitudeOut,
          time: VisitInTime,
          time_out: VisitOutTime,
          date: VisitDate,
          client_name: ClientName,
          ClientId: ClientId,
          OrganizationId: OrganizationId,
          checkin_img: VisitInImageName,
          checkout_img: VisitOutImageName,
          FakeLocationStatusVisitIn: FakeLocationInStatus,
          FakeLocationStatusVisitOut: FakeLocationOutStatus,
          GeofenceStatusVisitIn: GeofenceStatusVisitIn,
          GeofenceStatusVisitOut: GeofenceStatusVisitOut,
        });
      statusArray["Id"] = Id;
      statusArray["VisitInTime"] = VisitInTime;
      statusArray["VisitOutTime"] = VisitOutTime;
      statusArray["VisitDate"] = VisitDate;
      statusArray["Action"] = "Both";
      statusArray["EmployeeId"] = EmployeeId;
      statusArray["OrganizationId"] = OrganizationId;
      res.push(statusArray);
    } else if (IsVisitInSynced != 1 && IsVisitOutSynced == 1) {
      if (ThumbnailVisitOutImageName.includes("public")) {
        VisitOutImageName = ThumbnailVisitOutImageName;
      } else {
        VisitOutImageName = `visits/{OrganizationId}/{EmployeeId}/{ThumbnailVisitOutImageName}`;
      }

      if (VisitOutImageBase64 == undefined) {
        VisitOutImageName =
          "https://ubitech.ubihrm.com/public/avatars/male.png";
      }
      var queryVID: any = await Database.from("checkin_master")
        .select(Database.raw("MAX(`id`) as `VisitId`"))
        .where("EmployeeId", EmployeeId)
        .where("OrganizationId", OrganizationId)
        .where("date", today)
        .orderBy("id", "desc")
        .limit(1);
      if (queryVID.length > 0) {
        lastVisitSyncedId = queryVID.VisitId;
      }
      UpdateCheckin_Master = await Database.from("checkin_master")
        .where("id", lastVisitSyncedId)
        .andWhere("OrganizationId", OrganizationId)
        .update({
          location_out: VisitOutLocation,
          latit_out: LatitudeOut,
          longi_out: LongitudeOut,
          time_out: VisitOutTime,

          checkout_img: VisitOutImageName,
          FakeLocationStatusVisitOut: FakeLocationOutStatus,

          description: Description,
          GeofenceStatusVisitOut: GeofenceStatusVisitOut,
        });

      statusArray["Id"] = Id;
      statusArray["VisitInTime"] = VisitInTime;
      statusArray["VisitOutTime"] = VisitOutTime;
      statusArray["VisitDate"] = VisitDate;
      statusArray["Action"] = "VisitOut";
      statusArray["EmployeeId"] = EmployeeId;
      statusArray["OrganizationId"] = OrganizationId;
      res.push(statusArray);
    }

    return res;
  }
}


