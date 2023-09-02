import Database from "@ioc:Adonis/Lucid/Database";
import moment from "moment-timezone";
import Helper from "App/Helper/Helper";

export default class HolidayService {
  static async Holidayfetch(OrgId) { 

  // const currentPage = 2;
  // const perPage = 10;
  // const begin = (currentPage - 1) * perPage;
  const CurrYear = moment().format("yyyy")
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;   // Calculate the next year
  const startfiscaldate = "04-01"
  const endfiscaldate = "03-31"
  
  const startfiscalyear =  CurrYear +"-"+ startfiscaldate ; // concat CurrYear with startfiscaldate
  const endfiscalyear = nextYear +"-"+ endfiscaldate;  // concat nextYear with endfiscaldate
  
  const FetchHolidays = Database.query()
  .from("HolidayMaster")
  .select("Id","Name","Description","DateTo","OrganizationId",
    Database.raw("DATE(DateFrom) AS fromDate"),
    Database.raw("DATEDIFF(DATE(DateTo),DATE(DateFrom))   AS DiffDate"),"DateFrom")
  .where("OrganizationId",OrgId.OrgId)
  .whereBetween("DateFrom",[startfiscalyear,endfiscalyear])
  .whereBetween("DateTo",[startfiscalyear,endfiscalyear])
  .orderBy("fromDate", "asc")
  // .limit(begin)
  
  interface DefineTypes {
    Id: string;
    Name: string;
    Description: string;
    OrgnizationId: string;
    fromDate: String;
    fromDateFormat: string;
    DiffDate: string;
    DateTo: String;
    DateToFormat: string
  }
  const res : DefineTypes[]=[];

  const FetchData = await FetchHolidays
  FetchData.forEach(function (val){
 
  const FromDate: string = (moment(val.DateFrom).format("YYYY/MM/DD"))
  const fromDateFormat: string = moment(val.DateFrom).format("YYYY-MM-DD");
  const DateTo: string = moment(val.DateTo).format("YYYY/MM/DD");
  const DateToFormat: string = moment(val.DateTo).format("YYYY-MM-DD");

  const CheckData: DefineTypes = {
    Id: val.Id.toString(),
    Name: val.Name,
    Description: val.Description,
    OrgnizationId: val.OrganizationId.toString(),
    fromDate: FromDate,
    fromDateFormat: fromDateFormat,
    DiffDate: val.DiffDate.toString(
      
    ),
    DateTo: DateTo,
    DateToFormat: DateToFormat,
  };
   res.push(CheckData);
  });
   return res;
  }
///////// addHoliday ////////
static async InsertHoliday(get) {
const datefrom = new Date(get.from); 
const dateString = datefrom.toLocaleDateString('en-US'); // Change 'en-US' to your preferred locale
const DateFrom = moment(dateString, 'MM/DD/YYYY').format('YYYY/MM/DD');
const dateto = new Date(get.to); 
const dateString2 = dateto.toLocaleDateString('en-US'); 
const DateTo = moment(dateString2, 'MM/DD/YYYY').format('YYYY/MM/DD');
const CurrDate = moment().format("YYYY/MM/DD")
const result = {};
const existingHoliday = await Database.query()
  .from('HolidayMaster')
  .select( Database.raw(
    "DATE_FORMAT(DateFrom,'%Y-%m-%d') as DateFrom"
  ),
  Database.raw(
    "DATE_FORMAT(DateTo,'%Y-%m-%d') as DateTo"
  ))
  .whereBetween('DateFrom', [DateFrom,DateTo])
  .andWhereBetween('DateTo',[DateFrom,DateTo])
  .andWhere('OrganizationId', get.org_id)
  .first()

if (existingHoliday){
  result["status"] = '2'  // Holiday already exists in database
  return(result)
}

const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;   // Calculate the next year
const endfiscaldate = "03-31"
const endfiscalyear = nextYear +"-"+ endfiscaldate;  // concat nextYear with endfiscaldate

var additionalInsert;
var additionalInsert2;
if(DateFrom == CurrDate || DateFrom > CurrDate && DateFrom < endfiscalyear ){
   additionalInsert = {DateFrom:DateFrom}
   var dateF = additionalInsert.DateFrom;
 }else{
  return "You cant add holiday with past date"; 
 }
 if(DateTo == CurrDate || DateTo > CurrDate && DateTo < endfiscalyear){

   additionalInsert2 = {DateTo:DateTo}
   var dateT = additionalInsert2.DateTo;
 }else{
  return "You cant add holiday with past date";
 }

var InsertHolidays = await Database.insertQuery() // 👈 gives an instance of insert query builder.
  .table("HolidayMaster")
  .insert({
    Name: get.name,
    Description: get.description,
    OrganizationId: get.org_id,
    CreatedById: get.empid,
    CreatedDate: CurrDate,
    DivisionId: 0,
    LastModifiedDate: CurrDate,
    DateFrom: dateF,
    DateTo: dateT,
    LastModifiedById: get.empid,
    FiscalId: 1,
  });

  if(InsertHolidays.length > 0){
               
    const zone = await Helper.getTimeZone(get.org_id);
    const timezone = zone;
    const date = moment().tz(timezone).toDate();
    
    const uid = get.empid;  
    const EmpName = await Helper.getempnameById(get.empid);
  
    const module = 'Attendance app';
    const activityBy = 1
    const appModule = 'Holiday';
    const actionperformed = `<b>${get.name}</b>holiday has been created by<b>${EmpName}</b>from Attendance App`;
      
    await Database.insertQuery()
      .table('ActivityHistoryMaster')
      .insert({
        LastModifiedDate: date,
        LastModifiedById: uid,
        module: module,
        ActionPerformed: actionperformed,
        OrganizationId: get.org_id,
        activityBy: activityBy,
        adminid: uid,
        appmodule: appModule,
      });
    
    return'Activity history inserted successfully';
}else{
   return'Error inserting activity history';
  }
 }
}

