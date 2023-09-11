export default class Addonservice{
    public static async free_addon_three_days(data){
        const orgid = data.refno ? data.refno : 0;
        const AdminId = data.uid ? data.uid : 0;
        const addon = data.name ? data.name : 0;
        const orgname = await Helper.getOrgName(orgid);


        return data;
       
        
        
    }
}