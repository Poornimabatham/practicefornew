import Route from '@ioc:Adonis/Core/Route'
import UserSettingsController from 'App/Controllers/Http/UserSettingsController';


Route.get("/Updateprofile",'UserSettingsController.UpdateProfile').middleware('throttle:global')
Route.get("/PunchvisitCsv",'UserSettingsController.getPunchInfoCsv');
Route.get("/getPunchInfo","UserSettingsController.getPunchInfo");
Route.get("/Employeelist","UserSettingsController.getEmployeesList");
Route.get("/getNotification","UserSettingsController.OrgCheck");
Route.put("/notificationchange","UserSettingsController.Notification")
Route.put("/updatenotification","UserSettingsController.UpdateNotification");
Route.get("/SetQr","UserSettingsController.setQrKioskPin")
Route.put("/ChangeQR","UserSettingsController.ChangeQrKioskPin")
Route.get("/Regularizeapprove","UserSettingsController.getRegDetailForApproval")
Route.get('recoverPinLoginCredential','UserSettingsController.recoverPinLoginCredential')
Route.put("/UpdateQR",'UserSettingsController.UpdateQrKioskPageReopen')
Route.post("/demoScheduleRequest","UserSettingsController.demoScheduleRequest")
Route.get("/getTeamPunchInfo","UserSettingsController.getTeamPunchInfo")
Route.get('/GetQrKioskStatus','UserSettingsController.getQrKioskStatus')
