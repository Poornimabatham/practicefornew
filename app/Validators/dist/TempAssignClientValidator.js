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
var TempAssignClientValidator = /** @class */ (function (_super) {
    __extends(TempAssignClientValidator, _super);
    function TempAssignClientValidator(ctx) {
        var _this = _super.call(this) || this;
        _this.ctx = ctx;
        return _this;
    }
    TempAssignClientValidator.TempAssignClientschema = {
        schema: Validator_1.schema.create({
            cid: Validator_1.schema.number(),
            empid: Validator_1.schema.number(),
            orgid: Validator_1.schema.number()
        })
    };
    return TempAssignClientValidator;
}(BaseValidator_1["default"]));
exports["default"] = TempAssignClientValidator;
