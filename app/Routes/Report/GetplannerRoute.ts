import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/fetchsummary','GetplannerController.getplannerwisesummary')
    Route.get('/getRegSummary','GetplannerController.getRegSummary')

  }).namespace('App/Controllers/Http/ReportController')
  