import Route from '@ioc:Adonis/Core/Route'

Route.post('/login','LoginController.checkLogin').middleware('throttle:global')
Route.put('/logout','LogoutsController.logout').middleware('throttle:global').middleware('auth')

