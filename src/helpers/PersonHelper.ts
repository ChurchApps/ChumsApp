import { PersonHelper as BasePersonHelper } from "../appBase/helpers"
import { PersonInterface, EnvironmentHelper } from ".";

export class PersonHelper extends BasePersonHelper {

  static getBirthDay(person: PersonInterface) {
    if (person?.birthDate === null) return "";
    else {
      const parts = new Date(person.birthDate).toDateString().split(" ");

      return parts[1] + " " + parts[2];
    }
  }

  static getPhotoUrl(person: PersonInterface) {
    if (!person?.photo) {
      return "/images/sample-profile.png"
    }
    return person.photo.startsWith("data:image/png;base64,") ? person.photo : EnvironmentHelper.ContentRoot + person.photo;
  }

  static getExpandedPersonObject(person: PersonInterface) {
    return {
      ...person,
      address: person?.contactInfo?.address1,
      city: person?.contactInfo?.city,
      state: person?.contactInfo?.state,
      zip: person?.contactInfo?.zip,
      email: person?.contactInfo?.email,
      phone: person?.contactInfo?.homePhone,
      lastName: person?.name?.last,
      firstName: person?.name?.first,
      middleName: person?.name?.middle,
      age: person?.birthDate === null ? "" : this.getAge(person?.birthDate).split(" ")[0],
      displayName: person?.name?.display,
      birthDate: person?.birthDate ? new Date(person?.birthDate) : null,
      anniversary: person?.anniversary ? new Date(person?.anniversary) : null
    } as PersonInterface
  }

}
