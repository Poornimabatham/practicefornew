import Route from '@ioc:Adonis/Core/Route'


Route.get('changepasswordOTP','ChangePasswordOtpsController.changePasswordOTP')
Route.post('newchangepass','ChangePasswordOtpsController.newchangepass')
Route.get('/changepass','ChangePasswordOtpsController.changePassword')

