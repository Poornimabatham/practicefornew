import Route from '@ioc:Adonis/Core/Route'

Route.get('getgeofence','GeofencesController.getgeofence').middleware('throttle:global')
Route.post('addgeofence','GeofencesController.addgeofence').middleware('throttle:global')
Route.get('/addpolygon','GeofencesController.addpolygon')
//.middleware('throttle:global').middleware('auth')
Route.post('/assignGeoFenceEmployee','GeofencesController.assignGeoFenceEmployee')
//.middleware('throttle:global').middleware('auth')
Route.delete("/DeleteGeoFence", "GeofencesController.deleteGeoFence");
