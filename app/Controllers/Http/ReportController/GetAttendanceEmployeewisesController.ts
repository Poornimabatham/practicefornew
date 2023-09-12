import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GetAttendanceEmployeewiseService from 'App/Services/ReportServices/GetAttendanceEmployeewiseService';
import AttendanceValidator from 'App/Validators/AttendanceValidator';


export default class GetAttendanceEmployeewisesController {

    private data: any = [];
    public async getPresentList({ request, response }: HttpContextContract) {
        try{
            
           const validation = await request.validate(AttendanceValidator.presentemplist)
           this.data['Orgid']=validation.refno;
           this.data['empid']=validation.emp;
           this.data['datafor']=validation.datafor.toLowerCase();
           this.data['currentPage']=validation.currentPage?validation.currentPage:0;
           this.data['perpage']= validation.perPage?validation.perPage:10;
           this.data['csv'] = validation.csv ? validation.csv:'No_Csv';
         //console.log(this.data);
            if(this.data['datafor']=='present'){
                const result = await GetAttendanceEmployeewiseService.prototype.getPresentList(this.data);
                if(result == 0){
                    response.status(200).send({Message:"No Data Found"});
                }else{
                    response.status(200).send(result);
                }
            }else if(this.data['datafor'] == 'absent'){
               
                const result = await GetAttendanceEmployeewiseService.prototype.getabsentList(this.data);
                if(result == 0){
                    response.status(200).send({Message:"No Data Found"});
                }else{
                    response.status(200).send(result);
                }
            }else if(this.data['datafor'] == 'latecomings'){
               
                const result = await GetAttendanceEmployeewiseService.prototype.getlatecomingList(this.data);
                if(result == 0){
                    response.status(200).send({Message:"No Data Found"});
                }else{
                    response.status(200).send(result);
                }
            }else if(this.data['datafor'] == 'earlyleavings'){
                const result = await GetAttendanceEmployeewiseService.prototype.getEarlyleavingsList(this.data);
                if(result == 0){
                    response.status(200).send({Message:"No Data Found"});
                }else{
                    response.status(200).send(result);
                }

            }
        }catch(err){
            response.status(400).send({ Error: "Invalid Request", Name: err })  
        }
    }



}