import { DateTime } from "luxon";
import Helper from "App/Helper/Helper";
import moment from "moment";
import Database from "@ioc:Adonis/Lucid/Database";

export default class getCDateAttnDeptWiseService {
  static async getCDateAttnDeptWise(getData) {
    var Begin = (getData.currentPage - 1) * getData.perPage;
    var limit;
    if (getData.csv == " ") {
      limit = Begin;
    } else {
      limit;
    }

    var zone = await Helper.getTimeZone(getData.orgid);
    var timeZone = zone;

    const now = DateTime.now().setZone(timeZone);
    const yesterday = now.minus({ days: 1 });

    var getDate = getData.date ? getData.date : yesterday;
    var formattedDate1 = getDate.toFormat("yyyy-MM-dd");
    var dateTimeUTC = DateTime.fromISO(formattedDate1, {
      zone: "Pacific/Pago_Pago",
    });
    var dateTimeInTimeZone = dateTimeUTC.setZone(timeZone);
    var date = dateTimeInTimeZone.toFormat("yyyy-MM-dd");

    var time = moment().format("HH:mm:ss");
    var cdate = moment().format("yyyy-MM-DD");

    let dept_cond = "";
    let dept_cond1 = "";

    if (getData.dept !== 0) {
      dept_cond = `  Dept_id=${getData.dept}`;
      dept_cond1 = `  Department=${getData.dept}`;
    }

    if (getData.datafor == "present") {
      console.log("present");
      const getdataforPresentees = Database.query()
        .select([
          Database.raw(
            `(SELECT CONCAT(FirstName, ' ', LastName) FROM EmployeeMaster WHERE id = 'EmployeeId') AS name`
          ),
          Database.raw(
            `IF((SELECT COUNT(id) FROM InterimAttendances WHERE AttendanceMasterId = Id) > 0, 'true', 'false') AS getInterimAttAvailableSts`
          ),
          Database.raw(
            `(SELECT shifttype FROM ShiftMaster WHERE Id = ShiftId) AS shiftType`
          ),
          Database.raw(`SUBSTRING(TimeIn, 1, 5) AS TimeIn`),
          Database.raw(`SUBSTRING(TimeOut, 1, 5) AS TimeOut`),
          Database.raw(`'Present' AS status`),
          Database.raw(
            `SUBSTRING_INDEX(EntryImage, '.com/', -1) AS EntryImage`
          ),
          Database.raw(`SUBSTRING_INDEX(ExitImage, '.com/', -1) AS ExitImage`),
          Database.raw(`SUBSTRING(checkInLoc, 1, 40) AS checkInLoc`),
          Database.raw(`SUBSTRING(CheckOutLoc, 1, 40) AS CheckOutLoc`),
          "latit_in",
          "longi_in",
          "latit_out",
          "longi_out",
          "Id",
          "TotalLoggedHours",
          "AttendanceStatus",
          "ShiftId",
          "multitime_sts",
          Database.raw(
            "DATE_FORMAT(AttendanceDate,'%Y-%m-%d') as AttendanceDate"
          ),
        ])
        .from("AttendanceMaster")
        .where("AttendanceDate", date)
        .whereRaw(dept_cond)
        .where("OrganizationId", getData.orgid)
        .whereIn("AttendanceStatus", [1, 3, 4, 5, 8])
        .orderBy("name", "asc")
        .limit(limit);

      if ((await getdataforPresentees).length > 0) {
        var sendResponse: getdataforPresenteesInterface[] = [];
        var queryResult = await getdataforPresentees;
        queryResult.forEach(function (val) {
          var data: getdataforPresenteesInterface = {
            latit_in: val.latit_in,
            longi_in: val.longi_in,
            latit_out: val.latit_out,
            longi_out: val.longi_out,
            Id: val.Id,
            name: val.name,
            TotalLoggedHours: val.TotalLoggedHours,
            AttendanceStatus: val.AttendanceStatus,
            ShiftId: val.ShiftId,
            multitime_sts: val.multitime_sts,
            OrganizationId: val.OrganizationId,
            AttendanceDate: val.AttendanceDate,
            getInterimAttAvailableSts: val.getInterimAttAvailableSts,
            TimeIn: val.TimeIn,
            checkInLoc: val.checkInLoc,
            shiftType: val.shiftType,
            EntryImage: val.EntryImage,
            ExitImage: val.ExitImage,
            status: val.status,
            TimeOut: val.TimeOut,
          };
          sendResponse.push(data);
        });
      } else {
        sendResponse = [];
      }

      return sendResponse;
    } else if (getData.datafor == "absent") {
      if (date != moment().format("yyyy-MM-DD")) {
        // for other day's absentees

        var GetOthersdaysAbsentees = Database.from("AttendanceMaster as A")
          .innerJoin("EmployeeMaster as E", "A.EmployeeId", "E.Id")
          .innerJoin("AppliedLeave as AL", "A.EmployeeId", "AL.EmployeeId")
          .select(
            Database.raw('CONCAT(E.FirstName, " ", E.LastName) as name'),
            "E.Id",
            "A.OrganizationId",
            "AL.Date",
            "A.AttendanceStatus",
            " AL.Date",
            Database.raw(
              "DATE_FORMAT(A.AttendanceDate,'%Y-%m-%d') as AttendanceDate"
            ),
            Database.raw(` ' - ' as TimeOut `),
            Database.raw(` ' - ' as TimeIn `),
            Database.raw("AL.ApprovalStatus as LeaveStatus")
          )
          .where("AttendanceDate", date)
          .where("A.OrganizationId", getData.orgid)
          .whereIn("A.AttendanceStatus", [2, 7])
          .whereIn(
            "A.EmployeeId",
            Database.rawQuery(
              `(SELECT Id from EmployeeMaster where OrganizationId =${getData.orgid} AND Is_Delete = 0 )`
            )
          )
          .where("AL.ApprovalStatus", 2)
          //  .where('AL.Date',date)
          // .whereRaw(dept_cond)
          .orderBy("name")
          .limit(limit);

        if ((await GetOthersdaysAbsentees).length > 0) {
          var storeReponse: getdataforAbsenteesInterface[] = [];
          var queryResult = await GetOthersdaysAbsentees;

          queryResult.forEach(function (val) {
            var Name;
            var Getname = queryResult[0].name;
            if (Getname.split(" ").length > 3) {
              var words = Getname.split(" ", 4);
              var firstthree = words.slice(0, 3);
              Name = firstthree.join(" ") + "...";
            } else {
              Name = Getname;
            }
            var getdata: getdataforAbsenteesInterface = {
              name: val.name,
              LeaveStatus: val.LeaveStatus,
              TimeIn: val.TimeIn,
              TimeOut: val.TimeOut,
            };
            storeReponse.push(getdata);
          });
        } else {
          storeReponse = [];
        }
        return storeReponse;
      } else {
        // for today's absentees
        var MegedArrayResult;
        const GetDataForTodaysAbsentees = Database.query()
          .from("AttendanceMaster as A")
          .innerJoin("EmployeeMaster as E", "A.EmployeeId", "E.Id")
          .select([
            Database.raw(
              "DATE_FORMAT(AttendanceDate,'%Y-%m-%d') as AttendanceDate"
            ),
            Database.raw(
              `(SELECT CONCAT(FirstName, ' ', LastName) FROM EmployeeMaster WHERE id = "EmployeeId") AS name`
            ),
            Database.raw(`'-' as TimeOut`),
            Database.raw(`'-' as TimeIn`),
          ])
          .from("AttendanceMaster as A")
          .where("AttendanceDate", date)
          .where("A.OrganizationId", getData.orgid)
          .whereIn("A.AttendanceStatus", [2, 7])
          .whereRaw(dept_cond)
          .orderBy("name", "asc");
        const getAbsenteesResult = await GetDataForTodaysAbsentees;
        const getDataforcondONAbsenteesToday = Database.query()
       
          .from("EmployeeMaster as E")
          .innerJoin("ShiftMaster as S", "E.Shift", "S.Id")
          .innerJoin("AttendanceMaster as A", "E.Id","A.EmployeeId")
          .select([
            Database.raw(
              "DATE_FORMAT(AttendanceDate,'%Y-%m-%d') as AttendanceDate"
            ),
            Database.raw(`CONCAT(FirstName, ' ',LastName) as name`),
            Database.raw(`'-' as TimeOut`),
            Database.raw(`'-' as TimeIn`),
            Database.raw(
              `(SELECT ApprovalStatus FROM AppliedLeave WHERE EmployeeId = E.Id AND ApprovalStatus = 2 AND Date = ${date}) as LeaveStatus`
            ),
          ])

          .whereNotExists(function (subquery) {
            subquery
              .select(Database.raw("1"))
              .from("AttendanceMaster as A")
              .whereRaw("A.EmployeeId = E.Id")
              .where("AttendanceDate", date)
              .where("A.OrganizationId", getData.orgid)
              .whereIn("A.AttendanceStatus", [1, 8, 4, 7])
              .whereNotIn("A.Wo_H_Hd", [11, 12]);
          })
          .whereColumn("E.OrganizationId", getData.orgid)
          .whereRaw(
            `(CASE WHEN (E.Id IN (SELECT empid FROM ShiftPlanner WHERE ShiftPlanner.ShiftDate = ? AND ShiftPlanner.orgid = ? AND ShiftPlanner.empid = E.Id)) THEN (SELECT shiftid FROM ShiftPlanner WHERE ShiftPlanner.ShiftDate = ? AND ShiftPlanner.orgid = ? AND ShiftPlanner.empid = E.Id) ELSE E.Shift END) = S.Id`,
            [date, getData.orgid, date, getData.orgid]
          )
          .where("AttendanceDate", date)
          .whereRaw("S.TimeIn < ?", [time])
          .where("E.archive", 1)
          .where("E.Is_Delete", 0)
          .whereRaw(dept_cond1)
          .orderBy("E.Id", "asc")
          .limit(5);
        if ((await getDataforcondONAbsenteesToday).length > 0) {
          var storeReponse: getdataforAbsenteesInterface[] = [];
          var queryResult = await getDataforcondONAbsenteesToday;

          queryResult.forEach(function (val) {
            var Name;
            var Getname = queryResult[0].name;
            if (Getname.split(" ").length > 3) {
              var words = Getname.split(" ", 4);
              var firstthree = words.slice(0, 3);
              Name = firstthree.join(" ") + "...";
            } else {
              Name = Getname;
            }
            var getdata: getdataforAbsenteesInterface = {
              name: val.name,
              LeaveStatus: val.LeaveStatus,
              TimeIn: val.TimeIn,
              TimeOut: val.TimeOut,
            };
            storeReponse.push(getdata);
          });
        } else {
          storeReponse = [];
        }
        MegedArrayResult = [...getAbsenteesResult, ...storeReponse];
        return MegedArrayResult;
      }
    } else if (getData.datafor == "latecomings") {
      console.log("late");

      var getdataforLatecomings = Database.from("EmployeeMaster AS E")
        .innerJoin("AttendanceMaster AS AM", "E.Id", "AM.EmployeeId")
        .select(
          "AM.latit_in",
          "AM.longi_in",
          "AM.latit_out",
          "AM.longi_out",
          "AM.ShiftId",
          "AM.multitime_sts",
          "E.Id",
          "AM.TotalLoggedHours",
          Database.raw(
            "DATE_FORMAT(AM.AttendanceDate,'%Y-%m-%d') as AttendanceDate"
          ),
          Database.raw(`CONCAT(E.FirstName, ' ', E.LastName) as name`),
          Database.raw(`SUBSTRING(AM.TimeIn, 1, 5) AS TimeIn`),
          Database.raw(`SUBSTRING(AM.TimeOut, 1, 5) AS TimeOut`),
          Database.raw(`'Present' AS status`),
          Database.raw(
            `SUBSTRING_INDEX(AM.EntryImage, '.com/', -1) AS EntryImage`
          ),
          Database.raw(
            `SUBSTRING_INDEX(AM.ExitImage, '.com/', -1) AS ExitImage`
          ),
          Database.raw(`SUBSTR(AM.checkInLoc, 1, 40) AS checkInLoc`),
          Database.raw(`SUBSTR(AM.CheckOutLoc, 1, 40) AS CheckOutLoc`)
        )
        .whereRaw(
          `SUBSTRING(time(AM.TimeIn), 1, 5) > SUBSTRING((select
(CASE WHEN (time(TimeInGrace) != '00:00:00') THEN time(TimeInGrace)
ELSE time(AM.TimeIn) END) from ShiftMaster where ShiftMaster.Id =
AM.shiftId), 1, 5)`
        )
        .where("AM.OrganizationId", getData.orgid)
        .where("AttendanceDate", date)
        .whereRaw(dept_cond)
        .whereIn("AttendanceStatus", [1, 4, 8])
        .whereNotIn(
          "ShiftId",
          Database.raw(
            `(Select shifttype from ShiftMaster where Id = AM.ShiftId)`
          )
        )
        .limit(limit);

      if ((await getdataforLatecomings).length > 0) {
        var GetResponse: getdataforLatecomingsInterface[] = [];
        var queryResult = await getdataforLatecomings;
        queryResult.forEach(function (val) {
          var data: getdataforLatecomingsInterface = {
            name: val.name,
            TimeIn: val.TimeIn,
            TimeOut: val.TimeOut,
            latit_in: val.latit_in,
            longi_in: val.longi_in,
            latit_out: val.latit_out,
            longi_out: val.longi_out,
            Id: val.Id,
            TotalLoggedHours: val.TotalLoggedHours,
            AttendanceStatus: val.AttendanceStatus,
            ShiftId: val.ShiftId,
            multitime_sts: val.multitime_sts,
            OrganizationId: val.OrganizationId,
            AttendanceDate: val.AttendanceDate,
            checkInLoc: val.checkInLoc,
            shiftType: val.shiftType,
            EntryImage: val.EntryImage,
            ExitImage: val.ExitImage,
            status: val.status,
          };

          GetResponse.push(data);
        });
      } else {
        GetResponse = [];
      }

      return GetResponse;
    } else if (getData.datafor == "earlyleavings") {
      console.log("earlyleaings");

      const subquery = Database.from("ShiftMaster")
        .select("shifttype")
        .where("Id", "ShiftId");

      const getdataforearlyleavings = Database.from("EmployeeMaster AS E")
        .select("E.Shift", "E.Id", "E.FirstName")
        .whereIn(
          "Id",
          Database.from("AttendanceMaster")
            .select("EmployeeId")
            .where("OrganizationId", getData.orgid)
            .where("AttendanceDate", date)
            .where("TimeIn", "!=", "00:00:00")
            .whereNotIn("ShiftId", subquery)
        )
        .where("OrganizationId", getData.orgid)
        .where("is_Delete", 0)
        .orderBy("FirstName")
        .limit(4);

      var queryResult = await getdataforearlyleavings;
      var takeResponse: any[] = [];
      await Promise.all(
        queryResult.map(async (val) => {
          var data: any = {};

          data["ShiftId"] = val.Shift;
          data["Id"] = val.Id;
          data["FirstName"] = val.FirstName;

          var selectShiftMasterId = await Database.from("ShiftMaster")
            .where("Id", data["ShiftId"])
            .select("TimeIn", "TimeOut", "shifttype", "HoursPerDay");
          if (selectShiftMasterId.length > 0) {
            var shiftin = selectShiftMasterId[0].TimeIn;
            var shiftout = selectShiftMasterId[0].TimeOut;
            var shiftType = selectShiftMasterId[0].shifttype;

            if (shiftType == 2) {
              const nextdate = moment(date, "YYYY-MM-DD")
                .add(1, "days")
                .format("YYYY-MM-DD");

              const shift = `${shiftin.substring(0, 5)} - ${shiftout.substring(
                0,
                5
              )}`;
              data["shift"] = shift;
              data["nextdate"] = nextdate;
              takeResponse.push(data);
            }

            if (cdate == date) {
              const getdatafromAttendanceMaster = await Database.from(
                "AttendanceMaster"
              )
                .select(
                  Database.raw('SUBSTR(TimeIn, 1, 5) as "TimeIn"'),
                  Database.raw('SUBSTR(TimeOut, 1, 5) as "TimeOut"'),
                  Database.raw("'Present' as status"),
                  Database.raw(
                    "SUBSTRING_INDEX(EntryImage, '.com/', -1) as EntryImage"
                  ),
                  Database.raw(
                    "SUBSTRING_INDEX(ExitImage, '.com/', -1) as ExitImage"
                  ),
                  Database.raw("SUBSTR(checkInLoc, 1, 40) as checkInLoc"),
                  Database.raw("SUBSTR(CheckOutLoc, 1, 40) as CheckOutLoc"),
                  "latit_in",
                  "longi_in",
                  "latit_out",
                  "longi_out",
                  "Id",
                  "multitime_sts",
                  "ShiftId",
                  "TotalLoggedHours"
                )
                .where("EmployeeId", data["Id"])
                .limit(limit);

              if ((await getdatafromAttendanceMaster.length) > 0) {
                var row333 = await getdatafromAttendanceMaster;
                data["TimeIn"] = row333[0].TimeIn;

                data["TimeOut"] = row333[1].TimeOut;
                data["EntryImage"] = row333[2].EntryImage;
                data["ExitImage"] = row333[3].ExitImage;
                data["checkInLoc"] = row333[4].checkInLoc;
                data["CheckOutLoc"] = row333[5].CheckOutLoc;
                data["latit_in"] = row333[6].latit_in;
                data["longi_in"] = row333[7].longi_in;
                takeResponse.push(data);
                return takeResponse;
              }
            }
          }
          takeResponse.push(data);
        })
      );
      return takeResponse;
    }
  }
}
