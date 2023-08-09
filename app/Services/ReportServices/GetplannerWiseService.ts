import Database from "@ioc:Adonis/Lucid/Database";

const { DateTime } = require("luxon");
const dayjs = require("dayjs");
const moment = require('moment');

export default class GetplannerWiseSummary {
    public static async Getlannerwisesummary(a)
    {     
    
      const currentDate = a.attDen
       var Date2 = currentDate.toFormat("yyyy-MM-dd");

      
        const overtime = "";
        const overtime1 = "";
        const overtime3 = "";
        const loggedHours = "00:00:00";
        const shiftin = "";
        const shiftout = "";    
        const weekoff_sts="-"; 
        const bhour ="00:00:00"; 

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
              "Toff.EmployeeId as TEID",
              "AM.EmployeeId as AMEID",
              Database.raw(
                `(SELECT SEC_TO_TIME(sum(time_to_sec(TIMEDIFF(Timeoff_end, Timeoff_start)))) FROM Timeoff WHERE 
             Timeoff.EmployeeId = ${a.userid} AND Timeoff.ApprovalSts = 2) AS timeoffhours`
              ),
              "AM.ShiftId",
              "AM.TotalLoggedHours AS thours",
              Database.raw(
                `(SELECT SEC_TO_TIME(sum(time_to_sec(TIMEDIFF(TimeTo, TimeFrom)))) FROM Timeoff WHERE 
                Timeoff.EmployeeId = ${a.userid} AND Timeoff.ApprovalSts = 2) AS bhour`
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
            ).limit(2)
            // .andWhere('AM.EmployeeId',a.userid)
            // .andWhere('AM.AttendanceDate',Date2)
            .whereIn("AM.AttendanceStatus", [1,3,5,4,8,10]);
      // return fetchdatafromTimeOFFandAttendanceMaster
          const result = await fetchdatafromTimeOFFandAttendanceMaster;
          console.log(result);
          
          const res: any[] = [];
      
          result.forEach((val) => {
            const data: any = {};
      
            data["AttendanceDate"] = val.AttendanceDate;
            data["loggedHours"] = val.thours;
            var logged =  data["loggedHours"] ;
            data["timein"] = val.TimeIn;
            data["timeout"] = val.TimeOut;
            data["timeindate"] = val.timeindate;
            data["AttendanceDate"] = moment(val.timeindate).utcOffset("Asia/Kolkata").format('YYYY-MM-DD');

            data["timeoutdate"] = val.timeoutdate;
            // if(data['loggedHours'] == '00:00:00' || data['loggedHours'] != '' || data['loggedHours'] ==null){
      
            // const timeinn= 	data['timeindate']+data['timein'];
            //  const timeoutt=data['timeoutdate']+data['timeout'];
            //  console.log(timeinn)
            //  console.log(timeoutt)
            //  const parsedDate = DateTime.fromFormat(timeinn, "EEE MMM dd yyyy HH:mm:ss 'GMT'Z (z)ZZZZZ")
            
            // console.log(parsedDate.toJSDate()); // 
            //  var a ;
            
            //   var difference ;
            //   var differenceInHours;
            // // if(timeinn>timeoutt){
              
            //   // Calculate the difference between the two dates
            //   difference = date2.diff(date1);
              
            //   // Get the difference in hours
            //    differenceInHours = difference.as('hours');
            
            
            // }
            // else{
              
            //   difference = date2.diff(date1);
              
            //   // Get the difference in hours
            //    differenceInHours = difference.as('hours');
            
            // }
            

             
      
            // }
            
            
      
      
       data['timeoffhours']=val.timeoffhours;
      
      if(data['timeoffhours'] == null|| data['timeoffhours'] == ''){
        data['timeoffhours'] ='12:00:00';  
        var time =  data['timeoffhours']
      }
    
      // if(data['timeoffhours'] != '00:00:00'){
      //   var  queryResult =   Database.raw(
      //     `SELECT SUBTIME( ${logged},${time}) AS latehours`
      //   );

        

        
        // res.push(queryResult)
        // const row111 =queryResult;

        // // if (row111.length > 0) {
      
        // //   const loggedHoursResult = row111[0].Loggedhours;
        // //   res.push(loggedHours)
          
        // // }
        var  queryReslt2 =   Database.raw
        (
 `SELECT SUBTIME  ("${logged }","${time}" )   AS latehours`);


      
          //return queryReslt2;
       //var result = await queryReslt2;
      console.log(queryReslt2)
      // data['timeoutplatform'] = val.TimeOutApp
      // data['ShiftId'] = val.ShiftId
         
      // const queryResult = Database.from('ShiftMaster').where('Id',8).select('TimeIn', 'TimeOut', 
      // 'shifttype',
      // 'HoursPerDay');
      // res.push(queryResult)
     

    });
    // return res


  }


    }

