import Route from '@ioc:Adonis/Core/Route'


Route.get("/Updateprofile",'UsersettingsController.UpdateProfile').middleware('throttle:global')
Route.get("/PunchvisitCsv",'UsersettingsController.getPunchInfoCsv');
Route.get("/getPunchInfo","UsersettingsController.getPunchInfo");
Route.get("/Employeelist","UsersettingsController.getEmployeesList");
Route.get("/getNotification","UsersettingsController.OrgCheck");
Route.put("/notificationchange","UsersettingsController.Notification")
Route.put("/updatenotification","UsersettingsController.UpdateNotification");
Route.get("/SetQr","UsersettingsController.setQrKioskPin")
Route.put("/ChangeQR","UsersettingsController.ChangeQrKioskPin")
Route.get("/Regularizeapprove","UsersettingsController.getRegDetailForApproval")

