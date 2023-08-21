import Route from '@ioc:Adonis/Core/Route'

Route.get('/fetchDesignations', 'DesignationsController.retreiveDesign')
Route.post('/addDesignations', 'DesignationsController.AddDesign')
Route.put('/updateDesignations', 'DesignationsController.UpdateDesign')

