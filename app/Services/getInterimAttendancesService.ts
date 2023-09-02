import Database from "@ioc:Adonis/Lucid/Database";
export default class GetInterimAttendancesService {
  public static async getInterimAttendances(data2) {
  
    var attendanceMasterId = data2.attendanceMasterId;
  
    const selectInterimAttenceslist: any = await Database.from(
      "InterimAttendances"
    )
      .select(
        "id",
        "TimeIn",
        "TimeInLocation",
        "LatitudeIn",
        "LongitudeIn",
        "TimeOut",
        "TimeOutLocation",
        "LatitudeOut",
        "LongitudeOut",
        "TimeInEditStatus",
        "TimeOutEditStatus",
        "AttendanceStatus",
        "Device",
        "TimeInIp",
        "TimeOutIp",
        "IsDelete",
        "FakeLocationStatusTimeIn",
        "FakeLocationStatusTimeOut",
        "Platform",
        "TimeInFaceId",
        "TimeOutFaceId",
        "SuspiciousTimeInStatus",
        "SuspiciousTimeOutStatus",
        "PersistedFaceTimeIn",
        "PersistedFaceTimeOut",
        "TimeInConfidence",
        "TimeOutConfidence",
        "TimeInDeviceId",
        "TimeOutDeviceId",
        "TimeInCity",
        "TimeOutCity",
        "TimeInAppVersion",
        "TimeOutAppVersion",
        "TimeInGeofence",
        "TimeOutGeofence",
        "AttendanceMasterId",
        "SuspiciousDeviceTimeInStatus",
        "SuspiciousDeviceTimeOutStatus",
        "TimeInDeviceName",
        "TimeOutDeviceName",
        "LoggedHours",
        "TimeInApp",
        "TimeOutApp",
        Database.raw(
          "SUBSTRING_INDEX(TimeInImage, '.com/', -1) AS TimeInImage"
        ),
        Database.raw(
          "SUBSTRING_INDEX(TimeOutImage, '.com/', -1) AS TimeOutImage"
        )
      )
      .where("AttendanceMasterId", attendanceMasterId)
      .orderBy("id", "desc");

    const response: any[] = [];

    const Output = await selectInterimAttenceslist;

    Output.forEach((row) => {
      let data2: any = {};
      data2["id"] = row.id;
      data2["TimeIn"] = row.TimeIn;
      if (row.TimeInImage != "") {
        data2["TimeInImage"] = row.TimeInImage;
      } else {
        data2["TimeInImage"] = "";
      }
      if (row.TimeOutImage != "") {
        data2["TimeOutImage"] = row.TimeOutImage;
      } else {
        data2["TimeOutImage"] = "";
      }

      data2["TimeInLocation"] = row.TimeInLocation;
      data2["LatitudeIn"] = row.LatitudeIn;
      data2["LongitudeIn"] = row.LongitudeIn;
      data2["TimeOut"] = row.TimeOut;
      //data2['TimeOutImage']   = row.TimeOutImage;
      data2["TimeOutLocation"] = row.TimeOutLocation;
      data2["LatitudeOut"] = row.LatitudeOut;
      data2["LongitudeOut"] = row.LongitudeOut;
      data2["TimeInEditStatus"] = row.TimeInEditStatus;
      data2["TimeOutEditStatus"] = row.TimeOutEditStatus;
      data2["AttendanceStatus"] = row.AttendanceStatus;
      data2["Device"] = row.Device;
      data2["TimeInIp"] = row.TimeInIp;
      data2["TimeOutIp"] = row.TimeOutIp;
      data2["FakeLocationStatusTimeIn"] = row.FakeLocationStatusTimeIn;
      data2["FakeLocationStatusTimeOut"] = row.FakeLocationStatusTimeOut;
      data2["Platform"] = row.Platform;
      data2["TimeInFaceId"] = row.TimeInFaceId;
      data2["TimeOutFaceId"] = row.TimeOutFaceId;
      data2["SuspiciousTimeInStatus"] = row.SuspiciousTimeInStatus;
      data2["SuspiciousTimeOutStatus"] = row.SuspiciousTimeOutStatus;
      data2["PersistedFaceTimeIn"] = row.PersistedFaceTimeIn;
      data2["PersistedFaceTimeOut"] = row.PersistedFaceTimeOut;
      data2["TimeInConfidence"] = row.TimeInConfidence;
      data2["TimeOutConfidence"] = row.TimeOutConfidence;
      data2["TimeInDeviceId"] = row.TimeInDeviceId;
      data2["TimeOutDeviceId"] = row.TimeOutDeviceId;
      data2["TimeInCity"] = row.TimeInCity;
      data2["TimeOutCity"] = row.TimeOutCity;
      data2["TimeInAppVersion"] = row.TimeInAppVersion;
      data2["TimeOutAppVersion"] = row.TimeOutAppVersion;
      data2["TimeInGeofence"] = row.TimeInGeofence;
      data2["TimeOutGeofence"] = row.TimeOutGeofence;
      data2["AttendanceMasterId"] = row.AttendanceMasterId;
      data2["SuspiciousDeviceTimeInStatus"] = row.SuspiciousDeviceTimeInStatus;
      data2["SuspiciousDeviceTimeOutStatus"] =
        row.SuspiciousDeviceTimeOutStatus;
      data2["TimeInDeviceName"] = row.TimeInDeviceName;
      data2["TimeOutDeviceName"] = row.TimeOutDeviceName;
      data2["LoggedHours"] = row.LoggedHours;
      data2["TimeInApp"] = row.TimeInApp;
      data2["TimeOutApp"] = row.TimeOutApp;
      data2["IsDelete"] = row.IsDelete;

      response.push(data2);
    });

    return response;
  }
}
