
import Database from "@ioc:Adonis/Lucid/Database";
import { DateTime } from "luxon";
export default  class ServiceNameService{
  

    static async Fecth(empid){


const shiftid = await this.getShiftIdByEmpID(empid)
const res: { Id: number, Name: string,Timein:DateTime,Timeout:DateTime,shifttype:string,Hoursperday	:number  }[] = [];





const rows = await Database.from('ShiftMaster')
.select('Id', 'Name', 'Timein', 'Timeout', 'shifttype', 'Hoursperday')
.where('Id', shiftid)
 


if (rows.length > 0) {
  rows.forEach((row) =>{  
    const data:any= [];

    data['Id'] = row.Id,
    data['Name'] = row.Name,
  
    data['Timein'] = row.Timein,
    data['Timeout'] = row.Timeout,
    data['shifttype'] = row.shifttype,

    data['Hoursperday'] = row.Hoursperday,

  
  res.push(data['Id'], data['Name'], data['Timein'],  data['Timeout'],data['shifttype'],data['Hoursperday'])
    
  }) 
  return res
}





}





 static async getShiftIdByEmpID(empid) {

return empid

}



}