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
var getProfileImageValidator = /** @class */ (function (_super) {
    __extends(getProfileImageValidator, _super);
    function getProfileImageValidator(ctx) {
        var _this = _super.call(this) || this;
        _this.ctx = ctx;
        return _this;
    }
    getProfileImageValidator.getProfileImageServicesschema = {
        schema: Validator_1.schema.create({
            orgId: Validator_1.schema.number(),
            empId: Validator_1.schema.number()
        })
    };
    getProfileImageValidator.sendBrodCastNotificationFromService = {
        schema: Validator_1.schema.create({
            refno: Validator_1.schema.number(),
            title: Validator_1.schema.string(),
            uid: Validator_1.schema.number(),
            body: Validator_1.schema.string(),
            topic: Validator_1.schema.string.optional(),
            PageName: Validator_1.schema.string()
        })
    };
    getProfileImageValidator.generateNumericOTPschema = {
        schema: Validator_1.schema.create({
            emailId: Validator_1.schema.string([Validator_1.rules.email()]),
            empId: Validator_1.schema.number(),
            orgId: Validator_1.schema.number()
        })
    };
    return getProfileImageValidator;
}(BaseValidator_1["default"]));
exports["default"] = getProfileImageValidator;
