import { PersonHelper as BasePersonHelper } from "../appBase/helpers"
import { PersonInterface, EnvironmentHelper } from ".";

export class PersonHelper extends BasePersonHelper {
  static getPhotoUrl(person: PersonInterface) {
    if (!person?.photo) {
      return "/images/sample-profile.png"
    }
    return person.photo.startsWith("data:image/png;base64,") ? person.photo : EnvironmentHelper.ContentRoot + person.photo;
  }
}
