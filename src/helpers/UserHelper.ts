import { UserHelper as BaseUserHelper, ApiHelper } from "../appBase/helpers"
import { PersonInterface, EnvironmentHelper } from ".";
export class UserHelper extends BaseUserHelper {
    static person: PersonInterface;

    static goToAccountsApp = (returnUrl: string) => {
      const jwt = ApiHelper.getConfig("AccessApi").jwt;

      return `${EnvironmentHelper.AccountsAppUrl}/login/?jwt=${jwt}&returnUrl=${returnUrl}`;
    }
}
