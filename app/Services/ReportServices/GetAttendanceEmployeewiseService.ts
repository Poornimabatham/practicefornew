import moment from "moment-timezone";  
import Database from "@ioc:Adonis/Lucid/Database";  
import Helper from "App/Helper/Helper";  
  
  
export default class GetAttendanceEmployeewiseService{ 
 
    public async getPresentList(reqdata:[]) { 
        let csv=reqdata['csv'];
        const zone = await Helper.getTimeZone(reqdata['Orgid']);  
        const currentDateTime = moment().tz(zone).format('YYYY-MM-DD');         
        const date =  moment(new Date()).format('YYYY-MM-DD');   
        const edate = moment(new Date()).subtract(30, 'days').format('YYYY-MM-DD');//date('Y-m-d',-30);   
        let getPresentListQuery:any = await  Database.query().  
        select('AttendanceDate','latit_in','longi_in','latit_out','longi_out','Id','TotalLoggedHours','AttendanceStatus','ShiftId','multitime_sts',Database.raw(`IF((SELECT Count(id) FROM InterimAttendances WHERE AttendanceMasterId=Id) > 0,'true','false') as  getInterimAttAvailableSts`),  
        Database.raw(`SUBSTR(TimeIn, 1, 5) as TimeIn,SUBSTR(TimeOut, 1, 5) as TimeOut,SUBSTR(checkInLoc, 1, 40) as checkInLoc,SUBSTR(CheckOutLoc, 1, 40) as CheckOutLoc,SUBSTRING_INDEX(EntryImage, '.com/', -1) as EntryImage, SUBSTRING_INDEX(ExitImage, '.com/', -1) as ExitImage`),Database.raw(`(Select shifttype from ShiftMaster where Id=ShiftId) as shiftType`)).from('AttendanceMaster').where('EmployeeId',reqdata['empid']).andWhere('OrganizationId',reqdata['Orgid']).andWhereBetween('AttendanceDate',[edate,date]).andWhere((query)=>{  
            query.where('AttendanceStatus', '1')  
            .orWhere('AttendanceStatus','3').orWhere('AttendanceStatus','4').orWhere('AttendanceStatus','5').orWhere('AttendanceStatus','8').orWhere('AttendanceStatus','10')  
        }).orderBy('AttendanceDate', 'desc')
        if(csv == 'No_Csv'){
            getPresentListQuery  = getPresentListQuery.limit(reqdata['perpage']).offset(reqdata['currentPage']); 
            
        }
     
        const result:any=[]; 
        if(getPresentListQuery.length > 0){ 
              
            const quer = await getPresentListQuery.forEach(row => {  
                const data: any = {};  
                data['AttendanceDate'] =   moment(row.AttendanceDate).format('YYYY-MM-DD');    
                data['AttendanceStatus'] =  row.AttendanceStatus;    
                data['TimeIn'] =  row.TimeIn;  
                data['shiftType']  =  row.shiftType;  
                data['MultipletimeStatus'] =  row.multitime_sts;  
                data['TimeOut'] =  row.TimeOut;  
                data['checkInLoc']  =   row.checkInLoc;  
                data['CheckOutLoc']  =   row.CheckOutLoc;  
                if(row.EntryImage!='')  
                {   
                 data['EntryImage']  =  process.env.BUCKETIMGPATHCDN+row.EntryImage;  
                }  
                else  
                {  
                 data['EntryImage']  = row.EntryImage;  
                }  
  
                if(row.ExitImage!='')  
                {  
                 data['ExitImage']  =   process.env.BUCKETIMGPATHCDN + row.ExitImage;  
                }  
                else  
                {  
                 data['ExitImage']  =   row.ExitImage;  
                }  
                data['latit_in']  =  row.latit_in;  
                data['longi_in']  =  row.longi_in;  
                data['latit_out']  =  row.latit_out;  
                data['longi_out']  =  row.longi_out;  
                data['Id']  =   row.Id;  
                data['getInterimAttAvailableSts'] = row.getInterimAttAvailableSts; 
                data['TotalLoggedHours']  =  row.TotalLoggedHours;  
                //console.log(data);
                result.push(data); 
            });  
           
            return result; 
  
        }else{  
            return 0;  
        }  
  
    }  
    public async getabsentList(reqdata:[]) {  
         
        let csv=reqdata['csv'];
        const zone = await Helper.getTimeZone(reqdata['Orgid']);  
        const currentDateTime = moment().tz(zone).format('YYYY-MM-DD');      
       
        const date =  moment(new Date()).format('YYYY-MM-DD');   
        const edate = moment(new Date()).subtract(30, 'days').format('YYYY-MM-DD');//date('Y-m-d',-30);   
        let absentListquery:any =  await Database.query().  
        select('AttendanceDate',Database.raw(`'-' as TimeIn,'-' as TimeOut`)).from('AttendanceMaster').where('EmployeeId',reqdata['empid']).andWhere('OrganizationId',reqdata['Orgid']).andWhereBetween('AttendanceDate',[edate,date]).andWhere((query)=>{ query.where('AttendanceStatus', '2').orWhere('AttendanceStatus','7') }).orderBy('AttendanceDate', 'desc')
        if(csv == 'No_Csv'){
            absentListquery  = absentListquery.limit(reqdata['perpage']).offset(reqdata['currentPage']); 
            
        }  
        const result:any=[];   
        if(absentListquery.length > 0){ 
             
            const quer= await absentListquery.forEach(row => {  
                const data: any = {};  
                data['AttendanceDate'] =   moment(row.AttendanceDate).format('YYYY-MM-DD');    
                data['TimeIn'] =  row.TimeIn;  
                data['TimeOut'] =  row.TimeOut;  
                result.push(data); 
            });  
            return result; 
  
        }else{  
            return 0;  
        }  
  
    }  
    public async getlatecomingList(reqdata:[]) {  
        let csv=reqdata['csv'];
        const zone = await Helper.getTimeZone(reqdata['Orgid']);  
        const currentDateTime = moment().tz(zone).format('YYYY-MM-DD');      
          
        const date =  moment(new Date()).format('YYYY-MM-DD');   
        const edate = moment(new Date()).subtract(30, 'days').format('YYYY-MM-DD');//date('Y-m-d',-30);   
        let getLateComingQuery:any =  await Database.query(). 
        select('AttendanceDate','AttendanceStatus','latit_in','longi_in','latit_out','longi_out','Id','TotalLoggedHours','ShiftId','multitime_sts',Database.raw(`IF((SELECT Count(id) FROM InterimAttendances WHERE AttendanceMasterId=Id) > 0,'true','false') as  getInterimAttAvailableSts`),  
        Database.raw(`SUBSTR(TimeIn, 1, 5) as TimeIn,SUBSTR(TimeOut, 1, 5) as TimeOut,SUBSTR(checkInLoc, 1, 40) as checkInLoc,SUBSTR(CheckOutLoc, 1, 40) as CheckOutLoc,SUBSTRING_INDEX(EntryImage, '.com/', -1) as EntryImage, SUBSTRING_INDEX(ExitImage, '.com/', -1) as ExitImage`)).from('AttendanceMaster').where('EmployeeId',reqdata['empid']).andWhere('OrganizationId',reqdata['Orgid']).andWhereBetween('AttendanceDate',[edate,date]) 
        .andWhere(Database.raw(`SUBSTRING(time(TimeIn),1,5) > SUBSTRING((select (CASE WHEN (time(TimeInGrace)!='00:00:00') THEN time(TimeInGrace) ELSE time(TimeIn) END) from ShiftMaster where ShiftMaster.Id= shiftId),1,5)`)).whereIn('AttendanceStatus', [1, 4, 8]).andWhere(Database.raw(`'3' not in (Select shifttype from ShiftMaster where Id=ShiftId)`)).orderBy('AttendanceDate', 'desc');
        if(csv == 'No_Csv'){
            getLateComingQuery  = getLateComingQuery.limit(reqdata['perpage']).offset(reqdata['currentPage']); 
            
        }  
        //console.log(getLateComingQuery.length);

        const result:any=[]; 
        if(getLateComingQuery.length > 0){ 
              
            for (const row of getLateComingQuery) {  
                const data: any = {};  
                data['AttendanceDate'] =   moment(row.AttendanceDate).format('YYYY-MM-DD');    
                data['AttendanceStatus'] =  row.AttendanceStatus;    
                data['TimeIn'] =  row.TimeIn;  
                data['shiftType']  = await Helper.getShiftType(row.ShiftId);  
                data['multitime_sts'] =  row.multitime_sts;  
                data['TimeOut'] =  row.TimeOut;  
                data['checkInLoc']  =   row.checkInLoc;  
                data['CheckOutLoc']  =   row.CheckOutLoc;  
                if(row.EntryImage!='')  
                {   
                 data['EntryImage']  =  process.env.BUCKETIMGPATHCDN+row.EntryImage;  
                }  
                else  
                {  
                 data['EntryImage']  = row.EntryImage;  
                }  
  
                if(row.ExitImage!='')  
                {  
                 data['ExitImage']  =   process.env.BUCKETIMGPATHCDN + row.ExitImage;  
                }  
                else  
                {  
                 data['ExitImage']  =   row.ExitImage;  
                }  
                data['latit_in']  =  row.latit_in;  
                data['longi_in']  =  row.longi_in;  
                data['latit_out']  =  row.latit_out;  
                data['longi_out']  =  row.longi_out;  
                data['AttId']  =   row.Id;  
                data['getInterimAttAvailableSts'] = row.getInterimAttAvailableSts; 
                data['TotalLoggedHours']  =  row.TotalLoggedHours;  
                //console.log(result);  
                result.push(data); 
            }
           
            return result; 
  
        }else{  
            return 0;  
        }  
  
    } 
    public async getEarlyleavingsList(reqdata:[]) {  
        let csv=reqdata['csv'];
        const zone = await Helper.getTimeZone(reqdata['Orgid']);  
        const currentDateTime = moment().tz(zone).format('YYYY-MM-DD');      
        
        const date =  moment(new Date()).format('YYYY-MM-DD');   
        const edate = moment(new Date()).subtract(30, 'days').format('YYYY-MM-DD');//date('Y-m-d',-30);   
        let getEarlyLeavingListQuery:any = await Database.query().select('A.ShiftId', 'A.EmployeeId', 'A.AttendanceDate','S.TimeIn as SIn','S.TimeOut as Sout','S.shifttype as stype').from('AttendanceMaster as A')
        .innerJoin('ShiftMaster as S','S.Id','A.ShiftId') 
        .where('A.EmployeeId', reqdata['empid']).whereBetween('A.AttendanceDate', [edate, date]).where('A.TimeIn', '!=', '00:00:00').where('A.TimeOut', '!=', '00:00:00').andWhereIn('A.AttendanceStatus',[1,3,4,5,8]).andWhere('S.OrganizationId',reqdata['Orgid']).andWhere('A.OrganizationId',reqdata['Orgid']).andWhere('S.shifttype','<>','3').orderBy('A.AttendanceDate', 'desc')

        if(csv == 'No_Csv'){
            getEarlyLeavingListQuery  = getEarlyLeavingListQuery.limit(reqdata['perpage']).offset(reqdata['currentPage']); 
            
        }  

       
        if(getEarlyLeavingListQuery.length > 0){ 
            const result:any[] = [];
            for (const row of getEarlyLeavingListQuery) { 
                let Empname =  await Helper.getempnameById(row.EmployeeId);  
                const AttDate = moment(row.AttendanceDate).format('YYYY-MM-DD');  
                var shiftout='';
                shiftout=  AttDate + ' ' + row.Sout;
                 if(row.stype == 2){ 
                    const nextdate = moment(AttDate).add(1, 'days').format('YYYY-MM-DD');//date('Y-m-d',-30);  
                    shiftout =  nextdate + ' ' + row.Sout;    
                } 
                let shift= row.SIn.substring(0,5) + "-" + row.Sout.substring(0,5); 
                    let getDataEarlyleave:any =  await Database.query(). 
                    select('A.AttendanceDate','A.latit_in','A.longi_in','A.latit_out','A.longi_out','A.Id','A.TotalLoggedHours','A.ShiftId','A.multitime_sts',  
                    Database.raw(`SUBSTR(A.TimeIn, 1, 5) as TimeIn,SUBSTR(A.TimeOut, 1, 5) as TimeOut,SUBSTR(A.checkInLoc, 1, 40) as checkInLoc,SUBSTR(A.CheckOutLoc, 1, 40) as CheckOutLoc,SUBSTRING_INDEX(A.EntryImage, '.com/', -1) as EntryImage, SUBSTRING_INDEX(A.ExitImage, '.com/', -1) as ExitImage`)).from('AttendanceMaster as A').where('A.EmployeeId',reqdata['empid']).andWhere('A.OrganizationId',reqdata['Orgid']).andWhere('A.AttendanceDate',AttDate).andWhere(Database.raw(`(SUBSTRING(time(A.TimeOut),1,5)  < SUBSTRING((select (CASE WHEN (time(S.TimeOutGrace)!='00:00:00') THEN time(S.TimeOutGrace) ELSE time(TimeOut) END) from ShiftMaster as S where S.Id= shiftId and S.OrganizationId=A.OrganizationId),1,5))`));
                    if(getDataEarlyleave.length > 0 ){ 
                        const data: any = {}; 
                         const Emptimeout = getDataEarlyleave[0].TimeOut+":00"
                        const shiftout =   row.Sout;
                        const {hours, minutes, seconds} = Helper.calculateOvertime(Emptimeout,shiftout)
                         data['earlyby'] = hours+":"+ minutes+":"+seconds;
                         data['timeout'] =  getDataEarlyleave[0].TimeOut.substring(0,5);
                         data['name']  =  Empname ; 
                         data['shift'] =  shift; 
                         data['TimeIn']  =      getDataEarlyleave[0].TimeIn; 
                         data['TimeOut']  =   getDataEarlyleave[0].TimeOut; 
                         data['CheckOutLoc']  =   getDataEarlyleave[0].CheckOutLoc; 
                         data['checkInLoc']  =   getDataEarlyleave[0].checkInLoc; 
                         data['latit_in']  =   getDataEarlyleave[0].latit_in; 
                         data['longi_in']  =   getDataEarlyleave[0].longi_in; 
                         data['latit_out']  =   getDataEarlyleave[0].latit_out; 
                         data['AttId']  =   getDataEarlyleave[0].Id; 
                         data['multitime_sts']  =   getDataEarlyleave[0].multitime_sts; 
                         data['shiftType']  =  await Helper.getShiftType(getDataEarlyleave[0].ShiftId);
                         const InterimSts = await Helper.getInterimAttAvailableSt(getDataEarlyleave[0].Id);
                         if(InterimSts != 0){
                            data['getInterimAttAvailableSts']  =true;
                         }else{
                            data['getInterimAttAvailableSts']  = false;
                         }
                         data['TotalLoggedHours']  =  getDataEarlyleave[0].TotalLoggedHours; 
 
                         if( getDataEarlyleave[0].EntryImage!='') 
                       { 
                         data['EntryImage']  =   process.env.BUCKETIMGPATHCDN + getDataEarlyleave[0].EntryImage; 
                       } 
                       else 
                       { 
                         data['EntryImage']  =  getDataEarlyleave[0].EntryImage; 
                       } 
  
                       if( getDataEarlyleave[0].ExitImage!='') 
                       { 
                         data['ExitImage']  =  process.env.BUCKETIMGPATHCDN + getDataEarlyleave[0].ExitImage; 
                       } 
                       else 
                       { 
                         data['ExitImage']  =   getDataEarlyleave[0].ExitImage; 
                       } 
                         data['longi_out']  =   getDataEarlyleave[0].longi_out; 
                         data['AttendanceDate']  =  AttDate; 
                        result.push(data); 
                    }      
            }
            return result;
        }else{  
            return 0;  
        }  
  
    } 
  
}  


