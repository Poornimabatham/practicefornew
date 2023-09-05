import moment from "moment-timezone";  
import Database from "@ioc:Adonis/Lucid/Database";  
import Helper from "App/Helper/Helper";  
  
  
export default class GetAttActualImgService{ 
    public async getImg(reqdata:[]) { 
        const imgObj: string = reqdata['imgObj'];
        const filename: string = imgObj.split('/').pop() || '';
        let bucketForlder: string;
        let imgEmpId: string;
        let newImgUrlObj: string;
        if (imgObj.includes('/public')) {
            bucketForlder = 'public/attendance_images';
            imgEmpId = filename.split('_')[1];
        } else {
            bucketForlder = 'attendance_images';
            imgEmpId = filename.split('_')[0];
        }
        const useThis: string = filename.split('?')[0];
        const conditionAccordingToMultiOrSingleShift: string[] = useThis.split('_');
        if (conditionAccordingToMultiOrSingleShift[0] === 'GrpQR') {
            newImgUrlObj = bucketForlder + "/" + reqdata['orgId'] + "/"+ imgEmpId + "/" + useThis;
        } else {
            newImgUrlObj =  bucketForlder + "/" + reqdata['orgId'] + "/"+ imgEmpId + "/" + useThis;
        }
        return (process.env.ATTENDANCEBUCKET,newImgUrlObj);
        // $data['img']=getPresignedURL(process.env.ATTENDANCEBUCKET,newImgUrlObj);
        // console.log(reqdata);
        //return true;

    }


}