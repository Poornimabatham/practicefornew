import Route from '@ioc:Adonis/Core/Route'

Route.get('/getClients','ClientsController.index')
Route.post('/addClient','ClientsController.create')
Route.post('/editClient','ClientsController.edit')
Route.get('/getClientList','ClientsController.getClientList')


