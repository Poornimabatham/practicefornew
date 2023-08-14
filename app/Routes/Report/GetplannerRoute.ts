import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/fetchsummary','GetplannerController.data')

  }).namespace('App/Controllers/Http/ReportController')
  