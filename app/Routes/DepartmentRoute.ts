import Route from '@ioc:Adonis/Core/Route'


Route.get('/getdepartment', 'DepartmentsController.getdepartment')
Route.post('/addDept', 'DepartmentsController.addDept')
Route.post('/updatedept', 'DepartmentsController.updatedept')

