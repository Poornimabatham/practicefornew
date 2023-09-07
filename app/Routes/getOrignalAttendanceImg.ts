import Route from '@ioc:Adonis/Core/Route'
Route.get('/getOrignalAttendanceImg','GetImgsController.GetAttActualImgs')
Route.get('/getActualImageForVisit','GetImgsController.GetVisitActualImgs')