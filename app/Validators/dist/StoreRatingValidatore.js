"use strict";
exports.__esModule = true;
var Validator_1 = require("@ioc:Adonis/Core/Validator");
var StoreRatingValidator = /** @class */ (function () {
    function StoreRatingValidator(ctx) {
        this.ctx = ctx;
    }
    StoreRatingValidator.StoreRatingsScehma = { schema: Validator_1.schema.create({
            empid: Validator_1.schema.number(),
            orgid: Validator_1.schema.number(),
            remark: Validator_1.schema.number(),
            rating: Validator_1.schema.number()
        })
    };
    StoreRatingValidator.getSelectedEmployeeShiftScehma = {
        schema: Validator_1.schema.create({
            empid: Validator_1.schema.number(),
            orgid: Validator_1.schema.number()
        })
    };
    return StoreRatingValidator;
}());
exports["default"] = StoreRatingValidator;
