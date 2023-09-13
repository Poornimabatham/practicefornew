import Route from '@ioc:Adonis/Core/Route'


Route.put("/sendSignUpMail", "CheckUserEmailController.sendSignUpMail");
Route.get("/verifyEmailOtpRequest",'CheckUserEmailController.verifyEmailOtpRequestdata')
Route.put("/updateEmailOTPRequest",'CheckUserEmailController.updateEmailOTPRequestdata')
Route.get("/checkemailsdetails",'CheckUserEmailController.CheckUserEmaildata').middleware('throttle:global')
Route.get("/getphonedetails",'CheckUserEmailController.CheckUserPhonedata').middleware('throttle:global')

