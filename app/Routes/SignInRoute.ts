import Route from '@ioc:Adonis/Core/Route'

Route.post('/login','LoginController.checkLogin');//.middleware('throttle:global')
Route.put('/logout','LogoutsController.logout').middleware('throttle:global').middleware('auth')

Route.post('/Signup', 'LoginController.newregister_orgTemp')
/////// Loginverifymail /////
Route.put("/Loginverifymail", "LoginController.Loginverifymail");    
Route.get("/insert", "LoginController.insert"); 
Route.get ("/bulk","AttendancesController.saveImageGrpAttFace")   


