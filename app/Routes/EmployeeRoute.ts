import Route from '@ioc:Adonis/Core/Route'

Route.get('/emplist','EmployeesController.emplist').middleware("auth");
Route.post('/deleteEmployee','EmployeesController.deleteEmployee').middleware("auth");
Route.post('/getSelfieUpdate','EmployeesController.updateSelfistatus').middleware(['auth']);
Route.post('/getAllowAttToUser','EmployeesController.getAllowAttToUser').middleware(['auth']);
Route.post('/getFaceIdUpdate','EmployeesController.FacePermissionUpdate');
Route.post('/DeviceUpdate','EmployeesController.DevicePermissionUpdate');
Route.post('/FingerPrintUpdate','EmployeesController.FingerPrintPermissionUpdate');
Route.post('/updateEmp','EmployeesController.EmpDetailUpdate');
Route.post('/registerEmp','EmployeesController.RegitserEmpDetail');