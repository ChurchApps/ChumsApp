import React, { useEffect } from "react";
import { Locale, DisplayBox, ApiHelper, SettingInterface } from "@churchapps/apphelper"
import { Button, Grid } from "@mui/material";

export const LinkedAccounts = () => {

  const [settings, setSettings] = React.useState<SettingInterface[]>([]);
  const [oauthToken, setOauthToken] = React.useState<string | null>(null);
  const [oauthTokenSecret, setOauthTokenSecret] = React.useState<string | null>(null);

  const loadData = () => {
    ApiHelper.get("/songDetails/praiseCharts/library", "ContentApi").then(data => { console.log("CATALOG", data) });
    ApiHelper.get("/settings/my", "ContentApi").then(data => { setSettings(data); });
  }

  const unlinkPraiseCharts = async () => {
    const token = settings.find(s => s.keyName === "praiseChartsAccessToken");
    const secret = settings.find(s => s.keyName === "praiseChartsAccessTokenSecret");
    if (secret) await ApiHelper.delete("/settings/my/" + secret.id, "ContentApi");
    if (token) await ApiHelper.delete("/settings/my/" + token.id, "ContentApi");
    loadData();
  }

  const openOAuthPopup = async () => {
    const returnUrl = "http://localhost:3101/pingback"
    const { authUrl, oauthToken, oauthTokenSecret } = await ApiHelper.get("/songDetails/praiseCharts/authUrl?returnUrl=" + encodeURIComponent(returnUrl), "ContentApi");
    setOauthToken(oauthToken);
    setOauthTokenSecret(oauthTokenSecret);

    const popup = window.open(authUrl, 'oauth', 'width=600,height=700');

    // Listen for message from popup
    window.addEventListener('message', async (event) => {
      if (event.origin !== window.location.origin) return;
      const { oauth_token, oauth_verifier } = event.data;
      popup.close();

      await ApiHelper.get("/songDetails/praiseCharts/access?verifier=" + encodeURIComponent(oauth_verifier) + "&token=" + encodeURIComponent(oauthToken) + "&secret=" + encodeURIComponent(oauthTokenSecret), "ContentApi");
      loadData();
    });
  };

  useEffect(loadData, []);

  const praiseChartsAccessToken = settings.find(s => s.keyName === "praiseChartsAccessToken")?.value;

  return (
    <>
      <DisplayBox headerText={Locale.label("profile.profilePage.linkedAccounts")}>
        <br />
        <Grid container spacing={3}>
          <Grid item sm={3}>
            <img src="/images/praisecharts.png" alt="PraiseCharts" style={{ height: 40 }} />
          </Grid>
          <Grid item sm={1} style={{ textAlign: "right" }}>
            {!praiseChartsAccessToken && (<Button variant="contained" color="primary" onClick={() => openOAuthPopup()}>Link</Button>)}
            {praiseChartsAccessToken && (<Button variant="contained" color="error" onClick={unlinkPraiseCharts}>Unlink</Button>)}
          </Grid>
        </Grid>


      </DisplayBox>

    </>
  )
}
