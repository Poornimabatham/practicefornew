import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/fetchsummary", "GetPlannerController.getplannerwisesummary");
  Route.get("/getRegSummary", "GetPlannerController.getRegSummary");
}).namespace("App/Controllers/Http/ReportController");
