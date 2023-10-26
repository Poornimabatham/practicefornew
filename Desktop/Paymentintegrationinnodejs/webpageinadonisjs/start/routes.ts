/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import View from '@ioc:Adonis/Core/View'
import MiesController from 'App/Controllers/Http/MiesController'



Route.post('/display', async ({ view }) => {
  const html = await view.render('home', {
    greeting: 'Hello'
  })
  
  return html
})


// Route.get('/display2', async ({ view }) => {
//   const html = await view.render('home', {
//     greeting: 'Hello'
//   })
  
//   return html
// })


// Route.get('/display2', async ({ view }) => {
// const v = await View.renderRaw(
//   `
//   <p> Hello {{ username }} </p>
// `,
//   {
//     username: 'virk',
   
//   }
// )
// return v
// })
Route.get('/render','MiesController.showTemplate')

