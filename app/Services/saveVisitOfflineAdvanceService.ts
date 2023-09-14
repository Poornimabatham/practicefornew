import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import { DateTime } from "luxon";
import moment from "moment";
const querystring = require("querystring");
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
      statusArray["VisitDate"] = date;
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
      statusArray["VisitDate"] = date;
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
      statusArray["VisitDate"] = date;
      statusArray["Action"] = "VisitOut";
      statusArray["EmployeeId"] = EmployeeId;
      statusArray["OrganizationId"] = OrganizationId;
      res.push(statusArray);
    }

    return res;
  }

  public static async checkLoginWithSyncAttQr(Data) {
    const jsonString = Data.data; // Replace with your JSON string

    const jsonWithoutSpaces = jsonString.replace(/\s/g, "");

    // Parse the modified JSON string into an object
    const jsonObject = JSON.parse(jsonWithoutSpaces);

    const arrayLength = jsonObject[0]["2023-06-02"]["interim"].length;

    const today = DateTime.now().toFormat("yyyy-MM-dd");
    var stamp = DateTime.now().toFormat("HH:mm:ss");
    let date = "";
    const previousDay = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    let EmployeeRecord = "";

    let Dept_id = "";
    let Desg_id = "";
    let areaId = "";
    let HourlyRateId = "";
    let OwnerId = "";
    // let attendanceMasterId = 0;
    let interimAttendanceId = 0;
    let attTimeIn = "";
    let attTimeOut = "";
    let statusArray = [];
    let k = 0;
    let profileimage = "";
    let persongroup_id = "";
    let flag = "0";
    let suspiciousdevice = 0;
    let ssdisapp_sts = 1;
    let FaceRecognitionThrashhold = "";
    let FaceRecognitionRestriction = 0;
    let attendance_sts = 1;
    let suspicioustimein_status = "0";
    let suspicioustimeout_status = "0";
    let timein_confidence = "";
    let timeout_confidence = "";
    let faceid = "";
    let loggedHoursAtt = "";
    let faceidin = "";
    let faceidout = "";
    let profileimagein = "";
    let profileimageout = "";
    ssdisapp_sts = 1;
    let EmployeeName = "";
    let shiftType = "";
    let halfDayStatus = "";
    for (var i = 0; i < arrayLength; i++) {
      const keys = Object.keys(jsonObject[i]);
      console.log(keys);

      if (jsonObject[i][keys[0]].hasOwnProperty("interim")) {
        console.log(jsonObject[i][keys[0]]["interim"].length);
        for (let j = 0; j < jsonObject[i][keys[0]]["interim"].length; j++) {
          let interimAttendanceId = 0;
          MultipletimeStatus = 0;

          var MultipletimeStatus = 0;

          var FakeLocationInStatus = 0;
          var FakeLocationOutStatus = 0;
          var TimeInApp = "";
          var TimeOutApp = "";
          var TimeInStampApp = "";
          var TimeOutStampApp = "";
          var TimeInRemark = "";
          var TimeOutRemark = "";
          var TimeInDeviceId = "";
          var TimeOutDeviceId = "";
          var TimeInDeviceName = "";
          var TimeOutDeviceName = "";

          var orgTopic = "";
          const user = (jsonObject[i][keys[0]].interim[j].userName !== undefined) ? jsonObject[i][keys[0]].interim[j].userName : 0;
var userName = await Helper.encode5t(user)

const userId = jsonObject[i][keys[0]].interim[j].UserId || "";
const userNameByshakir = jsonObject[i][keys[0]].interim[j].userName || 0;
const OrganizationId = jsonObject[i][keys[0]].interim[j].OrgId || 0;

const AttendanceDate = jsonObject[i][keys[0]].interim[j].AttendanceDateInOut || '';
const TimeOutPictureBase64 = jsonObject[i][keys[0]].interim[j].TimeInOutBase64 || '';
const TimeInPictureBase64 = jsonObject[i][keys[0]].interim[j].TimeInOutBase64 || '';
const SyncTimeIn = jsonObject[i][keys[0]].interim[j].IsTimeInOutSynced || '';
const SyncTimeOut = jsonObject[i][keys[0]].interim[j].IsTimeInOutSynced || '';
const LatitudeIn = jsonObject[i][keys[0]].interim[j].LattitudeInOut || 0;
const LongitudeIn = jsonObject[i][keys[0]].interim[j].LongiTudeInOut || 0;
const LatitudeOut = jsonObject[i][keys[0]].interim[j].LattitudeInOut || 0;
const LongitudeOut = jsonObject[i][keys[0]].interim[j].LongiTudeInOut || 0;
const TimeInTime = jsonObject[i][keys[0]].interim[j].TimeInOutTime || '';
const TimeOutTime = jsonObject[i][keys[0]].interim[j].TimeInOutTime || '';
const GeofenceIn = jsonObject[i][keys[0]].interim[j].GeofenceInOut || '';
const GeofenceOut = jsonObject[i][keys[0]].interim[j].GeofenceInOut || '';
const TimeInDevice = jsonObject[i][keys[0]].interim[j].TimeInOutDevice || '';
const TimeOutDevice = jsonObject[i][keys[0]].interim[j].TimeInOutDevice || '';
const TimeInCity = jsonObject[i][keys[0]].interim[j].TimeInOutCity || '';
const TimeOutCity = jsonObject[i][keys[0]].interim[j].TimeInOutCity || '';
const TimeInDate = jsonObject[i][keys[0]].interim[j].TimeInOutDate || '';
const TimeOutDate = jsonObject[i][keys[0]].interim[j].TimeInOutDate || '';
const TimeInAddress = jsonObject[i][keys[0]].interim[j].TimeInOutAddress || '';
const TimeOutAddress = jsonObject[i][keys[0]].interim[j].TimeInOutAddress || '';
const ThumnailTimeOutPictureBase64 = jsonObject[i][keys[0]].interim[j].TimeInOutImageName || '';
const ThumnailTimeInPictureBase64 = jsonObject[i][keys[0]].interim[j].TimeInOutImageName || '';

var TimeInAppVersion='';
var TimeOutAppVersion='';

var Platform='';

var new_name="https://ubitech.ubihrm.com/public/avatars/male.png";

var GeofenceInAreaId='';
var latitin=LatitudeIn+ "," +LongitudeIn;
console.log(orgTopic)

if(orgTopic=='' || orgTopic=='0' || orgTopic=='null'){
  var string = await Helper.getOrgName(OrganizationId)
  string = await Helper.FirstLettercapital(string)
  
  string = string.replace(/ /g, '-');

  // Removes characters that are not alphanumeric or hyphens
  string = string.replace(/[^A-Za-z0-9\-]/g, string)
 
  orgTopic=string +OrganizationId;

  const query = await Database.from('UserMaster')
    .select('*')
    .innerJoin('EmployeeMaster', 'UserMaster.EmployeeId', 'EmployeeMaster.id').andWhere("EmployeeMaster.OrganizationId","UserMaster.OrganizationId")
    .where('Username', userName)
  .orWhere('username_mobile', userName) 
    .andWhere("UserMaster.OrganizationId",OrganizationId)
    .andWhere("UserMaster.archive",1).andWhere(
    "EmployeeMaster.archive",1).andWhere("EmployeeMaster.Is_Delete",0)
    .andWhereNotIn("EmployeeMaster.OrganizationId", 
    [502,1074,138265,138263,138262,138261,138260,138259,138258,138257,138256,138255,138254,
    138253,135095])

   

var rows = query
if(query.length){
  if(query){
  var  UserId=rows[0].EmployeeId;
  var ShiftId=await Helper.getassignedShiftTimes(UserId,AttendanceDate);
  MultipletimeStatus=await Helper.getshiftmultipletime_sts(UserId,AttendanceDate,ShiftId);
  // var action=await Helper.AttendanceActQr($UserId,$OrganizationId,$shiftId,$shiftType,$MultipletimeStatus);
 var geofencePerm=await Helper.getNotificationPermission(OrganizationId,'OutsideGeofence');
  var SuspiciousSelfiePerm=await Helper.getNotificationPermission(OrganizationId,'SuspiciousSelfie');
  var SuspiciousDevicePerm=await Helper.getNotificationPermission(OrganizationId,'SuspiciousDevice');
  
  var zone = await Helper.getEmpTimeZone(UserId, OrganizationId);

  const defaultZone = DateTime.now().setZone(zone);

  const time =
    defaultZone.toFormat("HH:mm:ss") == "00:00:00"
      ? "23:59:00"
      : defaultZone.toFormat("HH:mm:ss");
  const stamp = defaultZone.toFormat("yyyy-MM-dd HH:mm:ss");
  const today = defaultZone.toFormat("yyyy-MM-dd");

  var name=await Helper.getEmpName(UserId);
var update  = await Database.from("AppliedLeave").where()
  }
}

}

        }
      }
    }
  }
}
