import Route from '@ioc:Adonis/Core/Route'

Route.get('/getClients','ClientsController.index')
Route.get('/addClient','ClientsController.create')
Route.get('/editClient','ClientsController.edit')
Route.get('/getClientList','ClientsController.getClientList')


