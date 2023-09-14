import { schema, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BaseValidator from "./BaseValidator";
export default class saveVisitOfflineAdvanceValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  static saveVisitOfflineAdvanceschema = {
    schema: schema.create({
      Id: schema.number(),
      EmployeeId: schema.number(),
      ClientId: schema.number.optional(),
      ClientName: schema.string(),
      VisitDate: schema.date.optional({ format: "yyyy-MM-dd" }),
      OrganizationId: schema.number(),
      VisitInTime: schema.string(),
      VisitOutTime: schema.string.optional(),
      VisitInLocation: schema.string(),
      VisitOutLocation: schema.string.optional(),
      LatitudeIn: schema.string(),
      LongitudeIn: schema.string(),
      LatitudeOut: schema.string.optional(),
      LongitudeOut: schema.string.optional(),
      VisitInImageName: schema.string(),
      VisitOutImageName: schema.string.optional(),
      VisitInImageBase64: schema.string(),
      VisitOutImageBase64: schema.string.optional(),
      FakeLocationInStatus: schema.string(),
      FakeLocationOutStatus: schema.string(),
      Description: schema.string.optional(),
      IsVisitInSynced: schema.string(),
      IsVisitOutSynced: schema.string(),
      ThumbnailVisitInImageName: schema.string(),
      ThumbnailVisitOutImageName: schema.string.optional(),
      ThumbnailVisitInImageBase64: schema.string.optional(),
      ThumbnailVisitOutImageBase64: schema.string.optional(),
      GeofenceStatusVisitIn: schema.string(),
      GeofenceStatusVisitOut: schema.string.optional(),
    }),
  };

  static checkLoginWithSyncAttQr = {
    schema: schema.create({
      data: schema.string(),
    }),
  };
}
