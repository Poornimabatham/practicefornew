import Route from '@ioc:Adonis/Core/Route'

Route.get('/getClients','ClientsController.index')
Route.post('/addClient','ClientsController.create').middleware('throttle:global')
Route.post('/editClient','ClientsController.edit').middleware('throttle:global')
Route.get('/getClientList','ClientsController.getClientList').middleware('throttle:global')
 Route.put("/assignMultipleClient", "ClientsController.assignMultipleClient");

