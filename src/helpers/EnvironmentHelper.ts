import { CommonEnvironmentHelper, ApiHelper, Locale } from "@churchapps/apphelper";

export class EnvironmentHelper {
  private static LessonsApi = "";
  static B1Url = "";
  static ChurchAppsUrl = "";
  static Common = CommonEnvironmentHelper;

  static init = async () => {
    const stage = process.env.REACT_APP_STAGE;

    switch (stage) {
      case "staging":
        EnvironmentHelper.initStaging();
        break;
      case "prod":
        EnvironmentHelper.initProd();
        break;
      default:
        EnvironmentHelper.initDev();
        break;
    }
    EnvironmentHelper.Common.init(stage);

    ApiHelper.apiConfigs = [
      {
        keyName: "AttendanceApi",
        url: EnvironmentHelper.Common.AttendanceApi,
        jwt: "",
        permisssions: [],
      },
      {
        keyName: "GivingApi",
        url: EnvironmentHelper.Common.GivingApi,
        jwt: "",
        permisssions: [],
      },
      {
        keyName: "MembershipApi",
        url: EnvironmentHelper.Common.MembershipApi,
        jwt: "",
        permisssions: [],
      },
      {
        keyName: "ReportingApi",
        url: EnvironmentHelper.Common.ReportingApi,
        jwt: "",
        permisssions: [],
      },
      {
        keyName: "DoingApi",
        url: EnvironmentHelper.Common.DoingApi,
        jwt: "",
        permisssions: [],
      },
      {
        keyName: "MessagingApi",
        url: EnvironmentHelper.Common.MessagingApi,
        jwt: "",
        permisssions: [],
      },
      {
        keyName: "ContentApi",
        url: EnvironmentHelper.Common.ContentApi,
        jwt: "",
        permisssions: [],
      },
      {
        keyName: "LessonsApi",
        url: EnvironmentHelper.LessonsApi,
        jwt: "",
        permisssions: [],
      },
    ];

    await Locale.init([`/locales/{{lng}}.json?v=1`, `/apphelper/locales/{{lng}}.json`]);
  };

  static initLocal = async () => {};

  static initDev = () => {
    this.initStaging();
    EnvironmentHelper.LessonsApi = process.env.NEXT_PUBLIC_LESSONS_API || EnvironmentHelper.LessonsApi;
  };

  //NOTE: None of these values are secret.
  static initStaging = () => {
    EnvironmentHelper.LessonsApi = "https://api.staging.lessons.church";
  };

  //NOTE: None of these values are secret.
  static initProd = () => {
    EnvironmentHelper.Common.GoogleAnalyticsTag = "G-JB7VCG51LF";
    EnvironmentHelper.LessonsApi = "https://api.lessons.church";
  };
}
