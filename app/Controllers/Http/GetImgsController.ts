import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GetAttActualImgService from 'App/Services/GetAttActualImg';
import GetImgValidator from 'App/Validators/GetImgValidator';
export default class GetImgsController {
    private data: any = [];
    public async GetAttActualImgs({ request, response }: HttpContextContract) {
        try{
            //console.log(request.all())
            const validation = await request.validate(GetImgValidator.getImg)
                this.data['imgObj']=validation.imgObj?validation.imgObj:'';
                this.data['orgId']=validation.orgId
                this.data['empId']=validation.empId?validation.empId:0;
                this.data['date']=validation.date    
                const result = await GetAttActualImgService.prototype.getImg(this.data);
                if(result.length > 0){
                    response.status(200).send(result);
                }
        }catch(err){
            console.log(err)

        }

    }
    public async GetVisitActualImgs({ request, response }: HttpContextContract) {
        try{
            //console.log(request.all())
            const validation = await request.validate(GetImgValidator.getImg)
                this.data['imgObj']=validation.imgObj?validation.imgObj:'';
                this.data['orgId']=validation.orgId
                this.data['empId']=validation.empId?validation.empId:0;
                this.data['date']=validation.date    
                const result = await GetAttActualImgService.prototype.getImgForVisit(this.data); 
                if(result.length > 0){
                    response.status(200).send(result);
                }
                
        }catch(err){
            console.log(err)

        }

    }



}
