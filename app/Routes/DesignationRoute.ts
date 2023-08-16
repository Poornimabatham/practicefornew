import Route from '@ioc:Adonis/Core/Route'

Route.get('/fetch', 'DesignationsController.retreiveDesign')
Route.post('/add', 'DesignationsController.AddDesign')
Route.put('/update', 'DesignationsController.UpdateDesign')

