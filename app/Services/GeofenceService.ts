import Database from "@ioc:Adonis/Lucid/Database";
import Helper from "App/Helper/Helper";
import { DateTime } from 'luxon'
export default class
  
  getgeofenceservice {
  public static async getgeofence(data) {
    let location: string;
    var begin: number = (data.currentpage - 1) * data.perpage;

    if (data.currentPage != 0 && data.pagename == "getgeofenceList") {
      var limit = data.perPage;
    }
    const query = await Database.from("Geo_Settings")
      .select("Id", "Name", "Location", "Status", "Lat_Long", "Radius")
      .where("OrganizationId", "=", data.OrganizationId)
      .limit(limit)
      .offset(begin);

    interface geofence {
      Id: number;
      Name: string;
      Location: string;
      Status: number;
      Lat_Long: string;
      Radius: number;
    }

    var res: any = [];

    query.forEach((row) => {
      if (row.Location != " ") {
        location = row.Location;
      } else {
        location = row.Name;
      }
      const data: geofence = {
        Id: row.Id,
        Name: row.Name,
        Location: location,
        Status: row.Status,
        Lat_Long: row.Lat_Long,
        Radius: row.Radius,
      };

      res.push(data);
    });

    return res;
  }

  public static async addgeofence(data) {
    var curdate = new Date();
    var archive = 1;
    var Status = 1;
    var result = {};

    const query = await Database.from("Geo_Settings")
      .select("Id")
      .where("Name", "=", data.Name)
      .andWhere("OrganizationId", "=", data.OrganizationId);

    if (query.length > 0) {
      result["status"] = "duplicate";
    } else {
      const query = await Database.insertQuery().table("Geo_Settings").insert({
        Name: data.Name,
        Lat_Long: data.Lat_Long,
        Location: data.Location,
        Radius: data.Radius,
        archive: archive,
        OrganizationId: data.OrganizationId,
        Status: Status,
        LastModifiedById: data.LastModifiedById,
        LastModifiedDate: curdate,
      });
      if (query.length > 0) {
        result["status"] = true;
      } else {
        result["status"] = false;
      }
    }

    return result;
  }

  // ==============addpolygon=============
  public static async addpolygon(data:any){
    
    const Name = data.Name ? data.Name : "";
    const lat_long = data.Lat_Long ? data.Lat_Long :"";
    const Location= data.Location ? data.Location:"";
    const archive="1";
    const LastModifiedById = data.LastModifiedById ? data.LastModifiedById :"";
    const LastModifiedDate = DateTime.local().toFormat('yyyy-MM-dd');
    const OrganizationId=data.OrganizationId ? data.OrganizationId :"";
    console.log(OrganizationId);
    const Status = data.Status;// if geo-fence added radius v/s it will be 1 else polgyon v/s will by 2
    const latilongi = JSON.parse(lat_long);
    let lastInsertedId:number = 0;
    let affected : number = 0
   let result1 = {};
   const row = await Database.query().from('Geo_Settings').select('*').where('Name',Name).andWhere("OrganizationId",OrganizationId);
    if(row.length > 0){
      
      result1['status'] = "duplicate";
    }else
    {
      let i=0;
      await Promise.all(
        latilongi.map(async (element : any)=>{
          const late1 =  element.lat;
          const long1 =  element.long;
       
          if(i==0)
				  {
           
					  i=2;
        
              const row1 = await Database.table('Geo_Settings').insert({
                'Name': Name,
                'Lat_Long': late1 + ',' + long1,
                'Location': Location,
                'archive': archive,
                'OrganizationId': OrganizationId,
                'Status': Status,
                'LastModifiedById': LastModifiedById,
                'LastModifiedDate': LastModifiedDate,
              });
            
              lastInsertedId = row1[0];
              console.log('Last Inserted ID:', lastInsertedId);
              affected = row1.length;
             
            
					 // const lastinsertedId = insert_id();/////////to get a last employee id from first table
          }
          if(Status==2){
            const insertQuery = await Database.table('geofence_polygon_master').insert({
              'geo_masterId': lastInsertedId,
              'latit_in': late1,
              'longi_in': long1,
            });
          
             lastInsertedId = insertQuery[0];
          }
         
        })
        );
        if(lastInsertedId > 0) 
        {
          result1['Status'] = Status;
          result1['status'] = "true";
        }
        else
        {
          result1['Status'] = Status;
          result1['status'] = "false";
        }
        if(affected > 0) {
          // $EmployeeName =getEmpName($Empid);
          const adminname = await Helper.getEmpName(LastModifiedById);
          const zone= await Helper.getTimeZone(OrganizationId);
          const defaultZone = DateTime.now().setZone(zone);
        
          const date = defaultZone.toFormat("yyyy-MM-dd HH:ii:ss");
          const appModule = "Polygon";
          const module = "Attendance App"; 
          const actionperformed = "<b>"+Name+"</b> has been created by <b>"+adminname+"</b> from<b> Attendance App  </b>";
          const activityby = '1';
          const affected1 = await Helper.ActivityMasterInsert(date,OrganizationId,adminname,activityby,appModule,actionperformed,module)
        }

    }
    return result1
  }

  // +++++++++++assignGeoFenceEmployee++++++++++++++

  public static async assignGeoFenceEmployee(data : any){

    const orgId = data.OrganizationId ? data.OrganizationId : 0;
    const Gid = data.area_assigned ? data.area_assigned: 0 ;
    const Empid = data.Id ? data.Id : 0;
    const adminid= data.adminid ? data.adminid : 0;
    let result:any={} ;
    let affected2 :number = 0; 
    let geo_name :string = '';
    const query1 :any = await Database.query().from('EmployeeMaster').select('area_assigned as areaIds').where('Id',Empid).andWhere('OrganizationId',orgId).andWhere('area_assigned','!=',0);
    if(query1.length > 0)
    {
      
     // const aid = count(explode (",", $row->areaIds))+1;
      const areaIdsArray = query1[0].areaIds.split(',');
      const aid = areaIdsArray.length + 1;
      
      if(aid <= 10)
      {
        result['count'] = aid;
        const areaIds1 = query1[0].areaIds;
        const temp1= areaIds1+","+Gid;
        const temp2 = temp1.split(',').filter((value, index, self) => self.indexOf(value) === index).join(',');
        result['areaIds'] = temp2.split(',');
        const query = await Database.query().from("EmployeeMaster").select('area_assigned').update({
          'area_assigned':temp2
        }).where('OrganizationId',orgId).andWhere('Id',Empid);
        if(query.length > 0)
        {
          result['status']="true"; 
        }
        else
        {
          result['status']="false";
        }

      }else
      {
          result['count'] = aid-1;
          result['status']="Limit Exceed";
      }
    }else
    {
      const query2 = await Database.query().from('EmployeeMaster').select('area_assigned').where('Id',Empid).andWhere('OrganizationId',orgId).update({
        'area_assigned' : Gid
      })
      affected2 = query2.length;

        if( affected2 > 0)
        {
          result['status']="true"; 
        }
        else
        {
          result['status']="false";
        }
         
    }
    const query22 :any = await Database.rawQuery(
      "SELECT Name FROM Geo_Settings WHERE Id = ? AND OrganizationId = ?",
      [Gid, orgId]
    );
    
    const row = query22[0];
    if (row) {
        geo_name = row[0].Name;
    }
    if(affected2 > 2){
      const EmployeeName = await Helper.getEmpName(Empid);
      const adminname = await Helper.getEmpName(adminid);
      const zone= await Helper.getTimeZone(orgId);
      const defaultZone = DateTime.now().setZone(zone);
      const date =  defaultZone.toFormat("yyyy-MM-dd HH:ii:ss");
      const appModule = "Registered FaceID";
      const module = "Attendance App"; 
      const actionperformed = "<b>"+geo_name+"</b> Geo-fence has been assigned to  <b>"+EmployeeName+"</b> by <b>"+adminname+"</b> from<b> Attendance App  </b>";
      const activityby = '1';
      const activity = await Helper.ActivityMasterInsert(date,orgId,adminid,activityby,appModule,actionperformed,module);
    }
    return result;
    
  }

  public static async deleteGeoFence(getdata) {
    return getdata
  }
}
