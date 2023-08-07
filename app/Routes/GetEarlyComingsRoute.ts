import Route from '@ioc:Adonis/Core/Route'

Route.get('/getEarlyCommings', 'GetEarlyComingsController.getEarlyComings')

//http://127.0.0.1:3333/getEarlyCommings?perPage=5&currentPage=2&empid=&date=2023-02-01&deptId=&orgid=99538