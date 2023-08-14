import Database from "@ioc:Adonis/Lucid/Database";
import helper from "../Helper/Helper";
//import moment from "moment";
import * as moment from "moment-timezone";
export default class ShiftsService {
  constructor() {}

  static async getShiftData(a) {
    //  const currentpage:number = a.currentpage;
    // const perpage:number = a.perpage;
    //const rowperpage:number = (currentpage - 1) * perpage;
    function getCurrentDate(): string {
      const date = new Date();

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    }
    const currentDate = getCurrentDate();
    //console.log(currentDate);
    const orgid: number = a.OrganizationId;
    type KeyValuePair = { [key: string]: any };
    const keyValueArray: KeyValuePair[] = [];
    keyValueArray.push({ OrganizationId: orgid });
    let conditionarr = keyValueArray[0];
    console.log(keyValueArray);

    const data = await Database.query()
      .from("ShiftMaster")
      .select("*")
      .where(conditionarr)
      .orderBy("Name");
    //.offset(rowperpage).limit(perpage);

    let res: number = 0;
    data.forEach((element) => {
      let name: string = element["Name"];
      let archive: number = element["archive"];
      if (name.toUpperCase() == "TRIAL SHIFT" && archive == 1) {
        res = 1;
      }
    });
    let data1: any = "";
    if (res == 1) {
      let archive: number = a.archive;
      keyValueArray[0].archive = archive;
      conditionarr = keyValueArray[0];
      console.log(conditionarr);
      data1 = await Database.query()
        .from("ShiftMaster")
        .select("*")
        .where(conditionarr)
        .orderBy("Name");
      // console.log(data1.toSQL().toNative());
      //console.log('test');
      return data1;
    } else {
      const row = await Database.table("ShiftMaster").returning("id").insert({
        Name: "Trial Shift",
        TimeIn: "09:00:00",
        TimeOut: "18:00:00",
        TimeInGrace: "17:00:00",
        TimeOutGrace: "17:00:00",
        TimeInBreak: "00:00:00",
        TimeOutBreak: "00:00:00",
        OrganizationId: orgid,
        CreatedDate: currentDate,
        CreatedById: 0,
        LastModifiedDate: currentDate,
        LastModifiedById: 0,
        OwnerId: 0,
        BreakInGrace: "00:00:00",
        BreakOutGrace: "00:00:00",
        archive: 1,
        shifttype: 1,
      });
      const id = row[0].id;
      if (id > 0) {
        for (let i = 1; i < 8; i++) {
          // create default weekly off
          await Database.table("ShiftMasterChild").insert({
            ShiftId: id,
            Day: i,
            WeekOff: "0,0,0,0,0",
            OrganizationId: orgid,
            ModifiedBy: 0,
            ModifiedDate: currentDate,
          });
        }

        let archive: number = a.archive;
        keyValueArray[0].archive = archive;
        conditionarr = keyValueArray[0];
        console.log(conditionarr);
        data1 = await Database.query()
          .from("ShiftMaster")
          .select("*")
          .where(conditionarr)
          .orderBy("Name");
        return data1;
      }
    }
    return data1;
  }

  static async createdata(data) {
    //console.log("data");
    const name = data.name;
    const orgid = data.org_id;
    let ti = data.ti;
    let to = data.to;
    const tib = data.tib;
    const tob = data.tob;
    const tig = data.tig ? data.tig : "00:00";
    const tog = data.tog ? data.tog : "00:00";
    const big = data.big ? data.big : "00:00";
    const bog = data.bog ? data.bog : "00:00";
    // console.log(bog);
    const sts = data.sts;
    const shifttype1 = data.shifttype;
    const multiplepunches = data.multiplepunches;
    let HoursPerDay1 = "00:00:00";

    const empid = data.empid;
    const empname = await helper.getempnameById(empid);
    const shiftcalendardata = data.shiftcalendardata;
    // Replace single quotes with double quotes in the JSON string
    const string = shiftcalendardata.replace(/'/g, '"');

    // Parse the JSON string into an object
    const result1 = JSON.parse(string);
    console.log(result1);
    if (shifttype1 != "3") {
      ti = ti == "00:00:00" ? "00:01:00" : ti;
      to = to == "00:00:00" ? "23:59:00" : to;
    }

    if (shifttype1 == "2") {
    } else {
      console.log(to);
      console.log(ti);
      if (HoursPerDay1 == "00:00:00") {
        function parseTime(timeStr: string): Date {
          const [hours, minutes] = timeStr.split(":").map(Number);
          return new Date(0, 0, 0, hours, minutes);
        }

        function formatTimeDiff(timeDiff: number): string {
          const hours = Math.floor(timeDiff / (60 * 60 * 1000));
          const minutes = Math.floor(
            (timeDiff % (60 * 60 * 1000)) / (60 * 1000)
          );
          const seconds = Math.floor((timeDiff % (60 * 1000)) / 1000);

          return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }
        const time1 = parseTime(to);
        const time2 = parseTime(ti);

        const timeDiffInMillis = time1.getTime() - time2.getTime();
        HoursPerDay1 = formatTimeDiff(timeDiffInMillis);

        //console.log(HoursPerDay1); // Output: "14:00:00" (hours:minutes:seconds)
      }
      const currentDate: Date = new Date();
      const year: number = currentDate.getFullYear();
      const month: number = currentDate.getMonth() + 1;
      const day: number = currentDate.getDate();

      const date: string = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
      const result: any[] = [];
      const query = await Database.query()
        .from("ShiftMaster")
        .select("*")
        .where("Name", name)
        .andWhere("OrganizationId", orgid);
      const numberOfRows = query.length;
      result["status"] = 0;
      if (numberOfRows > 0) {
        result["status"] = -1;
      } else {
        const row = await Database.table("ShiftMaster").returning("id").insert({
          Name: name,
          TimeIn: ti,
          TimeOut: to,
          TimeInGrace: tig,
          TimeOutGrace: tog,
          TimeInBreak: tib,
          TimeOutBreak: tob,
          OrganizationId: orgid,
          CreatedDate: date,
          CreatedById: empid,
          LastModifiedDate: date,
          LastModifiedById: empid,
          OwnerId: 0,
          BreakInGrace: big,
          BreakOutGrace: bog,
          archive: sts,
          shifttype: shifttype1,
          HoursPerDay: HoursPerDay1,
          MultipletimeStatus: multiplepunches,
        });
        var Id: any = row;
        console.log(row);
        console.log("A");
        if (Id > 0) {
          let i = 0;
          let j = 0;
          // var row1: any;
          result1.forEach(async (element) => {
            let day = i++;
            await Database.table("ShiftMasterChild").returning("id").insert({
              ShiftId: Id,
              Day: day,
              WeekOff: element[j],
              OrganizationId: orgid,
              ModifiedBy: empid,
              ModifiedDate: date,
            });
            j++;
          });
          if (i == 7) {
            console.log("item");
            const zone: any = await helper.getTimeZone(orgid);
            const Zonename = zone[0].name;
            moment.tz.setDefault(Zonename);
            const module: string = "Attendance app";
            const appModule: string = "Shift";
            const actionperformed: string =
              "<b>" +
              name +
              "</b> Shift has been added by <b>" +
              empname +
              "</b> from <b> Attendance App </b>";
            const activityby = 1;
            await Database.table("ActivityHistoryMaster")
              .returning("id")
              .insert({
                LastModifiedDate: date,
                LastModifiedById: empid,
                Module: module,
                ActionPerformed: actionperformed,
                OrganizationId: orgid,
                ActivityBy: activityby,
                adminid: empid,
                AppModule: appModule,
              });
            result["status"] = 1;
          }
        }
      }
      console.log(result);
    }
  }
}
