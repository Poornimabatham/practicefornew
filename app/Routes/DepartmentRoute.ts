import Route from '@ioc:Adonis/Core/Route'

Route.get('/getdepartment', 'DepartmentsController.getdepartment')
Route.post('/addDepartment', 'DepartmentsController.addDepartment')
Route.post('/updateDepartment', 'DepartmentsController.updateDepartment')
// ////// assignDepartment //////
Route.patch("/assignDepartment", "DepartmentsController.assignDepartment");
Route.get("/getDepartmentstatus", "DepartmentsController.GetDepartmentStatus");
Route.get("/getDeptEmp", "DepartmentsController.getDeptEmp");



