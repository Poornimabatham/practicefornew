import Database from "@ioc:Adonis/Lucid/Database";

export default class getAppDetailService {
  public static async getAppDetail(get) {
  
    var response: getAppDetail[] = [];
    var data: getAppDetail = {
      appVersion: "0",
      updateStatus: "0",
      checkMandUpdate: "0"
    }

    if (get.appName == "ubiSales") {
      
      var data: getAppDetail = {
        appVersion: "2.4.1",
        updateStatus: "0",
        checkMandUpdate: "1", //0 for no mandatory update, 1 for mandatory update
      };
    }
    
    if (get.appName == "ubiSales_ios") {
      var data: getAppDetail = {
        appVersion: "6.4.2",
        updateStatus: "0",
        checkMandUpdate: "0",
      };
    }

    if (get.appName == "PayPak") {
      var data: getAppDetail = {
        appVersion: "0",
        updateStatus: "0",
        checkMandUpdate: "0",
      };
    }

    if (get.appName == "Welspun") {
      var data: getAppDetail = {
        appVersion: "0",
        updateStatus: "0",
        checkMandUpdate: "0",  //0 for no mandatory update, 1 for mandatory update
      };
    }

    if (get.appName == "sthiti") {
      var data: getAppDetail = {
        appVersion: "2.0.8",
        updateStatus: "1",
        checkMandUpdate: "0", 
      };
    }

    if (get.appName == "Android1") {
      let querytocheckforAndroed1 = await Database.from("PlayStore")
        .select(
          "is_mandatory_android as is_update",
          "alert_popup_android",
          "android_version"
        )
        .where("orgid", 0).limit(1);

      if (querytocheckforAndroed1.length > 0) {
        var data: getAppDetail = {
          checkMandUpdate: querytocheckforAndroed1[0].is_update,
          updateStatus: querytocheckforAndroed1[0].alert_popup_android,
          appVersion: querytocheckforAndroed1[0].android_version,
        };
        }
      }

      if (get.appName == "ubiAttendance_ios") {
        let querytocheckforUbiatt = await Database.from("PlayStore")
          .select(
            "is_mandatory_android as is_update",
            "alert_popup_ios",
            "ios_version"
          )
          .where("orgid",0)
          .limit(1);
        
        if (querytocheckforUbiatt.length > 0) {
          var data: getAppDetail = {
            checkMandUpdate: querytocheckforUbiatt[0].is_update,
            updateStatus: querytocheckforUbiatt[0].alert_popup_ios,
            appVersion: querytocheckforUbiatt[0].ios_version,
          };
        }
      }
      response.push(data);
      return response;
    }
  }
