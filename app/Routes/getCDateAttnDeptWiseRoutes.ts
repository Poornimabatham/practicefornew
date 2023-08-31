import Route from '@ioc:Adonis/Core/Route'

Route.get('/getCDateAttnDeptWise_getx', 'GetCDateAttnDeptWisesController.getCDateAttnDeptWise').middleware('throttle:global')