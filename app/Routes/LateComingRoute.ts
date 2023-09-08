import Route from '@ioc:Adonis/Core/Route'

Route.get('/FetchLateComings','LatecomingsController.FetchLateComings')

Route.get("/getlateComingsCsv", "LatecomingsController.getlateComingsCsv");