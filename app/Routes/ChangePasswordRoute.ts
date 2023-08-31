import Route from '@ioc:Adonis/Core/Route'


Route.get("/checkemailsdetails",'CheckUserEmailController.CheckUserEmaildata')
Route.get("/getphonedetails",'CheckUserEmailController.CheckUserPhonedata')