import Route from '@ioc:Adonis/Core/Route'


Route.get("/checkemailsdetails",'checkuseremailController.CheckUserEmaildata')
Route.get("/getphonedetails",'checkuseremailController.CheckUserPhonedata')