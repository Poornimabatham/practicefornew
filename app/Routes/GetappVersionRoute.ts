import Route from '@ioc:Adonis/Core/Route'

Route.get('/getAppVersion','GetappVersionController.getappversiondata' ).middleware('throttle:global')