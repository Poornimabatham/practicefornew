import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GetapprovalRegularService from 'App/Services/ApprovalRegularizatiobService'
import GetApprovalRegularizationValidator from 'App/Validators/ApprovalRegularizationValidator'
export default class GetApprovalRegularizationController {
    public async FetchdataApprovalRegulization({request,response  }: HttpContextContract) {
    const validationwithschema = await  request.validate(GetApprovalRegularizationValidator.GetApprovalRegularizationschema)
    const getResponse = await  GetapprovalRegularService.GetregularizationApproverRejectedAPI(  validationwithschema  )
    return  response.json(getResponse)
    
    }
}
