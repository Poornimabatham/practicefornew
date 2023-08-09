import Route from '@ioc:Adonis/Core/Route'
import GetplannerController from 'App/Controllers/Http/ReportController/GetPlannerController'


Route.group(() => {
    Route.get('/fetchsummary','GetplannerController.data')

  }).namespace('App/Controllers/Http/ReportController')
  