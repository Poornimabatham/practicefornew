import Route from '@ioc:Adonis/Core/Route'
Route.get('/show', 'ShiftsController.show')
  //.middleware('throttle:global').middleware('auth')
Route.post('/create', 'ShiftsController.create')
  //.middleware('throttle:global').middleware('auth')
Route.post("/updateShift", "ShiftsController.update")                                                                                                                                              
  //.middleware('throttle:global').middleware('auth')

Route.post("/deleteInActivateShift", "ShiftsController.destroy")
  //.middleware('throttle:global').middleware('auth')
Route.patch("/assignShift","ShiftsController.assignShift")  
Route.get('/Multishift',"ShiftsController.getMultiShiftsList")                                                                                                                                                             


////////ashish///////////
Route.put('/SaveMultiShiftsByDepartment',"ShiftsController.AssignShiftsByDepartment")


Route.get('/shiftcheck',"ShiftsController.shiftcheck")

