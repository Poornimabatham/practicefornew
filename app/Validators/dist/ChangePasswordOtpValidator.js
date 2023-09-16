"use strict";
exports.__esModule = true;
var Validator_1 = require("@ioc:Adonis/Core/Validator");
var BaseValidator_1 = require("./BaseValidator");
var ChangePasswordOtpValidator = /** @class */ (function () {
    function ChangePasswordOtpValidator(ctx) {
        this.ctx = ctx;
        /**
         * Custom messages for validation failures. You can make use of dot notation `(.)`
         * for targeting nested fields and array expressions `(*)` for targeting all
         * children of an array. For example:
         *
         * {
         *   'profile.username.required': 'Username is required',
         *   'scores.*.number': 'Define scores as valid numbers'
         * }
         *
         */
        this.messages = {};
    }
    /*
     * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
     *
     * For example:
     * 1. The username must be of data type string. But then also, it should
     *    not contain special characters or numbers.
     *    ```
     *     schema.string({}, [ rules.alpha() ])
     *    ```
     *
     * 2. The email must be of data type string, formatted as a valid
     *    email. But also, not used by any other user.
     *    ```
     *     schema.string({}, [
     *       rules.email(),
     *       rules.unique({ table: 'users', column: 'email' }),
     *     ])
     *    ```
     */
    ChangePasswordOtpValidator.changePasswordOTP = {
        schema: Validator_1.schema.create({
            emailotp: Validator_1.schema.string.optional(),
            phoneotp: Validator_1.schema.string()
        }),
        message: BaseValidator_1["default"].messages
    };
    ChangePasswordOtpValidator.newchangepass = {
        schema: Validator_1.schema.create({
            changepassphone: Validator_1.schema.string(),
            newpass: Validator_1.schema.string.optional()
        }),
        message: BaseValidator_1["default"].messages
    };
    ChangePasswordOtpValidator.Changepass = {
        schema: Validator_1.schema.create({
            empid: Validator_1.schema.number(),
            orgid: Validator_1.schema.number(),
            pwd: Validator_1.schema.string(),
            npwd: Validator_1.schema.string(),
            email: Validator_1.schema.string([Validator_1.rules.email()])
        }),
        message: BaseValidator_1["default"].messages
    };
    return ChangePasswordOtpValidator;
}());
exports["default"] = ChangePasswordOtpValidator;
