import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import EmployeeValidator from 'App/Validators/EmployeeValidator';
import EmployeeService from 'App/Services/EmployeeService';

export default class EmployeesController {
    private data: any = [];
    public async emplist({ request, response }: HttpContextContract) {
        try{
            const validation = await request.validate(EmployeeValidator.empvalid)
            this.data['orgid'] = validation.refno;
            this.data['adminid'] = validation.empid;
            this.data['status'] = validation.status ? validation.status : 1;
            this.data['currentPage'] = validation.currentPage ? validation.currentPage : 0;
            this.data['perpage'] = validation.perpage ? validation.perpage : 10;
            this.data['searchval'] = validation.searchval ? validation.searchval : '';
            const result = await EmployeeService.prototype.Employeelist(this.data);
            return response.json(result);
        }catch(err){
            response.status(400).send({ Error: "Invalid Request", Name: err })  
        }
    }
    public async deleteEmployee({ request, response }: HttpContextContract) {
        try {
            const validation = await request.validate(EmployeeValidator.deleteemp);
            this.data['empid'] = validation.EmpId;
            this.data['Orgid'] = validation.Orgid;
            this.data['status'] = validation.status;//user status active or Inactive 
            this.data['permission'] = validation.permission; //user,admin,depthead
            this.data['adminid'] = validation.adminid;
            this.data['adminname'] = validation.adminname;
            this.data['empname'] = validation.EmpName;
            
            if (this.data['permission'] == 1) {

                response.status(400).send({ Error: "Permission Denied", Name: "Admin Can't Inactive" })
            } else if (this.data['permission'] == 2) {

                response.status(400).send({ Error: "Permission Denied", Name: "Department Head Can't Inactive" })
            } else {
               
                const result = await EmployeeService.prototype.changests(this.data);
                if (result == true) {
                    response.status(200).send({ Messsage: result, Name: "Updated SuccessFully "})
                }
                if (result == false) {
                    response.status(204).send({ Messsage: result, Name: "Updated UnsuccessFull "})
                }
            }
        } catch (err) {
            response.status(400).send({ Error: err });
        }
    }

    public async EmpDetailUpdate({ request, response }: HttpContextContract) {
        try{
            const validation = await request.validate(EmployeeValidator.EmpDetailUpdate);
            this.data['f_name']= validation.f_name?validation.f_name:'';
            this.data['username']= validation.username ? validation.username.toLowerCase():'';
            this.data['department']=validation.department ? validation.department:'';
            this.data['designation']=validation.designation ? validation.designation:'';
            this.data['shift']=validation.shift ? validation.shift:'';
            this.data['empid'] = validation.empid;
            this.data['Orgid'] = validation.Orgid;
            this.data['adminid'] = validation.adminid;
            this.data['adminname'] = validation.adminname;
            this.data['empname'] = validation.EmpName;
            const result = await EmployeeService.prototype.EmpDetailUpdate(this.data);
            if (result == true) {
                response.status(200).send({ Messsage: result, Name: "Updated SuccessFully "})
            }
            if (result == false) {
                response.status(204).send({ Messsage: result, Name: "Updated UnsuccessFull "})
            }
        }catch(error){
            response.status(400).send({ Message:"Invalid Request",Error: error });
        }
    }

    ///////////////////permission updated///////////////////////
    public async updateSelfistatus({ request, response }: HttpContextContract) {
        try{
            const validation = await request.validate(EmployeeValidator.selfistatus);
            this.data['empid'] = validation.EmpId;
            this.data['Orgid'] = validation.Orgid;
            this.data['selfistatus'] = validation.selfistatus;//true or false 
            this.data['adminid'] = validation.adminid;
            this.data['adminname'] = validation.adminname;
            this.data['empname'] = validation.EmpName;
            const result = await EmployeeService.prototype.updateSelfistatus(this.data);
            if (result == true) {
                response.status(200).send({ Messsage: result, Name: "Updated SuccessFully "})
            }
            if (result == false) {
                response.status(204).send({ Messsage: result, Name: "Updated UnsuccessFull "})
            }
        }catch(error){
            response.status(400).send({ Message:"Invalid Request",Error: error });
        }
    }
    public async getAllowAttToUser({ request, response }: HttpContextContract) {
        try{
            const validation = await request.validate(EmployeeValidator.allowToPunchAtt);
            this.data['empid'] = validation.EmpId;
            this.data['Orgid'] = validation.Orgid;
            this.data['attRestrictSts'] = validation.allowToPunchAtt;//true or false 
            this.data['adminid'] = validation.adminid;
            this.data['adminname'] = validation.adminname;
            this.data['empname'] = validation.EmpName;
            const result = await EmployeeService.prototype.updateAllowAttToUser(this.data);
            if (result == true) {
                response.status(200).send({ Messsage: result, Name: "Updated SuccessFully "})
            }
            if (result == false) {
                response.status(204).send({ Messsage: result, Name: "Updated UnsuccessFull "})
            }
        }catch(error){
            response.status(400).send({ Message:"Invalid Request",Error: error });
        }
    }
    public async FacePermissionUpdate({ request, response }: HttpContextContract) {
        try{
            const validation = await request.validate(EmployeeValidator.facepermissionSts);
            this.data['empid'] = validation.EmpId;
            this.data['Orgid'] = validation.Orgid;
            this.data['faceRestrictSts'] = validation.faceRestrictSts;//true or false 
            this.data['adminid'] = validation.adminid;
            this.data['adminname'] = validation.adminname;
            this.data['empname'] = validation.EmpName;
            // console.log(this.data);
            // return false;
            const result = await EmployeeService.prototype.FacePermissionUpdate(this.data);
            if (result == true) {
                response.status(200).send({ Messsage: result, Name: "Updated SuccessFully "})
            }
            if (result == false) {
                response.status(204).send({ Messsage: result, Name: "Updated UnsuccessFull "})
            }
        }catch(error){
            response.status(400).send({ Message:"Invalid Request",Error: error });
        }
    }
    public async DevicePermissionUpdate({ request, response }: HttpContextContract) {
        try{
            const validation = await request.validate(EmployeeValidator.Device_Restriction);
            this.data['empid'] = validation.EmpId;
            this.data['Orgid'] = validation.Orgid;
            this.data['DeviceRestrictSts'] = validation.Device_Restriction_sts;//true or false 
            this.data['adminid'] = validation.adminid;
            this.data['adminname'] = validation.adminname;
            this.data['empname'] = validation.EmpName;
            const result = await EmployeeService.prototype.DevicePermissionUpdate(this.data);
            if (result == true) {
                response.status(200).send({ Messsage: result, Name: "Updated SuccessFully "})
            }
            if (result == false) {
                response.status(204).send({ Messsage: result, Name: "Updated UnsuccessFull "})
            }
        }catch(error){
            response.status(400).send({ Message:"Invalid Request",Error: error });
        }
    }
    public async FingerPrintPermissionUpdate({ request, response }: HttpContextContract) {
        try{
            const validation = await request.validate(EmployeeValidator.FingerPrint);
            this.data['empid'] = validation.EmpId;
            this.data['Orgid'] = validation.Orgid;
            this.data['DeviceRestrictSts'] = validation.Device_Restriction_sts;//true or false 
            this.data['FingerPrintSts'] = validation.Finger_Print_sts;//true or false 
            this.data['adminid'] = validation.adminid;
            this.data['adminname'] = validation.adminname;
            this.data['empname'] = validation.EmpName;
            const result = await EmployeeService.prototype.fingerPrintPermissionUpdate(this.data);
            if (result == true) {
                response.status(202).send({ Messsage: result, Name: "Updated SuccessFully "})
            }
            if (result == false) {
                response.status(204).send({ Messsage: result, Name: "Updated UnsuccessFull "})
            }
        }catch(error){
            response.status(400).send({ Message:"Invalid Request",Error: error });
        }
    }
    ///////////////////permission updated End///////////////////////
}
