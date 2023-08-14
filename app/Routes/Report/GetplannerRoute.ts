import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/fetchsummary','GetplannerController.getplannerwisesummary')

  }).namespace('App/Controllers/Http/ReportController')
  