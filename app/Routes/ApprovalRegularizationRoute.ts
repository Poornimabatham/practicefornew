import Route from '@ioc:Adonis/Core/Route'

Route.get('/getApproval','GetApprovalRegularizationController.FetchdataApprovalRegulization').middleware('throttle:global')
