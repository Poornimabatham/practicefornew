import Route from "@ioc:Adonis/Core/Route"

Route.get('getListofLeaveAll', 'GetListofLeavesController.getListofLeaveAll')
Route.get('getListofLeave', 'GetListofLeavesController.getListofLeave')
Route.get('withdrawLeave','GetListofLeavesController.withdrawLeave')