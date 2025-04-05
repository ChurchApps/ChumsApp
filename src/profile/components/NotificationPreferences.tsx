import { Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import React, { useState } from "react";
import { InputBox, ApiHelper, NotificationPreferenceInterface, Locale } from "@churchapps/apphelper"

export const NotificationPreferences = () => {

  const [pref, setPref] = useState<NotificationPreferenceInterface>({} as NotificationPreferenceInterface);

  const initData = () => {
    ApiHelper.get("/notificationPreferences/my", "MessagingApi").then(data => { setPref(data); });
  }


  const handleNotificationSave = () => {
    ApiHelper.post("/notificationPreferences", [pref], "MessagingApi").then(() => {
      alert(Locale.label("profile.profilePage.saveChange"));
    });
  }

  const handlePrefChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
    const p = { ...pref } as NotificationPreferenceInterface;
    let value = e.target.value;
    switch (e.target.name) {
      case "push": p.allowPush = value === "true"; break;
      case "emailFrequency": p.emailFrequency = value; break;
    }
    setPref(p);
  }

  React.useEffect(initData, []);

  return (
    <>
      <InputBox headerText={Locale.label("profile.profilePage.notifPref")} saveFunction={handleNotificationSave}>
        <p>{Locale.label("profile.profilePage.notifMsg")}</p>
        <Grid container spacing={3}>
          <Grid item sm={6}>
            <FormControl fullWidth>
              <InputLabel id="push">{Locale.label("profile.profilePage.notifPush")}</InputLabel>
              <Select fullWidth name="push" labelId="push" label={Locale.label("profile.profilePage.notifPush")} value={pref.allowPush?.toString() || "true"} onChange={handlePrefChange}>
                <MenuItem value="true">{Locale.label("common.yes")}</MenuItem>
                <MenuItem value="false">{Locale.label("common.no")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={6}>
            <FormControl fullWidth>
              <InputLabel id="emailFrequency">{Locale.label("profile.profilePage.freqEmail")}</InputLabel>
              <Select fullWidth name="emailFrequency" labelId="emailFrequency" label={Locale.label("profile.profilePage.freqEmail")} value={pref.emailFrequency || "daily"} onChange={handlePrefChange}>
                <MenuItem value="never">{Locale.label("profile.profilePage.never")}</MenuItem>
                <MenuItem value="individual">{Locale.label("profile.profilePage.indiv")}</MenuItem>
                <MenuItem value="daily">{Locale.label("profile.profilePage.daily")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </InputBox>

    </>
  );
}
