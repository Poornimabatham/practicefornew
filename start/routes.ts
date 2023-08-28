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

import "../app/Routes/EmployeeRoute";
import "../app/Routes/SignInRoute";
import "../app/Routes/DesignationRoute";
import "../app/Routes/GeofenceRoute";
import "../app/Routes/GeofenceRoute";
import "../app/Routes/UserSettingRoute";
import "../app/Routes/DepartmentRoute";
import "../app/Routes/GetTokenRoute";
import "../app/Routes/ShiftRoute";
import "../app/Routes/HolidayRoute";
import "../app/Routes/DailyAttendanceRoute";
import "../app/Routes/GetEarlyComingsRoute";
import "../app/Routes/getEarlyLeavingsRoutes";
import "../app/Routes/LateComingRoute";
import "../app/Routes/Report/GetplannerRoute";
import "../app/Routes/getOutsidegeoRoute";
import "../app/Routes/AttendanceRoute";
import "../app/Routes/ClientsRoute";
import "../app/Routes/getInfoRoute";
import Redis from "@ioc:Adonis/Addons/Redis";
import "../app/Routes/getEmpdataDepartmentWiseNewRoute";
import "../app/Routes/getCDateAttnDeptWiseRoutes";
import "../app/Routes/UsershiftplannerRoute";
import "../app/Routes/UserSettingRoute";
import "../app/Routes/getDataToApplyRegRoute";
import "../app/Routes/MyAddonUserInfoRoute";
import "../app/Routes/StoreRatingRoute";
import "../app/Routes/GetLastTimeOutRoute";
import "../app/Routes/changePasswordOTPRoute";
import "../app/Routes/SelectCountryCodeRoute";
import "../app/Routes/ResetPasswordLinkRoute"
import "../app/Routes/CheckUserEmailRoute"
import "../app/Routes/getListofLeaveRoute"
import "../app/Routes/getInterimAttendancesRoute"
import "../app/Routes/GetappVersionRoute"
import "../app/Routes/TempAssignClientRoute"

// Route.get('/', async () => {
//     return "Working fine!"
// })

// Route.get('/', async () => {
// await Redis.set('hello', 'world')
// const value = await Redis.get('hello')
//     return value
// })

import "../app/Routes/ApprovalRegularizationRoute";
