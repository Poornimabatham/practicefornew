import Route from '@ioc:Adonis/Core/Route'
Route.get('/getAllShift', 'ShiftsController.getAllShift').middleware("auth")
  //.middleware('throttle:global').middleware('auth')
Route.post('/addShift', 'ShiftsController.addShift')
  //.middleware('throttle:global').middleware('auth')
Route.post("/updateShift", "ShiftsController.updateShift")                                                                                                                                              
  //.middleware('throttle:global').middleware('auth')

Route.post("/deleteInActivateShift", "ShiftsController.deleteInActivateShift")
  //.middleware('throttle:global').middleware('auth')
Route.patch("/assignShift","ShiftsController.assignShift")  
Route.get('/Multishift',"ShiftsController.getMultiShiftsList")                                                                                                                                                             

Route.put('/saveMultiShifts',"ShiftsController.saveMultiShifts")
////////ashish///////////
Route.put('/SaveMultiShiftsByDepartment',"ShiftsController.AssignShiftsByDepartment")
Route.put('/SaveMultiShiftsByDesignation',"ShiftsController.AssignShiftsByDesignation")


Route.get('/shiftcheck',"ShiftsController.shiftcheck")

