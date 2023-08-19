import Route from '@ioc:Adonis/Core/Route'

Route.get('/fetch', 'DesignationsController.retreiveDesign').namespace('App/controllers/Http')
Route.post('/add', 'DesignationsController.AddDesign')
Route.put('/update', 'DesignationsController.UpdateDesign')

