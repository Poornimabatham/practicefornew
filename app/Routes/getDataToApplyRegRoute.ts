import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get(
    "/getDataToApply",
    "GetDataToApplyRegController.FetchDataToApplyReg"
  );

  Route.get(
    "/getDataToCount",
    "GetDataToApplyRegController.getRegularizationCount"
  );
});
