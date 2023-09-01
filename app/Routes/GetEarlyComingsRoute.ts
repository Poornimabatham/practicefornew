import Route from '@ioc:Adonis/Core/Route'

Route.get('/getEarlyCommings', 'GetEarlyComingsController.getEarlyComings')

Route.get("/getEarlyCommingsCsv","GetEarlyComingsController.getEarlyComingsCsv");