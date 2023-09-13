import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import saveImageGrpAttFaceService from 'App/Services/saveImageGrpAttFaceService'
import SaveImageGrpAttFaceValidator from 'App/Validators/SaveImageGrpAttFaceValidator'

export default class SaveImageGrpAttFacesController {

    public async saveImageGrpAttFace({ request, response }: HttpContextContract) {

        const validateReq = await request.validate(SaveImageGrpAttFaceValidator.saveImageGrpAttFace);

        const res = await saveImageGrpAttFaceService.saveImageGrpAttFace(validateReq);

        return response.json(res);
    }
}
