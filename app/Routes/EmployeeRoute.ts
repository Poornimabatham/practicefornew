import Route from '@ioc:Adonis/Core/Route'

Route.get('/emplist','EmployeesController.emplist').middleware("auth");
Route.post('/deleteEmployee','EmployeesController.deleteEmployee').middleware("auth");
