import Route from '@ioc:Adonis/Core/Route'


Route.get("/checkemailsdetails",'CheckUserEmailController.CheckUserEmaildata')
Route.get("/getphonedetails",'CheckUserEmailController.CheckUserPhonedata')
Route.get("/verifyEmailOtpRequest",'CheckUserEmailController.verifyEmailOtpRequestdata')
Route.put("/updateEmailOTPRequest",'CheckUserEmailController.updateEmailOTPRequestdata')