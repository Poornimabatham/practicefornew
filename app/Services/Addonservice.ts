import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import { DateTime } from "luxon";

export default class Addonservice{
    public static async free_addon_three_days(data){
        const orgid = data.refno ? data.refno : 0;
        const AdminId = data.uid ? data.uid : 0;
        const addon = data.name ? data.name : 0;
        const orgname = await Helper.getOrgName(orgid);
        let result :any = {};
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
        if(count123 > 3){
            result['status'] = 'false';
            return result;
        }else{

            const query22 = await Database.query().from('Paid_addon_name').select('addon_name').where(Database.raw(' name Like "%'+addon+'%"')).limit(1);
            let addon_name :string = '';
            const count22 = query22.length;
            if(count22){
                addon_name = query22[0].addon_name;
            }
            if(addon_name == 'Addon_BulkAttn'){
                Addon_BulkAttn = 1;
            }else if(addon_name == ''){

            }else if(addon_name == ''){

            }else if
            return query22
        }

       
        return data;
   
        
    }
}