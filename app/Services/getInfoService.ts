import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
export default class getInfoService
{
    constructor(){}
    static async getInfo(alldata)
    { 
       const orgid:number  = alldata.refno;
       const uid:number  = alldata.uid;
       const platform:string  = alldata.platform;
       if(orgid == 0)
       {
          const refid:number  = alldata.refid;
       }
       const zone:number =  await Helper.getEmpTimeZone(uid,orgid);
       console.log(zone);  
       
       return zone
    }
}