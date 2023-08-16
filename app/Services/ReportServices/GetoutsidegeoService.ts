import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import moment from "moment-timezone";

export default class GetoutsidegeoService {
  

  public static async getOutsidegeoService(data: any) {
   // console.log(data);
    const seid = data.seid ? data.seid:'';
    const uid = data.uid ?  data.uid : '';
    const orgid = data.orgid ? data.orgid: '';
    const currentPage = data.currentPage ? data.currentPage : '';
    const perPage = data.perPage ? data.perPage : '';
    const begin = (currentPage - 1) * perPage;
    let zone: any = await Helper.getTimeZone(orgid); // to set the timezone by employee country.
      console.log(zone);
      moment.tz.setDefault(zone);
     let date = data.date ?  data.date : Helper.getCurrentDate();
    console.log(date);
  
    const time = new date("H:i:00");
    console.log(time);
  }
}
