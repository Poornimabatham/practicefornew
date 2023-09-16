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
var UsershiftplannerValidator = /** @class */ (function (_super) {
    __extends(UsershiftplannerValidator, _super);
    function UsershiftplannerValidator(ctx) {
        var _this = _super.call(this) || this;
        _this.ctx = ctx;
        return _this;
    }
    UsershiftplannerValidator.fetchUsershiftplannerschema = {
        schema: Validator_1.schema.create({
            empid: Validator_1.schema.number(),
            orgid: Validator_1.schema.number()
        })
    };
    UsershiftplannerValidator.InsertdeviceInfochema = {
        schema: Validator_1.schema.create({
            empid: Validator_1.schema.number(),
            devicename: Validator_1.schema.string(),
            deviceid: Validator_1.schema.string([Validator_1.rules.alphaNum()])
        })
    };
    UsershiftplannerValidator.getShiftDetailsShiftPlanner = {
        schema: Validator_1.schema.create({
            empid: Validator_1.schema.number(),
            orgid: Validator_1.schema.number(),
            attDate: Validator_1.schema.date.optional({ format: "yyyy-MM-dd" })
        })
    };
    return UsershiftplannerValidator;
}(BaseValidator_1["default"]));
exports["default"] = UsershiftplannerValidator;
