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
// import UsersController from 'App/Controllers/Http/UsersController'


// Route.get('/', async () => {
  
  // INSERT QUERY
// await Database
// .insertQuery() // 👈 gives an instance of insert query builder
// .table('employee')
// .insert({ fname: 'virk',lname:'kaushak',password:76767, email: 'virk@adonisjs.com',phone:768768 })




// const users = await Database
//   .from('employee') // 👈 gives an instance of select query builder
//   .select('*')
// .timeout(5000)
// return users

// FOR DATABASE  QUERIES
// const query = Database.connection()
// console.log(query);


// USING WHERE CLAUSE
// const query2 =  Database.from('employee')
// .where((query)=>{
//   query
//   .where('fname','poornima').where('empid','1').where('lname','batham')


// })
//  .orWhere((query) => {
//   query
//     .where('email', 'vk@adonisjs.com')

// })
// return query2









  // const employee =  Database.connection()
  //   const query = employee.table("employee")
  //   console.log(employee)
  //   return query



  // DELETE QUERY
  //  const del  = Database

  // .from('employee')
  // .select("*")
  // .delete()
  // console.log("heellow totltpotpo4p")
  // console.log(del)



  
  // await Database
  // .from('employee')
  // .where('empid', 68)
  // .update({fname:'hgkjh',lname:'kiys',password:98877860,email:'oi@gmail.com',phone:7676878})


// const users = await Database
  // .from('employee') // 👈 gives an instance of select query builder
  // .select('empid','fname')   acess the only specifi columns
  //  return users.


  // const adults = await Database
  // .from('employee')
  // .where((query) => {
  //     query
  // .where('password', '=', 798)
  // })
  // .orWhere((query) => {
  //     query
  //     .where('phone',768768)
        
  //   })
  //   return 
  

//   const b = await Database
//   .from('employee')
//   .whereIn('empid', [1,69,70,71,72])

// return b



// const v = await Database
// .from('employee')
//   .whereLike('fname', '%poornima%')
  
//   return v



  // const adult = await Database
  // .from('employee')
  // .where((query) => {
  //   query
  //     .where('fname','poornima')
  // })
  // .andWhere((query) => {
  //   query
  //     .where('email', 'rk@ds.com')
      
  // })
  // .orWhere((query) => {
  //   query
  //     .where('password', 798)
      
  // })
  // return adult
 











  // await Database
  // .table('employee')
  // .multiInsert([{
  //     fname: 'virk',
  //     lname:'jan',
  //     password: 8098,
  //     email: 'virk@adonisjs.com',
  //     phone:8768
  //   },
  //   {
  //     fname: 'sonu',
  //     lname:'gupta',
  //     password: 8098,
  //     email: 'sonu@adonisjs.com',
  //     phone:8768
  //   }
  
  // ])
 

  







  // const adult = await  Database
  // .from('employee')
  // .join('emplyee1', 'emplyee1.ref_id', '=', 'employee.empid')
  // // .select('*')
  // .select('employee')
  


  // return adult


  // const f  = await Database
  
  // .from('employee as e')
  // .innerJoin('emplyee1 as e1','e.empid','e1.ref_id')
     

  // return f

//  })



//  Route.get('/data','UsersController.index')
 Route.get('/data','UsersController.store')