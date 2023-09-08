import Route from "@ioc:Adonis/Core/Route";

Route.get("/getDataToApply", "GetDataToApplyRegController.FetchDataToApplyReg");

Route.get("/getDataToCount","GetDataToApplyRegController.getRegularizationCount");
Route.get("/OnSendRegularizeRequest","GetDataToApplyRegController.OnSendRegularizeRequest");

