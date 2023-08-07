import { Request } from "@adonisjs/core/build/standalone";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

const { DateTime } = require("luxon");
const dayjs = require("dayjs");
const moment = require('moment');

export default class GetplannerController {
  public async data({ request,response}: HttpContextContract) {

    

    const userid = 7295;
    const refno = request.input("refno");
    const attDaten = request.input("attDate");
    //  const zone = getEmpTimeZone(userid,refno)

    const datastart = new Date();
    const overtime = "";
    const overtime1 = "";
    const overtime3 = "";
    const loggedHours = "00:00:00";
    const shiftin = "";
    const shiftout = "";


    const fetchdatafromTimeOFFandAttendanceMaster = await Database.from(
      "Timeoff as Toff"
    )
      .innerJoin(
        "AttendanceMaster as AM",
        "Toff.TimeofDate",
        "AM.AttendanceDate"
      )

      .select(
        "AM.AttendanceDate",
        "Toff.Reason",
        "Toff.TimeofDate",
        "Toff.TimeTo",
        "AM.TimeIn",
        "AM.TimeOut",
        "AM.timeindate",
        "AM.timeoutdate",
        "AM.TimeOutApp",
        Database.raw(
          `(SELECT SEC_TO_TIME(sum(time_to_sec(TIMEDIFF(Timeoff_end, Timeoff_start)))) FROM Timeoff WHERE 
       Timeoff.EmployeeId = ${userid} AND Timeoff.ApprovalSts = 2) AS timeoffhours`
        ),
        "AM.ShiftId",
        "AM.TotalLoggedHours AS thours",
        Database.raw(
          `(SELECT SEC_TO_TIME(sum(time_to_sec(TIMEDIFF(TimeTo, TimeFrom)))) FROM Timeoff WHERE Timeoff.EmployeeId = 6 AND Timeoff.ApprovalSts = 2) AS bhour`
        ),
        Database.raw("SUBSTRING_INDEX(EntryImage, '.com/', -1) AS EntryImage"),
        Database.raw("SUBSTRING_INDEX(ExitImage, '.com/', -1) AS ExitImage"),
        Database.raw("CONCAT(LEFT(checkInLoc, 35), '...') AS checkInLoc"),
        Database.raw("CONCAT(LEFT(CheckOutLoc, 35), '...') AS CheckOutLoc"),
        "latit_in",
        "longi_in",
        "latit_out",
        "longi_out",
        "multitime_sts"
      )
      .limit(6)
      .whereIn("AttendanceStatus", [1, 2, 3, 4]);

    const result = await fetchdatafromTimeOFFandAttendanceMaster;
    const res: any[] = [];

    result.forEach((val) => {
      const data: any = {};
      data["status"] = parseInt(val?.AttendanceStatus ?? 0, 10);

      data["AttendanceDate"] = val.AttendanceDate;
      data["loggedHours"] = val.thours;
      data["timein"] = val.TimeIn;
      data["timeout"] = val.TimeOut;
      data["timeindate"] = val.timeindate;
      data["timeoutdate"] = val.timeoutdate;
      if(data['loggedHours'] == '00:00:00' || data['loggedHours'] == '' || data['loggedHours'] ==null){

      const timeinn= 	data['timeindate']+data['timein'];
       const timeoutt=data['timeoutdate']+data['timeout'];

       const timein1 = DateTime.fromISO(timeinn);

      }
      const timeinn = data["timeindate"] + data["timein"];
      const timeoutt = data["timeoutdate"] + data["timeout"];

      const formattedDate = moment.utc(timeinn, 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)').format();
      const formattedDate2 = moment.utc(timeoutt, 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)').format();
console.log(formattedDate)
console.log(formattedDate2)
     var interval;
       if(timeinn>timeoutt){
        interval = "a"
      }else{
       interval = "b"
      }

      res.push(formattedDate2)


// data['timeoffhours']=val.timeoffhours;
// if(data['timeoffhours'] == null|| data['timeoffhours'] == ''){
//   data['timeoffhours'] ='00:00:00';   
// }

// const loggedHours = '02:00:00'
// const timeoffhours = '00:00:00'
// if(data['timeoffhours'] != '00:00:00'){
  // const timeoffResult = await Database.raw(
  //   "SELECT SUBTIME('02:00:00', '00:00:00') AS latehours"
  // );
  // return timeoffResult
//   if (timeoff && timeoff.rows.length > 0) {
//     const { Loggedhours } = timeoff.rows[0];
//     data['loggedHours'] = Loggedhours;

    
//   }

// }

// data['timeoutplatform'] = val.TimeOutApp
// data['ShiftId'] = val.ShiftId
   
// const queryResult:any = await Database.from('ShiftMaster').where('Id',8).select('TimeIn', 'TimeOut', 
// 'shifttype',
// 'HoursPerDay');

// if (queryResult) {

    

// }



    });
    return res


  }

  

  }
