import Route from '@ioc:Adonis/Core/Route'


Route.get('/getdepartment', 'DepartmentsController.getdepartment')
Route.post('/addDept', 'DepartmentsController.addDept').middleware('throttle:global').middleware('auth')
Route.post('/updatedept', 'DepartmentsController.updatedept').middleware('throttle:global').middleware('auth')

