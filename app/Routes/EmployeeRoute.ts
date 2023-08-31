import Route from '@ioc:Adonis/Core/Route'

Route.get('/emplist','EmployeesController.emplist').middleware('throttle:global')
Route.post('/deleteEmployee','EmployeesController.deleteEmployee')
Route.post('/getSelfieUpdate','EmployeesController.updateSelfistatus');
Route.post('/getAllowAttToUser','EmployeesController.getAllowAttToUser');
Route.post('/getFaceIdUpdate','EmployeesController.FacePermissionUpdate');
Route.post('/DeviceUpdate','EmployeesController.DevicePermissionUpdate');
Route.post('/FingerPrintUpdate','EmployeesController.FingerPrintPermissionUpdate');
Route.post('/updateEmp','EmployeesController.EmpDetailUpdate');
Route.post('/registerEmp','EmployeesController.RegitserEmpDetail');
