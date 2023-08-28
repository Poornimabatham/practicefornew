import Route from '@ioc:Adonis/Core/Route'


Route.get("/checkemailsdetails",'checkuseremailController.CheckUserEmail')
Route.get("/getphonedetails",'checkuseremailController.CheckUserPhone')