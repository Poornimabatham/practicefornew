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
    var EncodeEmailForCheck = Helper.encode5t(EmailId);

    const data2: any[] = [];

    const resresultOTP = {};
    const nameQuery = await Database.from("EmployeeMaster")
      .select("*")
      .where("Id", Empid);

    var fName: string = "";
    var lName: string = "";
    var name = "";
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
    const n = 10; // Change this to your desired length
    const generator = "1357902468";

    let result = "";

    for (let i = 1; i <= n; i++) {
      const randomIndex = Math.floor(Math.random() * generator.length);
      result += generator.charAt(randomIndex);
    }

    const message = `<html>
    <head>
        <meta http-equiv=Content-Type content="text/html; charset=windows-1252">
        <meta name=Generator content="Microsoft Word 12 (filtered)">
        <style>
            div.ex1
            {
                width: 600px;
                margin: auto;
                border: 2px solid #73AD21;
                padding : 20px;
            }
        </style>  
    </head>  
   
    <body lang=EN-US link=blue vlink=purple>    
        <div class="ex1">
        <h1 style = text-align:center>ubiAttendance: Verify your Email</h1>
        <div class="col-sm-6"><a href="">
        <img src="'.URL1.'assets/img/ubiattendance_logo_rectangle.png" class="img-fluid w-75 w-60 text-center" style="width:30%!important; margin-left: 35%;"></a>
    </div>
        <p style="text-align: left; color : #000000" class="paragraph-text"> <b> Hi '.${name}.',</b>
         <p>Please enter the Verification Code below to verify your Email ID. The code is only valid for 10 minutes.</p>
         <p style="color: #06D0A8; font-size: 24px; font-family: monospace;">'.${result}.'</p>
         <p> Please don\'t share your verification Code with anyone.</p>
        <p style="color:#FFA319; font-weight: bold; font-size: 16px;">Cheers,<br/>
        ubiAttendance Team</p>
        </p>
</div>  
                    </body>  
                    </html>`;

    var headers = "";
    var subject = "ubiAttendance- Email verification";

    var mailresponse = null;
    if (mailresponse == null) {
      const selectEmailOtp_Auth: any = await Database.from(
        "EmailOtp_Authentication"
      )
        .select("*")
        .where("orgId", Orgid)
        .andWhere("empId", Empid);

      const affected_rows = selectEmailOtp_Auth.length;
      if (affected_rows > 0) {
        const updateEmaiOTPEmail = await Database.from(
          "EmailOtp_Authentication"
        )
          .where("orgId", Orgid)
          .andWhere("empId", Empid)
          .update({ email_id: EncodeEmailForCheck, otp: result });
      } else {
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
      if (Count) {
        resresultOTP["resultOTP"] = 1;
        data2.push(resresultOTP);
      }
    } else {
      resresultOTP["resultOTP"] = 0;
      data2.push(resresultOTP);
    }
    return data2;
  }
}
