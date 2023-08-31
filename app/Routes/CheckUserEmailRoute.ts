import Route from '@ioc:Adonis/Core/Route'


Route.get("/checkemailsdetails",'CheckUserEmailController.CheckUserEmaildata').middleware('throttle:global')
Route.get("/getphonedetails",'CheckUserEmailController.CheckUserPhonedata').middleware('throttle:global')