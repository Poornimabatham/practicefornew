import Route from '@ioc:Adonis/Core/Route'


Route.get("/checkemailsdetails",'CheckUserEmailController.CheckUserEmail')
Route.get("/getphonedetails",'CheckUserEmailController.CheckUserPhone')