import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BaseValidator from './BaseValidator'

export default class DepartmentValidator extends BaseValidator {
    constructor(protected ctx: HttpContextContract) {
        super()
    }


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
            DId: schema.number(),
            EmpID: schema.number(),
            archive: schema.number(),
            Name: schema.string.optional(),
            LastModifiedById: schema.number.optional(),
        }), message: BaseValidator.messages
    }

}

