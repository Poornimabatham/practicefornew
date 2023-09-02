import Route from '@ioc:Adonis/Core/Route'

Route.get('/getdepartment', 'DepartmentsController.getdepartment')
Route.post('/addDepartment', 'DepartmentsController.addDepartment')
Route.post('/updateDepartment', 'DepartmentsController.updateDepartment')
// ////// assignDepartment //////
Route.patch("/assignDepartment", "DepartmentsController.assignDepartment");
Route.get("/getDepartmentstatus", "DepartmentsController.GetDepartmentStatus").middleware('throttle:global');
Route.get("/getDeptEmp", "DepartmentsController.getDeptEmp").middleware('throttle:global');


Route.get('getEmpdataDepartmentWiseCount', "DepartmentsController.getEmpdataDepartmentWiseCount").middleware('throttle:global')
Route.delete("deleteInActiveDepartment","DepartmentsController.deleteInActiveDepartment");
