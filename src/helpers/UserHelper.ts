import { UserHelper as BaseUserHelper, ApiHelper } from "../appBase/helpers"
import { PersonInterface, ChurchAppInterface } from "./Interfaces";

export class UserHelper extends BaseUserHelper {
    static person: PersonInterface;
    static churchApps: ChurchAppInterface[];

    static getChurchApps = async () => {
      if (UserHelper.churchApps) {
        return UserHelper.churchApps;
      }

      const apps = await ApiHelper.get("/churchApps/", "AccessApi");
      UserHelper.churchApps = apps;
      return apps
    }
}
