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
var Orm_1 = require("@ioc:Adonis/Lucid/Orm");
var CheckUserEmailValidator = /** @class */ (function (_super) {
    __extends(CheckUserEmailValidator, _super);
    function CheckUserEmailValidator(ctx) {
        var _this = _super.call(this) || this;
        _this.ctx = ctx;
        return _this;
    }
    CheckUserEmailValidator.CheckUserEmailSchema = {
        schema: Validator_1.schema.create({
            useremail: Validator_1.schema.string()
        })
    };
    CheckUserEmailValidator.CheckUserPhoneSchema = {
        schema: Validator_1.schema.create({
            phoneno: Validator_1.schema.string()
        })
    };
    CheckUserEmailValidator.verifyEmailOtpRequestSchema = {
        schema: Validator_1.schema.create({
            emailId: Validator_1.schema.string([Validator_1.rules.email()]),
            otp: Validator_1.schema.number(),
            orgId: Validator_1.schema.number()
        })
    };
    CheckUserEmailValidator.updateEmailOTPRequestSchema = {
        schema: Validator_1.schema.create({
            emailId: Validator_1.schema.string([Validator_1.rules.email()]),
            oldEmail: Validator_1.schema.string([Validator_1.rules.email()]),
            empId: Validator_1.schema.number(),
            orgId: Validator_1.schema.number()
        })
    };
    CheckUserEmailValidator.sendSignUpMailV = {
        schema: Validator_1.schema.create({
            appName: Validator_1.schema.string.optional(),
            userName: Validator_1.schema.string.optional(),
            password: Validator_1.schema.string.optional(),
            response: Validator_1.schema.string.optional(),
            phone: Validator_1.schema.string.optional()
        })
    };
    return CheckUserEmailValidator;
}(Orm_1.BaseModel));
exports["default"] = CheckUserEmailValidator;
