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
var ResetPasswordLinkValidator = /** @class */ (function (_super) {
    __extends(ResetPasswordLinkValidator, _super);
    function ResetPasswordLinkValidator(ctx) {
        var _this = _super.call(this) || this;
        _this.ctx = ctx;
        return _this;
    }
    ResetPasswordLinkValidator.ResetPasswordLinkchema = {
        schema: Validator_1.schema.create({
            una: Validator_1.schema.string([Validator_1.rules.email()])
        })
    };
    ResetPasswordLinkValidator.getAllowAttToUserschema = {
        schema: Validator_1.schema.create({
            allowToPunchAtt: Validator_1.schema.string([Validator_1.rules.alpha()]),
            Id: Validator_1.schema.number(),
            orgid: Validator_1.schema.number(),
            empid: Validator_1.schema.number()
        })
    };
    ResetPasswordLinkValidator.MoveEmpDataInExistingOrgschema = {
        schema: Validator_1.schema.create({
            uid: Validator_1.schema.number(),
            orgid: Validator_1.schema.number(),
            OldOrgId: Validator_1.schema.number(),
            status: Validator_1.schema.number(),
            Email: Validator_1.schema.string([Validator_1.rules.email()]),
            usercontact: Validator_1.schema.number()
        })
    };
    return ResetPasswordLinkValidator;
}(BaseValidator_1["default"]));
exports["default"] = ResetPasswordLinkValidator;
