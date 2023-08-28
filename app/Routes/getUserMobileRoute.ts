import Route from '@ioc:Adonis/Core/Route'


Route.get('getUsersMobile','GetUsersMobilesController.index')
//.middleware('throttle:global').middleware('auth')