import Route from '@ioc:Adonis/Core/Route'
import Redis from '@ioc:Adonis/Addons/Redis'
import DepartmentsController from 'App/Controllers/Http/DepartmentsController'


Route.get('/getdepartment', 'DepartmentsController.getdepartment').middleware(["auth"])
Route.post('/addDepartment', 'DepartmentsController.addDepartment')
Route.post('/updateDepartment', 'DepartmentsController.updateDepartment')
// ////// assignDepartment //////
Route.patch("/assignDepartment", "DepartmentsController.assignDepartment");
Route.get("/getDepartmentstatus", "DepartmentsController.GetDepartmentStatus");
Route.get('getEmpdataDepartmentWiseCount', "DepartmentsController.getEmpdataDepartmentWiseCount")

Route.get("/redis",async ()=>{
    await Redis.set('foo', 'bar')
    const value = await Redis.get('foo')
    return value
})


Route.post('testlogin', async ({ auth, request, response }) => {
  const email = request.input('email')
  const password = request.input('password')
  try {
    const token = await auth.use('api').attempt(email, password)
    return token
  } catch {
    return response.unauthorized('Invalid credentials')
  }
})


Route.get('/testauthregister',"DepartmentsController.register")
Route.get('/testauthlogin',"DepartmentsController.login")

Route.post('/testlogin21', async () => {
await Redis.set('hello', 'world1')
const value = await Redis.get('hello')
    return value
})

