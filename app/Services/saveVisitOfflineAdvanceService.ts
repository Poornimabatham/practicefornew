import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import { DateTime } from "luxon";
import moment from "moment";
export default class saveVisitOfflineAdvanceService {
  public static async saveVisitOfflineAdvance(data) {
   
    var OrganizationId = data.OrganizationId;
    var GeofenceStatusVisitOut = data.GeofenceStatusVisitOut;
    var GeofenceStatusVisitIn = data.GeofenceStatusVisitIn;
    var EmployeeId = data.EmployeeId;
    var IsVisitInSynced = data.IsVisitInSynced;
    var IsVisitOutSynced = data.IsVisitOutSynced;
    var VisitInImageName = data.VisitInImageName;
    var VisitInImageBase64 = data.VisitInImageBase64;
    var ThumbnailVisitInImageName = data.ThumbnailVisitInImageName;
    var VisitInLocation = data.VisitInLocation;
    var LatitudeIn = data.LatitudeIn;
    var LongitudeIn = data.LongitudeIn;
    var VisitInTime = data.VisitInTime;
    var VisitDate = data.VisitDate;
    var ClientName = data.ClientName;
    var ClientId = data.ClientId;
    var FakeLocationInStatus = data.FakeLocationInStatus;
    var VisitOutTime = data.VisitOutTime;
   
    var Id = data.Id;
    var ThumbnailVisitOutImageName = data.ThumbnailVisitOutImageName;
    var VisitOutImageName = data.VisitOutImageName;
    var LatitudeOut = data.LatitudeOut;
    var VisitOutImageBase64 = data.VisitOutImageBase64;
    var insertInChekin_Master;
    var UpdateCheckin_Master;
    var lastVisitSyncedId;
    var VisitOutLocation = data.VisitOutLocation;
    var LongitudeOut = data.LongitudeOut;
    var FakeLocationOutStatus = data.FakeLocationOutStatus;
    var Description = data.Description;
    var date = VisitDate.toFormat("yyyy-MM-dd");
    let date2;
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

    if (IsVisitInSynced == 1 && IsVisitOutSynced != 1) {
      if (ThumbnailVisitInImageName.includes("public")) {
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
      if (VisitInImageBase64 == undefined || VisitInImageBase64 == "null") {
        VisitInImageName = "https://ubitech.ubihrm.com/public/avatars/male.png";
      }

      const selectCheckin_Master = await Database.from("checkin_master")
        .select("time_out")
        .where("EmployeeId", EmployeeId)
        .andWhere("time_out", "00:00:00")
        .andWhere("time", "!=", "00:00:00")
        .andWhere("OrganizationId", OrganizationId);
      if (selectCheckin_Master.length) {
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
          date: date,
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
      statusArray["VisitDate"] =date
      statusArray["Action"] = "VisitIn";
      statusArray["EmployeeId"] = EmployeeId;
      statusArray["OrganizationId"] = OrganizationId;
      res.push(statusArray);
    } else if (IsVisitInSynced == 1 && IsVisitOutSynced == 1) {
      if (ThumbnailVisitInImageName.includes("public")) {
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
      if (VisitInImageBase64 == undefined || VisitInImageBase64 == "null") {
        VisitInImageName = "https://ubitech.ubihrm.com/public/avatars/male.png";
      }
      if (ThumbnailVisitOutImageName == undefined) {
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
      if (VisitOutImageBase64 == undefined || VisitOutImageBase64 == "null") {
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
          date: date,
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
      statusArray["VisitDate"] = date
      statusArray["Action"] = "Both";
      statusArray["EmployeeId"] = EmployeeId;
      statusArray["OrganizationId"] = OrganizationId;
      res.push(statusArray);
    } else if (IsVisitInSynced != 1 && IsVisitOutSynced == 1) {
      if (ThumbnailVisitOutImageName == undefined) {
      } else {
        if (ThumbnailVisitOutImageName.includes("public")) {
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
      }

      if (VisitOutImageBase64 == undefined) {
        VisitOutImageName =
          "https://ubitech.ubihrm.com/public/avatars/male.png";
      }

      var queryVID: any = await Database.from("checkin_master")
        .select(Database.raw("MAX(id) as VisitId"))
        .where("EmployeeId", EmployeeId)
        .andWhere("OrganizationId", OrganizationId)
        .andWhere("date", date)
        .orderBy("id", "desc")
        .limit(1);

      if (queryVID.length > 0) {
        lastVisitSyncedId = queryVID[0].VisitId;
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
      statusArray["VisitDate"] = date
      statusArray["Action"] = "VisitOut";
      statusArray["EmployeeId"] = EmployeeId;
      statusArray["OrganizationId"] = OrganizationId;
      res.push(statusArray);
    }

    return res;
  }
}
