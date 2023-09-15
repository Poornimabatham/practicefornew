import Route from '@ioc:Adonis/Core/Route'
Route.post('/sendTryFreeAddonService', 'AddonservicesController.sendTryFreeAddonService');
Route.get('/registeredFaceIDList', 'AddonservicesController.registeredFaceIDList');
Route.get('/disapprovefaceid','AddonservicesController.disapprovefaceid')