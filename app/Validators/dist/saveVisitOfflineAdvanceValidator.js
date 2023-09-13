"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Validator_1 = require("@ioc:Adonis/Core/Validator");
var BaseValidator_1 = require("./BaseValidator");
var saveVisitOfflineAdvanceValidator = /** @class */ (function (_super) {
    __extends(saveVisitOfflineAdvanceValidator, _super);
    function saveVisitOfflineAdvanceValidator(ctx) {
        var _this = _super.call(this) || this;
        _this.ctx = ctx;
        return _this;
    }
    saveVisitOfflineAdvanceValidator.saveVisitOfflineAdvanceschema = {
        schema: Validator_1.schema.create({
            Id: Validator_1.schema.number(),
            EmployeeId: Validator_1.schema.number(),
            ClientId: Validator_1.schema.number.optional(),
            ClientName: Validator_1.schema.string(),
            VisitDate: Validator_1.schema.date.optional({ format: "yyyy-MM-dd" }),
            OrganizationId: Validator_1.schema.number(),
            VisitInTime: Validator_1.schema.string(),
            VisitOutTime: Validator_1.schema.string.optional(),
            VisitInLocation: Validator_1.schema.string(),
            VisitOutLocation: Validator_1.schema.string.optional(),
            LatitudeIn: Validator_1.schema.string(),
            LongitudeIn: Validator_1.schema.string(),
            LatitudeOut: Validator_1.schema.string.optional(),
            LongitudeOut: Validator_1.schema.string.optional(),
            VisitInImageName: Validator_1.schema.string(),
            VisitOutImageName: Validator_1.schema.string.optional(),
            VisitInImageBase64: Validator_1.schema.string(),
            VisitOutImageBase64: Validator_1.schema.string.optional(),
            FakeLocationInStatus: Validator_1.schema.string(),
            FakeLocationOutStatus: Validator_1.schema.string(),
            Description: Validator_1.schema.string.optional(),
            IsVisitInSynced: Validator_1.schema.string(),
            IsVisitOutSynced: Validator_1.schema.string(),
            ThumbnailVisitInImageName: Validator_1.schema.string(),
            ThumbnailVisitOutImageName: Validator_1.schema.string.optional(),
            ThumbnailVisitInImageBase64: Validator_1.schema.string.optional(),
            ThumbnailVisitOutImageBase64: Validator_1.schema.string.optional(),
            GeofenceStatusVisitIn: Validator_1.schema.string(),
            GeofenceStatusVisitOut: Validator_1.schema.string.optional()
        })
    };
    return saveVisitOfflineAdvanceValidator;
}(BaseValidator_1["default"]));
exports["default"] = saveVisitOfflineAdvanceValidator;
