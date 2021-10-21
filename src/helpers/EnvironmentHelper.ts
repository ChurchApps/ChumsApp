import { ApiHelper } from "../appBase/helpers/ApiHelper";

export class EnvironmentHelper {
    private static AccessApi = "";
    private static AttendanceApi = "";
    private static GivingApi = "";
    private static MembershipApi = "";
    static B1Url = "";

    static ContentRoot = "";
    static AccountsAppUrl = "";
    static ChurchAppsUrl = "";
    static GoogleAnalyticsTag = "";

    static init = () => {
      switch (process.env.REACT_APP_STAGE) {
        case "staging": EnvironmentHelper.initStaging(); break;
        case "prod": EnvironmentHelper.initProd(); break;
        default: EnvironmentHelper.initDev(); break;
      }
      ApiHelper.apiConfigs = [
        { keyName: "AccessApi", url: EnvironmentHelper.AccessApi, jwt: "", permisssions: [] },
        { keyName: "AttendanceApi", url: EnvironmentHelper.AttendanceApi, jwt: "", permisssions: [] },
        { keyName: "GivingApi", url: EnvironmentHelper.GivingApi, jwt: "", permisssions: [] },
        { keyName: "MembershipApi", url: EnvironmentHelper.MembershipApi, jwt: "", permisssions: [] }
      ];
    }

    static initDev = () => {
      EnvironmentHelper.AccessApi = process.env.REACT_APP_ACCESS_API || "";
      EnvironmentHelper.AttendanceApi = process.env.REACT_APP_ATTENDANCE_API || "";
      EnvironmentHelper.GivingApi = process.env.REACT_APP_GIVING_API || "";
      EnvironmentHelper.MembershipApi = process.env.REACT_APP_MEMBERSHIP_API || "";
      EnvironmentHelper.ContentRoot = process.env.REACT_APP_CONTENT_ROOT || "";
      EnvironmentHelper.AccountsAppUrl = process.env.REACT_APP_ACCOUNTS_APP_URL || "";
      EnvironmentHelper.ChurchAppsUrl = process.env.REACT_APP_CHURCH_APPS_URL || "";
      EnvironmentHelper.GoogleAnalyticsTag = process.env.REACT_APP_GOOGLE_ANALYTICS || "";
      EnvironmentHelper.B1Url = process.env.REACT_APP_B1_URL || "";
    }

    //NOTE: None of these values are secret.
    static initStaging = () => {
      EnvironmentHelper.AccessApi = "https://accessapi.staging.churchapps.org";
      EnvironmentHelper.AttendanceApi = "https://attendanceapi.staging.churchapps.org";
      EnvironmentHelper.GivingApi = "https://givingapi.staging.churchapps.org";
      EnvironmentHelper.MembershipApi = "https://membershipapi.staging.churchapps.org";
      EnvironmentHelper.ContentRoot = "https://content.staging.churchapps.org";
      EnvironmentHelper.AccountsAppUrl = "https://accounts.staging.churchapps.org";
      EnvironmentHelper.ChurchAppsUrl = "https://staging.churchapps.org";
      EnvironmentHelper.GoogleAnalyticsTag = "";
      EnvironmentHelper.B1Url = "https://{key}.staging.b1.church";
    }

    //NOTE: None of these values are secret.
    static initProd = () => {
      EnvironmentHelper.AccessApi = "https://accessapi.churchapps.org";
      EnvironmentHelper.AttendanceApi = "https://attendanceapi.churchapps.org";
      EnvironmentHelper.GivingApi = "https://givingapi.churchapps.org";
      EnvironmentHelper.MembershipApi = "https://membershipapi.churchapps.org";
      EnvironmentHelper.ContentRoot = "https://content.churchapps.org";
      EnvironmentHelper.AccountsAppUrl = "https://accounts.churchapps.org";
      EnvironmentHelper.ChurchAppsUrl = "https://churchapps.org";
      EnvironmentHelper.GoogleAnalyticsTag = "UA-164774603-4";
      EnvironmentHelper.B1Url = "https://{key}.b1.church";
    }

}

