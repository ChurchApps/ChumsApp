import { UserHelper as BaseUserHelper, ApiHelper } from "../appBase/helpers"
import { PersonInterface, ChurchAppInterface, EnvironmentHelper } from ".";
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

    static goToAccountsApp = (returnUrl: string) => {
      const jwt = ApiHelper.getConfig("AccessApi").jwt;

      return `${EnvironmentHelper.AccountsAppUrl}/login/?jwt=${jwt}&returnUrl=${returnUrl}`;
    }
}
