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
var DesignationValidator = /** @class */ (function (_super) {
    __extends(DesignationValidator, _super);
    function DesignationValidator(ctx) {
        var _this = _super.call(this) || this;
        _this.ctx = ctx;
        return _this;
    }
    DesignationValidator.AddDesignationschema = {
        schema: Validator_1.schema.create({
            empid: Validator_1.schema.number(),
            orgid: Validator_1.schema.number(),
            name: Validator_1.schema.string(),
            sts: Validator_1.schema.number(),
            desc: Validator_1.schema.string.optional()
        })
    };
    DesignationValidator.Designationschema = {
        schema: Validator_1.schema.create({
            orgid: Validator_1.schema.number(),
            status: Validator_1.schema.number.optional(),
            pagename: Validator_1.schema.string(),
            currentPage: Validator_1.schema.number(),
            perPage: Validator_1.schema.number.optional()
        })
    };
    DesignationValidator.updateDesignationschema = {
        schema: Validator_1.schema.create({
            adminId: Validator_1.schema.number(),
            UpdateName: Validator_1.schema.string.optional(),
            sts: Validator_1.schema.string(),
            id: Validator_1.schema.number(),
            desg: Validator_1.schema.string()
        })
    };
    DesignationValidator.assignDesignation = {
        schema: Validator_1.schema.create({
            Orgid: Validator_1.schema.number(),
            desigid: Validator_1.schema.number(),
            designame: Validator_1.schema.string(),
            empid: Validator_1.schema.number(),
            empname: Validator_1.schema.string(),
            adminid: Validator_1.schema.number.optional(),
            adminname: Validator_1.schema.string()
        })
    };
    DesignationValidator.DesignationStatusSchema = {
        schema: Validator_1.schema.create({
            orgid: Validator_1.schema.number(),
            Id: Validator_1.schema.number()
        })
    };
    DesignationValidator.deleteInActiveDesignationVal = {
        schema: Validator_1.schema.create({
            orgId: Validator_1.schema.number.optional(),
            empId: Validator_1.schema.number.optional(),
            Id: Validator_1.schema.number.optional()
        })
    };
    return DesignationValidator;
}(BaseValidator_1["default"]));
exports["default"] = DesignationValidator;
