import Route from '@ioc:Adonis/Core/Route'

Route.get("/storedeviceinfo",'UsershiftplannerController.storedeviceinfo')
Route.get("/usershiftplanner",'UsershiftplannerController.FetchUsershiftPlanner')
Route.get("/getShiftDetailsShiftPlanner",'UsershiftplannerController.getShiftDetailsShiftPlanner')