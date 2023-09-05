import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import { DateTime } from "luxon";
export default class getProfileImageService {
  public static async getProfileImage(getvalue) {
    var Orgid = getvalue.orgId;
    var Empid = getvalue.empId;

    const selectEmployeemasterlist: any = await Database.from("EmployeeMaster")
      .select("ImageName", "OrganizationId")
      .where("id", Empid)
      .andWhere("OrganizationId", Orgid);

    var res: any = [];
    const result = await selectEmployeemasterlist;

    result.forEach((ROW) => {
      let Data: any = {};
      const organizationId = ROW.OrganizationId;

      const imageName = ROW.ImageName;
      const combinedString = `${organizationId}/${imageName}`;

      if (ROW.ImageName != "" && combinedString) {
        const timestamp = Date.now();
        const url = "https://ubihrmimages.s3.ap-south-1.amazonaws.com";
        const dir = `${organizationId}/${imageName}`;

        (Data["profile"] = `${url}/${dir}?r=${timestamp}`),
          (Data["profilePath"] = `${imageName}?r=${timestamp}`),
          (Data["profileEndPoint"] = `${url}/${organizationId}/`);
      } else {
        Data["profile"] =
          "http://ubiattendance.ubihrm.com/assets/img/avatar.png";
      }

      res.push(Data);
    });
    return res;
  }

  public static async sendBrodCastNotificationFromService(get) {
    const Orgid = get.refno;
    const Empid = get.uid;
    const Title = get.title;
    const Body = get.body;
    const Topic = get.topic;
    const PageName = get.PageName;

    var Zone = await Helper.getEmpTimeZone(Empid, Orgid);
    const currentDate = DateTime.now().setZone(Zone).toString();
    const [datePart, timePart] = currentDate.split("T");

    const date = datePart;
    const time = timePart;
    const admminSts = 0;
    var insertNotificationList = await Database.insertQuery()
      .table("NotificationsList")
      .insert({
        NotificationTitle: Title,
        NotificationBody: Body,
        EmployeeId: Empid,
        OrganizationId: Orgid,
        CreatedDate: date,
        CreatedTime: time,
        AdminSts: admminSts,
      });
    var NotificationId = insertNotificationList[0];

    var updateNotificationList = await Database.from("NotificationsList")
      .where("Id", NotificationId)
      .update({
        PageName: PageName,
      });
    return NotificationId;
  }

  public static async generateNumericOTP(data) {
    var EmailId = data.emailId;
    var Empid = data.empId;
    var Orgid = data.orgId;
    var fName: string = "";
    var lName: string = "";
    var name = "";
    var EncodeEmailForCheck = Helper.encode5t(EmailId);
    const data2: any[] = [];
    const resresultOTP = {}; 
    const nameQuery = await Database.from("EmployeeMaster")
      .select("*")
      .where("Id", Empid);

    nameQuery.forEach((row) => {
      fName = row.FirstName;
      lName = row.LastName;
    });

    if (lName == "" || lName == "") {
      name = fName;
    } else {
      name = fName + lName;
    }

    var Count;
    const n = 6; // Change this to your desired length
    const generator = "1357902468";

    let result = "";

    for (let i = 1; i <= n; i++) {
      const randomIndex = Math.floor(Math.random() * generator.length);
      result += generator.charAt(randomIndex);
    }

    let  message; ////////// write mailer functionality
    var headers = "";
    var subject = "ubiAttendance- Email verification";

    var mailresponse = null;  
    if (mailresponse == null) 
    {  
      const selectEmailOtp_Auth: any = await Database.from(
        "EmailOtp_Authentication"
      )
        .select("*")
        .where("orgId", Orgid)
        .andWhere("empId", Empid);

      const affected_rows = selectEmailOtp_Auth.length;
      if (affected_rows >0) 
      {
       
        const updateEmaiOTPEmail = await Database.from(
          "EmailOtp_Authentication"
        )
          .where("orgId", Orgid)
          .andWhere("empId", Empid)
          .update({ email_id: EncodeEmailForCheck, otp: result });
      }
      else
      {
       
            var insertEmailOtp_Authentication = await Database.insertQuery()
                .table("EmailOtp_Authentication")
                .insert({
                  empId: Empid,
                  orgId: Orgid,
                  email_id: EncodeEmailForCheck,
                  otp: result,
                  status: 0,
                });
              Count = insertEmailOtp_Authentication.length;
      }
          if (Count) 
          {
            resresultOTP["resultOTP"] = 1;
            data2.push(resresultOTP);
          }
    } 
    else 
    {
      resresultOTP["resultOTP"] = 0;
      data2.push(resresultOTP);
    }
    return data2;
  }
  









}
