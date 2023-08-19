import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import moment from "moment";

export default class getEmpdataDepartmentWiseNewService{
  static async getEmpDepartmentWise(req){

  var orgid = req.orgid;
  var zone = await Helper.getTimeZone(req.orgid);
  
  var date = req.date.toFormat("yyyy-MM-dd")
  var currDate = moment().format('YYYY-MM-DD')
  var time = moment().format('HH:mm:ss')
  
  interface DefineTypes{
    Id:number;
    Name:string;
    total:number;
    present:number;
    absent:number;
  }
  var storeData : DefineTypes[] = [];
 
  if(date == currDate){
       
    var QuerytogetEmpData =  Database.from("EmployeeMaster as E")
     .innerJoin("AttendanceMaster as A","E.id","A.Id")
     .innerJoin("DepartmentMaster as D","E.Id"," D.Id")
     .innerJoin("ShiftMaster as S","E.Id","S.Id")
    
    .select("D.Id","D.Name").where("Department","E.Id").where("E.OrganizationId",orgid).where("E.Is_Delete",0).where("E.archive",1).count("E.Id as total")
    
    .where("A.Dept_id","D.Id").whereIn("A.AttendanceStatus",[1,4,8]).where("A.AttendanceDate",date).count("A.Id as present")

    .select("E.Id").where("E.Department","D.Id").where("E.OrganizationId",orgid).where("E.Is_Delete",0).where("E.archive",1)
    .where("A.Dept_id","D.Id").whereIn("A.AttendanceStatus",[1,4,8]).where("A.AttendanceDate",   date)

    .where("S.OrganizationId",orgid).where("S.TimeIn",time).count("E.Id as absent")

  }else{
    var QuerytogetEmpData =  Database.from("EmployeeMaster as E")
    .innerJoin("AttendanceMaster as A","E.id","A.Id")
    .innerJoin("DepartmentMaster as D","E.Id"," D.Id")
    .innerJoin("ShiftMaster as S","E.Id","S.Id")

    .select('E.Id','D.Name').where("Department","D.Id").where("E.Is_Delete",0).where("E.archive",1).count("E.Id as total")

    .where("Dept_id","D.Id").whereIn("A.AttendanceStatus",[1,4,8]).where("A.AttendanceDate",date).count("A.Id as present")
      
    .where("Department","D.Id").where("E.OrganizationId",orgid).where("E.Is_Delete",0).where("E.archive",1)
    .where("A.Dept_id","D.Id").where('A.OrganizationId', orgid).whereIn("AttendanceStatus",[1,4,8]).where("A.AttendanceDate",date).count("E.Id as absent")
  }

  var queryResponse = await QuerytogetEmpData;
  queryResponse.forEach(function(val){
    var Data: DefineTypes={
    Id:val.Id,
    Name:val.Name,
    total:val.total,
    present:val.present,
    absent:val.absent,
    }
     storeData.push(Data)
  })
  return storeData
  
 }
}
