import { CommonEnvironmentHelper, ApiHelper, Locale } from "@churchapps/apphelper";


export class EnvironmentHelper {
  static B1Url = "";
  static ChurchAppsUrl = "";
  static Common = CommonEnvironmentHelper;

  static init = async () => {
    let stage = process.env.REACT_APP_STAGE;

    switch (stage) {
      case "staging": EnvironmentHelper.initStaging(); break;
      case "prod": EnvironmentHelper.initProd(); break;
      default: EnvironmentHelper.initDev(); break;
    }
    EnvironmentHelper.Common.init(stage)

    ApiHelper.apiConfigs = [
      { keyName: "AttendanceApi", url: EnvironmentHelper.Common.AttendanceApi, jwt: "", permisssions: [] },
      { keyName: "GivingApi", url: EnvironmentHelper.Common.GivingApi, jwt: "", permisssions: [] },
      { keyName: "MembershipApi", url: EnvironmentHelper.Common.MembershipApi, jwt: "", permisssions: [] },
      { keyName: "ReportingApi", url: EnvironmentHelper.Common.ReportingApi, jwt: "", permisssions: [] },
      { keyName: "DoingApi", url: EnvironmentHelper.Common.DoingApi, jwt: "", permisssions: [] },
      { keyName: "MessagingApi", url: EnvironmentHelper.Common.MessagingApi, jwt: "", permisssions: [] },
      { keyName: "ContentApi", url: EnvironmentHelper.Common.ContentApi, jwt: "", permisssions: [] }
    ];

    //await Locale.init([`/locales/{{lng}}.json`, 'node_modules/@churchapps/apphelper/locales/{{lng}}.json'])
    //await Locale.init([`/locales/{{lng}}.json`])
    await Locale.init([`/locales/{{lng}}.json`, `/apphelper/locales/{{lng}}.json`])
    //await Locale.init([`/apphelper/locales/{{lng}}.json`, `/locales/{{lng}}.json`])
  }

  static initLocal = async () => {

  }


  static initDev = () => {
  }

  //NOTE: None of these values are secret.
  static initStaging = () => {
  }

  //NOTE: None of these values are secret.
  static initProd = () => {
    EnvironmentHelper.Common.GoogleAnalyticsTag = "G-JB7VCG51LF";
  }

}

