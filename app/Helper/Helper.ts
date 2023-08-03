
const jwt = require("jsonwebtoken");
import Database from "@ioc:Adonis/Lucid/Database";

export default class Helper{

  public static  encode5t(str:any)
    {
        for (let i = 0; i < 5; i++) {
            str = Buffer.from(str).toString('base64');
            str = str.split('').reverse().join('');
          }
          return str;
    }
   public static decode5t(str: string) {
    for (let i = 0; i < 5; i++) {
      str = str.split("").reverse().join("");
      str = Buffer.from(str, 'base64').toString('utf-8');
    }
    return str;
  }
    public static async getTimeZone(orgid: any)
    {
        const query1 = await Database.query().from('ZoneMaster').select('name').where('id', Database.raw(`(select TimeZone from Organization where id =${orgid}  LIMIT 1)`));
        return query1;
        
    }
    public static async getempnameById(empid: number) { 
        const query2 = await Database.query().from('EmployeeMaster').select('FirstName').where('Id', empid); 
        //const FristName = query2[0].FristName;
        return query2[0].FirstName;
        
    }
   public static generateToken(secretKey:string, data:any={}) {
      try{
        const payload={
          audience:data.username,
          Id:data.empid,
         }
         const options={
          expiresIn: "2m",
          issuer:"Ubiattendace App",
         }
        const token = jwt.sign(payload,secretKey,options,{
          "alg": "RS512",
          "typ": "JWT"
        })
        return token;
      }catch(err){
          console.log(err);
          return 0;
      }
  }
}

