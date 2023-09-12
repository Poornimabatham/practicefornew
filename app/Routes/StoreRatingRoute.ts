import Route from '@ioc:Adonis/Core/Route'
Route.get('/StoreRating','StoreRatingController.StoreRatings')

Route.get('/getSelectedEmployeeShift','StoreRatingController.getSelectedEmployeeShift')