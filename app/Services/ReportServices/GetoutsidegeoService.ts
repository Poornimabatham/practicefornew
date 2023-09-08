import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import { DateTime } from "luxon";
export default class GetoutsidegeoService {
  public static async getOutsidegeoService(data: any) {
    const seid = data.seid ? data.seid : "";
    const uid = data.uid ? data.uid : "";
    const orgid = data.orgid ? data.orgid : "";
    const currentPage = data.currentPage ? data.currentPage : "";
    const perPage = data.perPage ? data.perPage : "";
    const begin = (currentPage - 1) * perPage;
    let zone: any = await Helper.getEmpTimeZone(uid, orgid); // to set the timezone by employee country.
    const defaultZone = DateTime.now().setZone(zone);
    const curr = await Helper.getCurrentDate();
    let date = data.date ? data.date : curr;
    date = date.toFormat("yyyy-MM-dd");

    // time = date1.toFormat("yyyy-MM-dd");
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    // Formatting hours, minutes, and seconds to ensure leading zeros
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    let q = "";
    if (seid != "0" && seid != "") {
      q = " AND A.EmployeeId = " + seid;
    }
    let adminstatus: any = await Helper.getAdminStatus(uid);
    let cond = "";
    let cond1 = "";
    if (adminstatus == "2") {
      const dptid = await Helper.getDepartmentIdByEmpID(uid);
      cond = " AND E.Department =" + dptid;
      cond1 = "AND A.Dept_id =" + dptid;
    }
   // let query :any[] = [];
     const query :any= await Database.query()
      .select(
        "A.Id",
        "A.EmployeeId",
        "E.EmployeeCode",
        " E.FirstName",
        "E.LastName",
        " A.AttendanceDate",
        "A.AttendanceStatus",
        "A.TimeIn",
        "A.TimeOut",
        "A.ShiftId",
        "A.Overtime",
        "A.EntryImage",
        "A.ExitImage",
        "A.latit_in",
        "A.longi_in",
        "A.longi_out",
        "A.latit_out",
        "A.TimeInGeoFence",
        " A.TimeOutGeoFence",
        "A.FakeLocationStatusTimeIn",
        "A.FakeLocationStatusTimeOut",
        "A.device",
        " A.checkInLoc",
        "A.CheckOutLoc",
        "A.areaId",
        "G.Lat_Long",
        "G.Radius"
      )
      .from("AttendanceMaster as A")
      .innerJoin("Geo_Settings as G", "G.Id", "A.areaId")
      .innerJoin("EmployeeMaster as E", "E.Id", "A.EmployeeId")
      .where("A.OrganizationId", orgid)
      .andWhereNot("A.TimeIn", "00:00")
      .whereRaw(q)
      .andWhereNot("A.areaId", 0)
      .andWhere("E.Is_Delete", 0)
      .andWhere(
        Database.raw(
          ` ((A.TimeInGeoFence!='Within Geofence' && A.TimeOutGeoFence !='Within Geofence') or (A.TimeInGeoFence ='Within Geofence' and  A.TimeOutGeoFence ='Outside Geofence') or (A.TimeInGeoFence ='Outside Geofence' and  A.TimeOutGeoFence ='Within Geofence') )`
        )
      )
      .andWhere("A.AttendanceDate", date)
      .whereRaw(cond)
      .orderBy("E.FirstName", "asc")
      .orderBy("A.AttendanceDate", "desc")
      .limit(perPage)
      .offset(begin);
    let res: any[] = [];

    let res1: any[] = [];
    let i = 1;

      const promises:any = await query.map(async (row :any) => {
        let data: any = {};
        data["id"] = row["Id"];
        data["empname"] = row["FirstName"] + " " + row["LastName"];
        let ti = row["TimeIn"];
        data["ti"] = ti.slice(0, -3);
        data["timein"] = row["TimeIn"].slice(0, -3);
        data["to"] = row["TimeOut"].slice(0, -3);
        data["timeout"] = row["TimeOut"].slice(0, -3);
        data["locationin"] =
          row["checkInLoc"].length > 60
            ? row["checkInLoc"].slice(0, 55) + "..."
            : row["checkInLoc"];
        if (
          (data["locationin"] == "" ||
            data["locationin"] == "Location not fetched.") &&
          row["latit_in"] != "0.0" &&
          row["longi_in"] != "0.0"
        ) {
          data["locationin"] = row["latit_in"] + "," + row["longi_in"];
        }
        data["locationout"] =
          row["CheckOutLoc"].length > 60
            ? row["CheckOutLoc"].slice(0, 55) + "..."
            : row["CheckOutLoc "];
        if (
          (data["locationout"] == "" ||
            data["locationout"] == "Location not fetched.") &&
          row["latit_out"] != "0.0" &&
          row["longi_out"] != "0.0"
        ) {
          data["locationin"] = row["latit_out"] + "," + row["longi_out"];
        }
        data["latin"] = row["latit_in"];
        data["lonin"] = row["longi_in"];
        data["latout"] = row["latit_out"];
        data["lonout"] = row["longi_out"];
        data["attdate"] = row["AttendanceDate"];
        data["instatus"] = "";
        data["outstatus"] = "";
        data["outcolor"] = "";
        data["incolor"] = "";

        if (
          row["areaId"] != 0 &&
          row["latit_in"] != 0.0 &&
          row["longi_in"] != 0.0 &&
          row["latit_out"] != 0.0 &&
          row["longi_out"] != 0.0 &&
          row["TimeInGeoFence"] == "" &&
          row["TimeOutGeoFence"] == ""
        ) {
          const lat_lang = await Helper.getName(
            "Geo_Settings",
            "Lat_Long",
            "Id",
            row["areaId"]
          );
          let radius = await Helper.getName(
            "Geo_Settings",
            "Radius",
            "Id",
            row["areaId"]
          );

          let numberValue: number = +radius;

          let arr1 = lat_lang.split(",");
          if (arr1.length > 1) {
            const a: number = parseFloat(arr1[0]);
            const b: number = parseFloat(arr1[1]);
            const latit_in: number = row.latit_in; // Replace with your actual value
            const longi_in: number = row.longi_in; // Replace with your actual value
            const latit_out: number = row.latit_out; // Replace with your actual value
            const longi_out: number = row.longi_out; // Replace with your actual value

            const d1: number = await this.distance(
              a,
              b,
              latit_in,
              longi_in,
              "K"
            );
            const d2: number = await this.distance(
              a,
              b,
              latit_out,
              longi_out,
              "K"
            );

            if (row["FakeLocationStatusTimeIn"] == 1) {
              data["instatus"] = "Fake Location";
            } else if (d1 >= numberValue) {
              data["instatus"] = "Within Geofence" + " " + data["ti"];
              data["incolor"] = "1";
            } else {
              data["instatus"] = "Outside Geofence" + " " + data["ti"];
              data["incolor"] = "0";
            }
            if (row["FakeLocationStatusTimeOut"] == 1) {
              data["outstatus"] = "Fake Location";
            } else if (d2 <= numberValue) {
              data["outstatus"] = "Within Geofence" + " " + data["to"];
              data["outcolor"] = "1";
            } else {
              data["outstatus"] = "Outside Geofence" + " " + data["to"];
              data["outcolor"] = "0";
            }
          }
        } else if (
          row["areaId"] != 0 &&
          row["latit_in"] != 0.0 &&
          row["longi_in"] != 0.0 &&
          row["latit_out"] == 0.0 &&
          row["longi_out"] == 0.0 &&
          row["device"] != "Auto Time Out" &&
          row["TimeInGeoFence"] == "" &&
          row["TimeOutGeoFence"] == ""
        ) {
          const lat_lang = await Helper.getName(
            "Geo_Settings",
            "Lat_Long",
            "Id",
            row["areaId"]
          );
          const radius = await Helper.getName(
            "Geo_Settings",
            "Radius",
            "Id",
            row["areaId"]
          );
          let numberValue: number = +radius;
          let arr1 = lat_lang.split(",");
          if (arr1.length > 1) {
            const a = parseFloat(arr1[0]);
            const b = parseFloat(arr1[1]);
            const d1 = await this.distance(
              a,
              b,
              row["latit_in"],
              row["longi_in"],
              "K"
            );
            const d2 = await this.distance(
              a,
              b,
              row["latit_out"],
              row["longi_out"],
              "K"
            );
            if (row["FakeLocationStatusTimeIn"] == 1) {
              data["instatus"] = "Fake Location";
            } else if (d1 <= numberValue) {
              data["instatus"] = "Within Geofence" + " " + data["ti"];
              data["incolor"] = "1";
            } else {
              data["instatus"] = "Outside Geofence" + " " + data["ti"];
              data["incolor"] = "0";
            }
          }
        } else if (
          row["areaId"] != 0 &&
          row["device"] == "Auto Time Out" &&
          row["TimeInGeoFence"] == "" &&
          row["TimeOutGeoFence"] == ""
        ) {
          const lat_lang = await Helper.getName(
            "Geo_Settings",
            "Lat_Long",
            "Id",
            row["areaId"]
          );
          const radius = await Helper.getName(
            "Geo_Settings",
            "Radius",
            "Id",
            row["areaId"]
          );
          const numberValue: number = +radius;
          const arr1 = lat_lang.split(",");
          //echo '----------'.count($arr1);
          if (arr1.length > 1) {
            const a = parseFloat(arr1[0]);
            const b = parseFloat(arr1[1]);
            const d1 = await this.distance(
              a,
              b,
              row["latit_in"],
              row["longi_in"],
              "K"
            );
            const d2 = await this.distance(
              a,
              b,
              row["latit_out"],
              row["longi_out"],
              "K"
            );
            if (row["FakeLocationStatusTimeIn"] == 1) {
              data["instatus"] = "Fake Location";
            } else if (d1 <= numberValue) {
              data["instatus"] = "Within Geofence" + " " + data["ti"];
              data["incolor"] = "1";
            } else {
              data["instatus"] = "Outside Geofence" + " " + data["ti"];
              data["incolor"] = "0";
            }
          }
        } else if (
          row["areaId"] != 0 &&
          row["device"] == "TimeOut marked by Admin" &&
          row["TimeInGeoFence"] == "" &&
          row["TimeOutGeoFence"] == ""
        ) {
          const lat_lang = await Helper.getName(
            "Geo_Settings",
            "Lat_Long",
            "Id",
            row["areaId"]
          );
          const radius = await Helper.getName(
            "Geo_Settings",
            "Radius",
            "Id",
            row["areaId"]
          );
          const numberValue: number = +radius;
          let arr1 = lat_lang.split(",");
          if (arr1.length > 1) {
            const a = parseFloat(arr1[0]);
            const b = parseFloat(arr1[1]);
            const d1 = await this.distance(
              a,
              b,
              row["latit_in"],
              row["longi_in"],
              "K"
            );
            const d2 = await this.distance(
              a,
              b,
              row["latit_out"],
              row["longi_out"],
              "K"
            );
            if (row["FakeLocationStatusTimeIn"] == 1) {
              data["instatus"] = "Fake Location";
            } else if (d1 <= numberValue) {
              data["instatus"] = "Within Geofence" + " " + data["ti"];
              data["incolor"] = "1";
            } else {
              data["instatus"] = "Outside Geofence" + " " + data["ti"];
              data["incolor"] = "0";
            }
          }
        }
        if (row["areaId"] != 0 && row["device"] == "Auto Time Out") {
          if (
            row["TimeInGeoFence"] != "Not Calculated." &&
            row["TimeInGeoFence"] != ""
          ) {
            if (
              row["TimeInGeoFence"] == "Within Geofence" ||
              row["TimeInGeoFence"] == "Within Fenced Area"
            ) {
              data["instatus"] = "Within Geofence" + " " + data["ti"];
              data["incolor"] = "1";
            } else {
              data["instatus"] = "Outside Geofence" + " " + data["ti"];
              data["incolor"] = "0";
            }
          }
        }
        if (row["areaId"] != 0 && row["device"] == "Auto Time Out") {
          if (
            row["TimeInGeoFence"] != "Not Calculated." &&
            row["TimeInGeoFence"] != ""
          ) {
            if (
              row["TimeInGeoFence"] == "Within Geofence" ||
              row["TimeInGeoFence"] == "Within Fenced Area"
            ) {
              data["instatus"] = "Within Geofence" + " " + data["ti"];
              data["incolor"] = "1";
            } else {
              data["instatus"] = "Outside Geofence" + " " + data["ti"];
              data["incolor"] = "0";
            }
          }
        }
        if (data["outstatus"] != "" || data["outstatus"] != "") {
          if (data["outstatus"] == "" && data["to"] != "00:00") {
            data["outstatus"] = "Within the location" + " " + data["to"];
            data["outcolor"] = "1";
          }
          if (data["instatus"] == "") {
            data["instatus"] = "Within the location" + " " + data["ti"];
            data["incolor"] = "1";
          }
        }
      
        res1.push(data);

        i++;
          //return res1;
      });
      //return res1;
    for (const index in res1) {
      if (
        (res1["instatus"] === `Within Geofence ${res1["ti"]}` &&
          res1["to"] === "00:00") ||
        (res1["instatus"] === `Within Geofence ${res1["ti"]}` &&
          res1["outstatus"] === `Within Geofence ${res1["to"]}`)
      ) {
        delete res1[index];
      }
    }

    return res1;
  }

  public static async distance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    unit: string
  ) {
    const theta = lon1 - lon2;
    let dist =
      Math.sin(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.cos(theta * (Math.PI / 180));
    dist = Math.acos(dist);
    dist = dist * (180 / Math.PI);
    const miles = dist * 60 * 1.1515;
    unit = unit.toUpperCase();

    if (unit === "K") {
      return miles * 1.609344;
    } else if (unit === "N") {
      return miles * 0.8684;
    } else {
      return miles;
    }
  }
}
