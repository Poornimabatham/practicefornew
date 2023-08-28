import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
export default class SelectCountryCodeService {
    public static async CountryCode(data) { 
       var country_code =data.countrycode;
      var  countryname = data.countryname
     
      
   var  country_code1:any = await Helper.myUrlEncode(country_code)

    const selectcheckCountryCode = await Database.from("CountryMaster").where("countrycode",country_code1).andWhere("Name",countryname).select("*")
  
    return selectcheckCountryCode
    }
}