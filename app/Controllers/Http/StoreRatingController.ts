import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import StoreRatingService from "App/Services/StoreRatingService";
import StoreRatingValidator from "App/Validators/StoreRatingValidatore";

export default class StoreRatingController {
  public async StoreRatings({ request }: HttpContextContract) {
    const Validationinput = await request.validate(
      StoreRatingValidator.StoreRatingsScehma
    );
    const Output = await StoreRatingService.StoreRatings(Validationinput);
    return Output;
  }
}
