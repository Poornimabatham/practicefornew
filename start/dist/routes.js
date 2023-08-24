"use strict";
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
exports.__esModule = true;
require("../app/Routes/EmployeeRoute");
require("../app/Routes/SignInRoute");
require("../app/Routes/DesignationRoute");
require("../app/Routes/GeofenceRoute");
require("../app/Routes/GeofenceRoute");
require("../app/Routes/UserSettingRoute");
require("../app/Routes/DepartmentRoute");
require("../app/Routes/GetTokenRoute");
require("../app/Routes/ShiftRoute");
require("../app/Routes/HolidayRoute");
require("../app/Routes/DailyAttendanceRoute");
require("../app/Routes/GetEarlyComingsRoute");
require("../app/Routes/getEarlyLeavingsRoutes");
require("../app/Routes/LateComingRoute");
require("../app/Routes/Report/GetplannerRoute");
require("../app/Routes/getOutsidegeoRoute");
require("../app/Routes/AttendanceRoute");
require("../app/Routes/ClientsRoute");
require("../app/Routes/getInfoRoute");
require("../app/Routes/getEmpdataDepartmentWiseNewRoute");
require("../app/Routes/getCDateAttnDeptWiseRoutes");
require("../app/Routes/UsershiftplannerRoute");
require("../app/Routes/UserSettingRoute");
require("../app/Routes/getDataToApplyRegRoute");
require("../app/Routes/MyAddonUserInfoRoute");
require("../app/Routes/StoreRatingRoute");
require("../app/Routes/GetLastTimeOutRoute");
require("../app/Routes/changePasswordOTPRoute");
require("../app/Routes/SelectCountryCodeRoute");
// Route.get('/', async () => {
//     return "Working fine!"
// })
// Route.get('/', async () => {
// await Redis.set('hello', 'world')
// const value = await Redis.get('hello')
//     return value
// })
require("../app/Routes/ApprovalRegularizationRoute");
