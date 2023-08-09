import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/fetchdata','GetplannerController.data')
    Route.post('/fetch','GetplannerController.data2')

  }).namespace('App/Controllers/Http/ReportController')
  