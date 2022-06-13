import { PersonInterface } from ".";
import { PersonHelper } from "../appBase/helpers";

export class ChumsPersonHelper {

  static getBirthDay(person: PersonInterface) {
    if (person?.birthDate === null) return "";
    else {
      const parts = new Date(person.birthDate).toDateString().split(" ");

      return parts[1] + " " + parts[2];
    }
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
      age: person?.birthDate === null ? "" : PersonHelper.getAge(person?.birthDate).split(" ")[0],
      displayName: person?.name?.display,
      birthDate: person?.birthDate ? new Date(person?.birthDate) : null,
      anniversary: person?.anniversary ? new Date(person?.anniversary) : null
    } as PersonInterface
  }

}
