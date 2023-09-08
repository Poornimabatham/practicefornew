import moment from "moment";

  
export default class GetAttActualImgService{ 
    public async getImg(reqdata:[]) { 
        const imgObj: string = reqdata['imgObj'];
        const filename: string[]  = imgObj.split('/');
        let orgId:number=0;
        let bucketFolder: string;
        let imgEmpId: string=filename[5];
        let newImgUrlObj: string='';
        let date:string= moment(reqdata['date']).format('YYYY-MM-DD');
        if (imgObj.includes('/public')) {
            bucketFolder = 'public/attendance_images';
            imgEmpId = filename[6];
            orgId=Number(filename[5]);
        } else {
            bucketFolder = 'attendance_images';
            imgEmpId = filename[5];
            orgId=Number(filename[4]);
        }

        if(imgObj){
            const imgObjParts: string[] = imgObj.split('Thumbnail_').slice(-1);
            const imgObjNew: string = imgObjParts.join("Thumbnail_"); 
            const str2: string[] = imgObjNew.split('?');
            const useThis: string = str2[0];
            console.log(useThis);
            //return false;
            const conditionAccordingToMultiOrSingleShift: string[] = useThis.split('_');
            if (conditionAccordingToMultiOrSingleShift[0] === 'GrpQR') {
                newImgUrlObj = bucketFolder + "/" + orgId + "/"+ imgEmpId + "/" + useThis;
            } else {
                newImgUrlObj =  bucketFolder + "/" + orgId + "/"+ imgEmpId + "/" + date + "/" + useThis;
            }
        }
       // console.log(newImgUrlObj);
        return (process.env.ATTENDANCEBUCKET,newImgUrlObj);
        //use Helper Function getPresignedURL
        // $data['img']=getPresignedURL(process.env.ATTENDANCEBUCKET,newImgUrlObj);
        // console.log(reqdata);
        //return true;

    }
    public async getImgForVisit(reqdata:[]) { 
        const imgObj: string = reqdata['imgObj'];
        const imgArray: string[] = imgObj.split('/');
        let imgEmpId: string;
        let bucketFolder: string;
        let newImgUrlObj: string='';

        if (imgObj.includes('/public')) {
            imgEmpId = imgArray[6];
            bucketFolder = 'public/visits/'+ reqdata['orgId']+'/'+imgEmpId+'/';
        } else {
            imgEmpId = imgArray[5];
            bucketFolder = 'visits/'+reqdata['orgId']+'/'+ imgEmpId+ '/';
        }

        if(imgObj){
            const imgObjParts: string[] = imgObj.split('Thumbnail_').slice(-1);
            const imgObjNew: string = imgObjParts.join("Thumbnail_"); 
            const str2: string[] = imgObjNew.split('?');
            const useThis: string = str2[0];
            const conditionAccordingToMultiOrSingleShift: string[] = useThis.split('_');
            if (conditionAccordingToMultiOrSingleShift[0] === 'GrpQR') {
                newImgUrlObj = bucketFolder + useThis;
            } else {
                newImgUrlObj =  bucketFolder + useThis;
            }
            
        }
        return (process.env.ATTENDANCEBUCKET,newImgUrlObj);
        //use Helper Function getPresignedURL
        // $data['img']=getPresignedURL(process.env.ATTENDANCEBUCKET,newImgUrlObj);
        // console.log(reqdata);
        //return true;

    }


}