import Route from '@ioc:Adonis/Core/Route'

Route.get('/getEarlyLeaving', 'GetEarlyLeavingsController.getEarlyLeavings')

Route.get("/getEarlyLeavingsCsv","GetEarlyLeavingsController.getEarlyLeavingsCsv");