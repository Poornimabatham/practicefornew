import Route from '@ioc:Adonis/Core/Route'

Route.get('/getEarlyLeaving', 'GetEarlyLeavingsController.getEarlyLeavings')

//http://127.0.0.1:3333/getEarlyLeaving?perPage=10&currentPage=2&empid=&date=2023-03-01&deptd=&orgid=10