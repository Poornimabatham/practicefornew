import Route from '@ioc:Adonis/Core/Route'

Route.get('/fetchDesignations', 'DesignationsController.retreiveDesign').namespace('App/controllers/Http')
Route.post('/addDesignations', 'DesignationsController.AddDesign')
Route.put('/updateDesignations', 'DesignationsController.UpdateDesign')

