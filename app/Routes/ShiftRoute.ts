import Route from '@ioc:Adonis/Core/Route'

Route.get('/index12','ShiftsController.index')
Route.get('/show', 'ShiftsController.show')
  .middleware('throttle:global').middleware('auth')
Route.post('/create', 'ShiftsController.create')
  .middleware('throttle:global').middleware('auth')
Route.post("/updateShift", "ShiftsController.update")
  .middleware('throttle:global').middleware('auth')
Route.post("/assignShift", "ShiftsController.edit")
  .middleware('throttle:global').middleware('auth')
Route.post("/deleteInActivateShift", "ShiftsController.destroy")
  .middleware('throttle:global').middleware('auth')
