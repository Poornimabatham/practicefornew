import Route from '@ioc:Adonis/Core/Route'


Route.get('changepasswordOTP','ChangePasswordOtpsController.changePasswordOTP')
Route.get('newchangepass','ChangePasswordOtpsController.newchangepass')
Route.get('/changepass','ChangePasswordOtpsController.changePassword')

