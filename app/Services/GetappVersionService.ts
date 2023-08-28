import Database from "@ioc:Adonis/Lucid/Database";

export default class GetappVersionService {
  public static async GetappVersion(Data) {
    var Platform = Data.platform;
    const data = {};
    if (Platform == "ubiSales") {
      data["appVersion"] = "2.0.9"; //Current version of ubiSales
      return data;
    }
    if (Platform == "ubiSales_ios") {
      data["appVersion"] = "1.2.7"; //Current version of ubiSales
      return data;
    }

    if (Platform == "PayPak") {
      data["appVersion"] = "1.0.3"; //Current version of Pay Pak App

      return data;
    }
    if (Platform == "Welspun") {
      data["appVersion"] = "2.0.7"; //Current version of Welspun App

      return data;
    }

    if (Platform == "sthiti") {
      data["appVersion"] = "2.0.8"; //Current version of Welspun App

      return data;
    }
    if (Platform == "Android1") {
      const selectAppversionforandroid = await Database.from("PlayStore")
        .select("android_version as appVersion")
        .where("orgid", 0)
        .limit(1);

      if (selectAppversionforandroid.length > 0) {
        data["appVersion"] = selectAppversionforandroid[0].appVersion;
      }
      return data;
    } else {
      const selectAppversionforios = await Database.from("PlayStore")
        .select("ios_version as appVersion")
        .where("orgid", 0)
        .limit(1);
      if (selectAppversionforios.length > 0) {
        data["appVersion"] = selectAppversionforios[0].appVersion;
      }
      return data;
    }
  }
}
