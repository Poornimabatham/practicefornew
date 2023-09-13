import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import { DateTime } from "luxon";

export default class Addonservice{
    public static async free_addon_three_days(data :any){
        const orgid = data.refno ? data.refno : 0;
        const AdminId = data.uid ? data.uid : 0;
        const addon = data.name ? data.name : 0;
        const orgname = await Helper.getOrgName(orgid);
        let result :any = {};
        var res :any =0;
        let addon_future_enddate = data.today ? data.today : 0;
        if(addon_future_enddate == 0){
            const today1 = DateTime.now().toFormat('yyyy-MM-dd');
            const inputDate = DateTime.fromISO('2023-09-11');
            // Add three days
            const resultDate = inputDate.plus({ days: 3 });
            addon_future_enddate = resultDate.toFormat('yyyy-MM-dd');
            
            
        }
        let Addon_BulkAttn = 0
        const attendanceaddon = 0;
        const advancevisit = 0;
        const basicleave = 0;
        const facerecog = 0;
        const geofence = 0;
        const livelocationtracking = 0;
        const shiftplanner = 0;
        const visitpunch = 0;
        const freestatus=0;
        const created_date = DateTime.now().toFormat('yyyy-MM-dd');
        const addon_invoice_id='0';
        const order_id='adminpanel';
        const payment_id='adminpanel';
        const addon_amount='adminpanel';
        const currency='adminpanel';
        const query123 :any = await Database.query().from('addons_master').select('Free_Trial_Status').where('OrganizationId',orgid).andWhere('Free_Trial_Status',1);
        const count123 = query123.length;
        if(count123 < 3){
            result['status'] = 'false';
        }else{
            
            const query22 = await Database.query().from('Paid_addon_name').select('addon_name').where(Database.raw(' name Like "%'+addon+'%"')).limit(1);
            let addon_name :string = '';
            const count22 = query22.length;
            if(count22){
                addon_name = query22[0].addon_name;
            }
            // Define a mapping object for addon names to their respective variables
                const addonMapping = {
                    'Addon_BulkAttn': 'Addon_BulkAttn',
                    'Addon_advancevisit': 'Addon_advancevisit',
                    'Addon_BasicLeave': 'Addon_BasicLeave',
                    'Addon_FaceRecognition': 'Addon_FaceRecognition',
                    'Addon_GeoFence': 'Addon_GeoFence',
                    'addon_livelocationtracking': 'addon_livelocationtracking',
                    'Addon_ShiftPlanner': 'Addon_ShiftPlanner',
                    'Addon_VisitPunch': 'Addon_VisitPunch',
                };
        
            // Check if addon_name exists in the mapping and assign the corresponding value
            const query1234 :any = await Database.query().from('addons_master').select('Free_Trial_Status').where('OrganizationId',orgid).andWhere('Free_Trial_Status',1).whereILike('Addon_Name','%'+addonMapping[addon_name]+'%');
            const count1234 = query1234.length;
            const selectedAddon = addonMapping[addon_name];
            if (selectedAddon !== undefined && count1234 <= 0) 
            {
                res = [selectedAddon];
                // Use the selectedAddon value as needed
                const query1 :any= await Database.table('addons_master').returning('id').insert({
                    "Addon_name" : selectedAddon,"OrganizationId" : orgid,"created_date" : created_date,"end_date" :addon_future_enddate ,"PaymentInvoiceid" : addon_invoice_id,"Order_id" : order_id,"Payment_id" :payment_id ,"addon_amount" : addon_amount,"Currency" : currency,"Free_Trial_Status" : 1,
                })
                const query33 : any= await Database.query().from('licence_ubiattendance').where('OrganizationId',orgid).update({
                    [selectedAddon] : 1
                })
            
                if(query33 > 0){
                    result['status'] = [selectedAddon];
                    const zone = await Helper.getEmpTimeZone(AdminId, orgid);
                    const defaultZone = DateTime.now().setZone(zone);
                    const admin = await Helper.getempnameById(AdminId);
                    const endDateNew = DateTime.now().toFormat('MMMM d, yyyy');
                    const module = "Addon";
                    const actionperformed = "Free trial for the Add-on <b>"+`${addon}`+"</b> has been activated till <b>"+`${endDateNew}`+"</b> by "+`${admin}`+"</b>";
                    const activityby = 1;  
                    const activityhistory = await Helper.ActivityMasterInsert(created_date,
                        orgid,
                        AdminId,
                        activityby,
                        module,
                        actionperformed,
                        module);
                        result['status'] = 'true';

                }else{
                    result['status'] = 'No Updates';
                }
                
            // console.log(`Selected Addon: ${selectedAddon}`);
            } else{
                result['status'] = 'false';
              
            }
                
        }
        return result; 
    }
}