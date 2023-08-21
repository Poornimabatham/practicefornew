import Route from '@ioc:Adonis/Core/Route'

Route.get('/','ShiftsController.index').middleware('throttle:global').middleware('auth')
Route.get('/show','ShiftsController.show').middleware('throttle:global').middleware('auth')
Route.get('/create','ShiftsController.create').middleware('throttle:global').middleware('auth')
