import moment from "moment";
import Database from "@ioc:Adonis/Lucid/Database";
const format = require('date-fns/format');
const parseISO = require('date-fns/parseISO');
export default class GetDataToRegService {
  public static async FetchingdatatoReg(data) {
    var count = 0;
    var status = false;

    const currentMonth = moment().endOf("month").format("YYYY-MM-DD");

    if (data.month != "null" || data.month != undefined) {
      const currentmonth = moment(data.month).format("YYYY-MM-DD");
    }

    var MinTimes = "";
    var MaxDays = 0;
    var Regularizecount = 0;
    var regularizationsettingsts = 0;
    // $attendancearr=array();
    const selectRegularizationSettings = await Database.from(
      "RegularizationSettings"
    )
      .select("MaxDays", "MinTimes")
      .where("OrganizationId", data.orgid)
      .where("RegularizationSts", 1)
      .first();
    const row = selectRegularizationSettings;
    count = row ? 1 : 0;

    if (count >= 1) {
      regularizationsettingsts = 1;
      if (row) {
        MaxDays = row.MaxDays;
        MinTimes = row.MinTimes;
      }
    }

    const regularizeCount:any = await Database.from("AttendanceMaster")
      .where("OrganizationId", 1074)
      .whereNot("Is_Delete", 1)
      .where("EmployeeId", 7294)
      .whereRaw(`MONTH(AttendanceDate) = MONTH('${currentMonth}')`)
      .whereNot("AttendanceDate", Database.raw("CURDATE()"))
      .whereNotIn("RegularizeSts", [0, 1])
      .count("RegularizeSts as Regularizecount");

    const affected_rows = regularizeCount.length;
    if (affected_rows) {
      Regularizecount = regularizeCount[0].Regularizecount;
    }

    const query = Database.from("AttendanceMaster")
      .select(
        "Id",
        "AttendanceStatus",
        "AttendanceDate",
        "device",
        "TimeIn",
        "TimeOut"
      )
      .where("OrganizationId", 10)
      .whereNot("Is_Delete", 1)
      .whereIn("device", ["Auto Time Out", "Absentee Cron"])
      .orWhere((query) => {
        query
          .where("device", "Cron")
          .where("AttendanceStatus", 8)
          .where("TimeIn", "00:00:00")
          .where("TimeOut", "00:00:00");
      })
      .orWhere((query) => {
        query.where("device", "Cron").whereIn("AttendanceStatus", [4, 10]);
      })
      .andWhere((query) => {
        query
          .where("TimeIn", Database.raw("TimeOut"))
          .orWhere("TimeOut", "00:00:00");
      })
      .andWhere("EmployeeId", data.uid)
      .whereRaw(`MONTH(AttendanceDate) = MONTH('${currentMonth}')`)
      .whereRaw(`YEAR(AttendanceDate) = YEAR('${currentMonth}')`)
      .whereNot("AttendanceDate", Database.raw("CURDATE()"))
      .whereIn("RegularizeSts", [0, 1])
      .orderBy("AttendanceDate", "desc")
      .limit(2);

    const attendanceData = await query;
    console.log(attendanceData);
    var attendancearr: any = [];
    attendanceData.forEach((row) => {
      const res1= {};
      res1["id"] = row.Id;
      res1["sts"] = row.AttendanceStatus;
      res1["device"] = row.device;
      const timeIn =
        row.TimeIn === "00:00:00"
          ? "00:00"
          : new Date(`1970-01-01T${row.TimeIn}Z`).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });
      res1["timeIn"] = timeIn;
      const timeOut =
        row.TimeOut === "00:00:00"
          ? "00:00"
          : new Date(`1970-01-01T${row.TimeOut}Z`).toISOString().substr(11, 5);
      res1["timeOut"] = timeOut;
      var date1:any = new Date(row.AttendanceDate);
      res1["date1"] = date1;
      var date2:any= new Date();
res1['date2']=date2
const diffInMilliseconds:number = date2 - date1;

// Calculate the difference in days
const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

res1['diffInDays'] = diffInDays
if(MaxDays!=0){
  if(MaxDays!=0){
    res1['resultsts']=0
  }else{
    res1['resultsts']=1
  }
}else{
  res1['resultsts']=1

}
if(MinTimes!=undefined){
  if(Regularizecount <       parseInt(MinTimes) ){
    res1['Regularizessts'] = 1;//for   showing
  }else{
    res1['Regularizessts'] = 0;//for not showing
  }
}else{
   res1['Regularizessts'] = 1;
}

attendancearr.push(res1);
    });

    var result:any={}
    status=true;

const monthDate = parseISO(currentMonth);

// Format the month and year using the date-fns library
const formattedMonth = format(monthDate, 'MMMM yyyy');
		result['month']=formattedMonth
		result['Regularizecountdone'] =Regularizecount;
		result['TotalRegularizecount'] =MinTimes;
		result['regularizationsettingsts'] =regularizationsettingsts;
		result['status']=status;
    return result
  }
}
