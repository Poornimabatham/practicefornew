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
var GetApprovalRegularizationValidator = /** @class */ (function (_super) {
    __extends(GetApprovalRegularizationValidator, _super);
    function GetApprovalRegularizationValidator(ctx) {
        var _this = _super.call(this) || this;
        _this.ctx = ctx;
        return _this;
    }
    GetApprovalRegularizationValidator.GetApprovalRegularizationschema = {
        schema: Validator_1.schema.create({
            attendance_id: Validator_1.schema.number(),
            orgid: Validator_1.schema.number(),
            uid: Validator_1.schema.number(),
            approverresult: Validator_1.schema.number(),
            comment: Validator_1.schema.string(),
            platform: Validator_1.schema.string.optional(),
            RegularizationAppliedFrom: Validator_1.schema.number()
        })
    };
    return GetApprovalRegularizationValidator;
}(BaseValidator_1["default"]));
exports["default"] = GetApprovalRegularizationValidator;
