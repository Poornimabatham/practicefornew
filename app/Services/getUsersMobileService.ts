import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";

export default class getUsersMobile{
    constructor(){}
   
        public static async getUsersMobile(data:any){
            console.log(data);
            const orgid = data.refno;
            const empid = data.empid;
            const pagename = data.pagename ? data.pagename : '';
            const currentPage = data.currentPage ? data.currentPage : 0;
            const perPage = data.perPage ? data.perPage : 0;
            let searchText = data.searchText ? data.searchText : '';
            const begin = (currentPage-1) * perPage;
            let limitBy:any;
            if(currentPage != 0  && pagename == 'EmployeeDirectoryList')
            {
                limitBy="limit" + begin+','+ perPage;
            }
            if(searchText != ""){
                searchText="and FirstName LIKE '%$searchText%'";
                limitBy="";
            }
            const adminstatus =await Helper.getAdminStatus(empid);
           
            let cond = "";
            if(adminstatus == 2)
            {
                const dptid = await Helper.getDepartmentIdByEmpID(empid);
                cond = " AND Department = "+dptid ;
            }
            const query = await Database.query().select('E.Id','FirstName','LastName','Department as DepartmentId',Database.raw(`(select Name from DepartmentMaster where Id=E.Department) as Department`),'Designation as DesignationId',Database.raw('(select Name from DesignationMaster where Id = E.Designation) as Designation'), 'Shift as ShiftId',  'VisibleSts as archive','Username as Email',Database.raw('(select countrycode from CountryMaster where Id IN (select CurrentCountry from EmployeeMaster where EmployeeMaster.Id=U.EmployeeId)) as CountryCode'),'username_mobile as mobile,Password','appSuperviserSts as admin','ImageName','U.Selfie as Selfie','U.Device_Restriction as Device_Restriction','U.Finger_Print as Finger_Print','U.Face_Id as Face_Id','U.QR_code as QR_code').from('EmployeeMaster as E')
            .innerJoin("UserMaster as U", "U.EmployeeId", "E.Id").where('VisibleSts',1).andWhere('E.OrganizationId',orgid).andWhere('U.archive',1).andWhere('E.archive',1).andWhere('Is_Delete',0).andWhere(Database.raw('U.OrganizationId = E.OrganizationId')).whereRaw(cond).whereRaw(searchText).orderBy('FirstName',limitBy);
            let res:any[] = [];


          
          await Promise.all(query.map(async (row)=>{

            let adata  ={};
                adata['Id']=row.Id;
                adata['CountryCode']=row.CountryCode;
                let firstName = row.FirstName.trim();
                firstName = firstName.replace(/\s\s+/g, ' '); // Replace multiple spaces with a single space
                let lastName = row.LastName.trim() ? row.LastName.trim() : '';
                const fullName = `${firstName} ${lastName}`;
                let formattedFullName = '';
                if(lastName != ''){
                    console.log(firstName+ '-' +lastName);
                    
                    formattedFullName = fullName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
                }else{
                    formattedFullName = fullName;
                }
                
                adata['name'] = formattedFullName;  
                let Department = row.Department ? row.Department : '';
                if(Department == '')
                {
                    adata['Department']='-';
                }else{
                    adata['Department']= row.Department;
                }
                if(row.Designation == ''){
                    adata['Designation']='-';
                }else{
                    adata['Designation']=row.Designation;
                }
                adata['Shift']=await Helper.getShiftByEmpID(row.Id);
                adata['DepartmentId']= row.DepartmentId;
                adata['DesignationId']=row.DesignationId;
                adata['ShiftId'] = row.ShiftId;
                adata['archive']=row.archive;
                if(row.Email != '' && row.Email != undefined){
                    adata['Email']= Helper.decode5t(row.Email);
                }else{
                    adata['Email']= row.Email ? row.Email :'';
                }
                if(row.mobile != '' && row.mobile != undefined){
                    adata['Mobile']= Helper.decode5t(row.mobile);
                }else{
                    adata['Mobile']= row.mobile ? row.mobile :0;
                }
                
                adata['Admin']= row.admin;
                if(row.Password != '' && row.Password != undefined){
                    adata['Password']=Helper.decode5t(row.Password);
                }else{
                    adata['Password']= row.Password ?  row.Password : '' ;
                }
                
                const imageName = row.ImageName;
                const profileImageUrl = imageName === '' 
                    ? 'http://ubiattendance.ubihrm.com/assets/img/avatar.png' 
                    : 'https://ubihrmimages.s3.ap-south-1.amazonaws.com/'+orgid+'/'+imageName;
                adata['Profile']= profileImageUrl;
               
                adata['Selfie'] = row.Selfie;
                adata['Finger_Print'] = row.Finger_Print;
                adata['Device_Restriction'] = row.Device_Restriction;
                adata['Face_Id'] = row.Face_Id;
                adata['QR_code'] = row.QR_code;
                const query1 = await Database.query().from('licence_ubiattendance').select('*').where('OrganizationId',orgid);
                query1.forEach((row1)=>{
                    adata['AddonFaceRecognition']= row1.Addon_FaceRecognition;
                })
                res.push(adata)
            })
          )
            return res;
           
           
           
    }
}