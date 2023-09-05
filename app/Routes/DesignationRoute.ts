import Route from '@ioc:Adonis/Core/Route'

Route.get('/fetchDesignations', 'DesignationsController.retreiveDesign')
Route.post('/addDesignations', 'DesignationsController.AddDesign')
Route.put('/updateDesignations', 'DesignationsController.UpdateDesign')
////// assignDesignation //////
Route.patch('/AssignDesignation', 'DesignationsController.assignDesignation')
Route.get("/getDesignationsstatus", "DesignationsController.DesignationsGetStatus").middleware('throttle:global');
Route.delete("/deleteInActiveDesignation","DesignationsController.deleteInActiveDesignation");
