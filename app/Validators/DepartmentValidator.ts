import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from './BaseValidator'

export default class DepartmentValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }

    /*
     * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
     *
     * For example:
     * 1. The username must be of data type string. But then also, it should
     *    not contain special characters or numbers.
     *    ```
     *     schema.string({}, [ rules.alpha() ])
     *    ```
     *
     * 2. The email must be of data type string, formatted as a valid
     *    email. But also, not used by any other user.
     *    ```
     *     schema.string({}, [
     *       rules.email(),
     *       rules.unique({ table: 'users', column: 'email' }),
     *     ])
     *    ```
     */
    static getDepartment = {
        schema: schema.create({
            OrganizationId: schema.number(),
            currentpage: schema.number(),
            perpage: schema.number(),
            pagename: schema.string()
        }), message: BaseValidator.messages
    }

    static addDepartment = {
        schema: schema.create({
            Id: schema.number(),
            OrganizationId: schema.number(),
            Name: schema.string(),
            archive: schema.number.optional()
        }), message: BaseValidator.messages
    }

    static updateDepartment = {
        schema: schema.create({
            OrganizationId: schema.number(),
            Id: schema.number(),
            Name: schema.string(),
            LastModifiedById: schema.number.optional(),
            archive: schema.number.optional()
        }), message: BaseValidator.messages
    }
    /**
     * Custom messages for validation failures. You can make use of dot notation `(.)`
     * for targeting nested fields and array expressions `(*)` for targeting all
     * children of an array. For example:
     *
     * {
     *   'profile.username.required': 'Username is required',
     *   'scores.*.number': 'Define scores as valid numbers'
     * }
     *
     */
    public messages: CustomMessages = {}
}

