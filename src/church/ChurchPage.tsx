import React from "react";
import UserContext from "../UserContext";
import { DisplayBox, ChurchInterface, ApiHelper, UserHelper, EnvironmentHelper } from "./components"
import { useParams } from "react-router-dom";
import { Grid, Icon } from "@mui/material";

export const ChurchPage = () => {
  const params = useParams();
  const [church, setChurch] = React.useState<ChurchInterface>(null);
  const context = React.useContext(UserContext);
  const APPS: { app: string, url: string, logo?: string, desc?: string }[] = [
    { app: "CHUMS", url: createLoginLink(EnvironmentHelper.Common.ChumsRoot), logo: "https://chums.org/images/logo.png", desc: "A completely free, open-source church management platform.  Keep track of visitors, attendance, giving, and more." },
    { app: "B1", url: createLoginLink(EnvironmentHelper.Common.B1Root.replace("{key}", UserHelper.currentChurch.subDomain)), logo: "https://b1.church/images/logo-nav.png", desc: "A mobile app and website that helps churches connect with their members." },
    { app: "Lessons.church", url: createLoginLink(EnvironmentHelper.Common.LessonsRoot), logo: "https://lessons.church/images/logo.png", desc: "Completely free curriculum for churches.  Schedule your lessons and easily present them on screens with the Lessons.church app" },
    { app: "StreamingLive", url: createLoginLink(EnvironmentHelper.Common.StreamingLiveRoot.replace("{key}", UserHelper.currentChurch.subDomain)), logo: "https://streaminglive.church/images/logo.png", desc: "A live stream wrapper for your church.  Surrround YouTube, Vimeo, Facebook and other videos with live chat, donations, sermon notes, private prayer requests and more." }
  ]

  const loadData = () => {
    const churchId = params.id;
    if (churchId !== UserHelper.currentChurch.id) UserHelper.selectChurch(context, churchId);

    ApiHelper.get("/churches/" + params.id + "?include=permissions", "MembershipApi").then(data => setChurch(data));
  }

  function createLoginLink(url: string) {
    const jwt = ApiHelper.getConfig("MembershipApi").jwt
    const church = UserHelper.currentChurch
    return url + `/login?jwt=${jwt}&churchId=${church.id.toString()}`
  }

  React.useEffect(loadData, [params.id]); //eslint-disable-line

  return (
    <>
      <h1><Icon>church</Icon> {church?.name || "Select App"}</h1>
      <DisplayBox headerIcon="link" headerText="Go to App">
        {
          APPS.map(a => (
            <a href={a.url} className="appLink" key={a.app}>
              <Grid container spacing={3}>
                <Grid item sm={2}><img src={a.logo} alt={a.app} /></Grid>
                <Grid item sm={10}>{a.desc}</Grid>
              </Grid>
            </a>
          ))
        }
      </DisplayBox>
    </>
  );
}
