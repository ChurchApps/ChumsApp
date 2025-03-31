import React, { useEffect } from "react";
import { Locale, DisplayBox, ApiHelper, SettingInterface } from "@churchapps/apphelper"
import { Button, Grid } from "@mui/material";

export const LinkedAccounts = () => {

  const [settings, setSettings] = React.useState<SettingInterface[]>([]);

  const loadData = () => {
    ApiHelper.get("/settings/my", "ContentApi").then(data => { setSettings(data); });
  }

  const unlinkPraiseCharts = async () => {
    const token = settings.find(s => s.keyName === "praiseChartsToken");
    const verifier = settings.find(s => s.keyName === "praiseChartsVerifier");
    if (verifier) await ApiHelper.delete("/settings/my/" + verifier.id, "ContentApi");
    if (token) await ApiHelper.delete("/settings/my/" + token.id, "ContentApi");
    loadData();
  }

  const openOAuthPopup = async () => {
    const returnUrl = "http://localhost:3101/pingback"
    const { authUrl } = await ApiHelper.get("/songDetails/praiseCharts/authUrl?returnUrl=" + encodeURIComponent(returnUrl), "ContentApi");
    const popup = window.open(authUrl, 'oauth', 'width=600,height=700');

    // Listen for message from popup
    window.addEventListener('message', async (event) => {
      if (event.origin !== window.location.origin) return;
      const { oauth_token, oauth_verifier } = event.data;
      popup.close();
      const settings: SettingInterface[] = [
        { keyName: "praiseChartsToken", value: oauth_token },
        { keyName: "praiseChartsVerifier", value: oauth_verifier }
      ]
      await ApiHelper.post("/settings/my", settings, "ContentApi");
      loadData();
      /*

      const result = await fetch('/api/oauth/access-token', {
        method: 'POST',
        body: JSON.stringify({ oauth_token, oauth_verifier }),
        headers: { 'Content-Type': 'application/json' }
      }).then(r => r.json());
      */


      // Do something with result (store token, update UI, etc.)
    });
  };

  useEffect(loadData, []);

  const praiseChartsToken = settings.find(s => s.keyName === "praiseChartsToken")?.value;

  return (
    <>
      <DisplayBox headerText={Locale.label("profile.profilePage.linkedAccounts")}>
        <br />
        <Grid container spacing={3}>
          <Grid item sm={3}>
            <img src="/images/praisecharts.png" alt="PraiseCharts" style={{ height: 40 }} />
          </Grid>
          <Grid item sm={1} style={{ textAlign: "right" }}>
            {!praiseChartsToken && (<Button variant="contained" color="primary" onClick={() => openOAuthPopup()}>Link</Button>)}
            {praiseChartsToken && (<Button variant="contained" color="error" onClick={unlinkPraiseCharts}>Unlink</Button>)}
          </Grid>
        </Grid>


      </DisplayBox>

    </>
  )
}
