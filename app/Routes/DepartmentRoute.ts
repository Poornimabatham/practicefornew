import Route from '@ioc:Adonis/Core/Route'


Route.get('/getdepartment', 'DepartmentsController.getdepartment')
Route.post('/addDepartment', 'DepartmentsController.addDepartment')
Route.post('/updateDepartment', 'DepartmentsController.updateDepartment')

