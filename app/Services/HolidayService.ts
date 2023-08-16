import Database from "@ioc:Adonis/Lucid/Database";
import moment from "moment-timezone";
import Helper from "App/Helper/Helper";

export default class HolidayService {
  static async Holidayfetch(OrgId) { 

  const currentPage = 2;
  const perPage = 10;
  const begin = (currentPage - 1) * perPage;
  
  const FetchHolidays = Database.query()
  .from("HolidayMaster")
  .select("Id","Name","Description","DateTo","OrganizationId",
    Database.raw("DATE(DateFrom) AS fromDate"),
    Database.raw("DATEDIFF(DATE(DateTo),DATE(DateFrom))   AS DiffDate"),"DateFrom")
  .where("OrganizationId",OrgId.OrgId).orderBy("fromDate", "asc")
  .limit(perPage).offset(begin)

  interface DefineTypes{
   Id:number,
   Name:string,
   Description:string,
   OrgnisationId:number,
   fromDate:String,
   DiffDate:Date,
   DateTo:String,
  }
  const res : DefineTypes[]=[];

  const FetchData = await FetchHolidays
  FetchData.forEach(function (val){
 
  const FromDate:string =  (moment(val.DateFrom).format("YYYY/MM/DD"))
  const DateTo:String= moment(val.DateTo).format("YYYY/MM/DD")

  const CheckData:DefineTypes = {
    Id:val.Id,
    Name:val.Name,
    Description:val.Description,
    OrgnisationId:val.OrganizationId,
    fromDate:FromDate,
    DiffDate:val.DiffDate,
    DateTo:DateTo
  }
   res.push(CheckData);
  });
   return res;
  }

static async InsertHoliday(get){

const datefrom = new Date(get.DateFrom); 
const dateString = datefrom.toLocaleDateString('en-US'); // Change 'en-US' to your preferred locale
const DateFrom = moment(dateString, 'MM/DD/YYYY').format('YYYY/MM/DD');

const dateto = new Date(get.DateFrom); 
const dateString2 = dateto.toLocaleDateString('en-US'); 
const DateTo = moment(dateString2, 'MM/DD/YYYY').format('YYYY/MM/DD');

const CurrDate = moment().format("YYYY/MM/DD")

const result = {status:" "};
const existingHoliday = await Database.query()
  .from('HolidayMaster')
  .whereBetween('DateFrom', [DateFrom,DateTo])
  .orWhereBetween('DateTo',[DateFrom,DateTo])
  .andWhere('OrganizationId', get.OrganizationId)
  .first()
    
if (existingHoliday){
  result.status = '2'  // Holiday already exists in database
  return(result)
}

const InsertHolidays = await Database
.insertQuery() // 👈 gives an instance of insert query builder.
.table('HolidayMaster')
.insert({Name:get.Name, Description:get.Description, OrganizationId:get.OrganizationId,CreatedById:get.EmpId,
  CreatedDate:CurrDate, DivisionId:0, LastModifiedDate:CurrDate, LastModifiedById:get.EmpId,DateFrom:DateFrom, DateTo:DateTo,FiscalId:1})

if(InsertHolidays.length > 0){
               
const zone = await Helper.getTimeZone(get.OrganizationId);
  
const timezone = zone;
const date = moment().tz(timezone).toDate();
const uid = get.empid;
const EmpName = await Helper.getempnameById(get.EmpId);
const module = 'Attendance app';
const activityBy = 1
const appModule = 'Holiday';
const actionperformed = `${get.Name} holiday has been created by ${EmpName} from Attendance App`;
  
await Database.insertQuery()
  .table('ActivityHistoryMaster')
  .insert({
    LastModifiedDate: date,
    LastModifiedById: uid,
    module: module,
    ActionPerformed: actionperformed,
    OrganizationId: get.OrganizationId,
    activityBy: activityBy,
    adminid: uid,
    appmodule: appModule,
  });

return 'Activity history inserted successfully';
}else{
   return'Error inserting activity history';
  }
 }
}

