import { Grid, Icon, TextField, Checkbox, Typography, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputBox, ApiHelper, ErrorMessages, UserHelper, NotificationPreferenceInterface, Locale } from "@churchapps/apphelper"

export const ProfilePage = () => {
  const [password, setPassword] = useState<string>("");
  const [passwordVerify, setPasswordVerify] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [optedOut, setOptedOut] = useState<boolean>(false);
  const [errors, setErrors] = useState([]);
  const [pref, setPref] = useState<NotificationPreferenceInterface>({} as NotificationPreferenceInterface);
  const navigate = useNavigate();

  const initData = () => {
    const { email, firstName, lastName } = UserHelper.user;
    setFirstName(firstName);
    setLastName(lastName);
    setEmail(email);

    if(UserHelper.person) {
      const { optedOut } = UserHelper.person;
      setOptedOut(optedOut);
    }

    ApiHelper.get("/notificationPreferences/my", "MessagingApi").then(data => { setPref(data); });

  }

  const handleSave = () => {
    if (validate()) {
      const promises: Promise<any>[] = [];
      if (password.length >= 8) promises.push(ApiHelper.post("/users/updatePassword", { newPassword: password }, "MembershipApi"));
      if (areNamesChanged()) promises.push(ApiHelper.post("/users/setDisplayName", { firstName, lastName }, "MembershipApi"));
      if (email !== UserHelper.user.email) promises.push(ApiHelper.post("/users/updateEmail", { email: email }, "MembershipApi"));
      promises.push(ApiHelper.post("/users/updateOptedOut", {personId: UserHelper.person.id, optedOut: optedOut }, "MembershipApi"));

      Promise.all(promises).then(() => {
        UserHelper.user.firstName = firstName;
        UserHelper.user.lastName = lastName;
        UserHelper.user.email = email;
        UserHelper.person.optedOut = optedOut;
        alert(Locale.label("profile.profilePage.saveChange"));
      });
    }
  }

  const handleNotificationSave = () => {
    ApiHelper.post("/notificationPreferences", [pref], "MessagingApi").then(() => {
      alert(Locale.label("profile.profilePage.saveChange"));
    });
  }

  const areNamesChanged = () => {
    const { firstName: first, lastName: last } = UserHelper.user;
    return firstName !== first || lastName !== last;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    switch (e.currentTarget.name) {
      case "firstName":
        setFirstName(val);
        break;
      case "lastName":
        setLastName(val);
        break;
      case "email":
        setEmail(val);
        break;
      case "optedOut":
        setOptedOut(e.currentTarget.checked);
        break;
      case "password":
        setPassword(val);
        break;
      case "passwordVerify":
        setPasswordVerify(val);
        break;
    }
  }

  const validateEmail = (email: string) => (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email))

  const validate = () => {
    let errors = [];
    if (!firstName) errors.push(Locale.label("profile.profilePage.firstMsg"));
    if (!lastName) errors.push(Locale.label("profile.profilePage.lastMsg"));
    if (email === "") errors.push(Locale.label("profile.profilePage.emailMsg"));
    else if (!validateEmail(email)) errors.push(Locale.label("profile.profilePage.valEmail"));
    if (password !== passwordVerify) errors.push(Locale.label("profile.profilePage.passMatch"));
    if (password !== "" && password.length < 8) errors.push(Locale.label("profile.profilePage.passLong"));

    setErrors(errors);
    return errors.length === 0;
  }

  const handleAccountDelete = () => {
    if (window.confirm(Locale.label("profile.profilePage.confirmMsg"))) {
      ApiHelper.delete("/users", "MembershipApi").then(() => {
        navigate("/logout", { replace: true })
      })
    }
  }

  React.useEffect(initData, []);

  return (
    <>
      <h1><Icon>person</Icon> {Locale.label("profile.profilePage.profEdit")}</h1>
      <ErrorMessages errors={errors} />
      <InputBox headerText={Locale.label("profile.profilePage.profEdit")} saveFunction={handleSave}>
        <Grid container spacing={3}>
          <Grid item>
            <TextField fullWidth type="email" name="email" label={Locale.label("profile.profilePage.email")} value={email} onChange={handleChange} />
            <TextField fullWidth name="firstName" label={Locale.label("profile.profilePage.firstName")} value={firstName} onChange={handleChange} />
            <TextField fullWidth name="lastName" label={Locale.label("profile.profilePage.lastName")} value={lastName} onChange={handleChange} />
          </Grid>
          <Grid item>
            <TextField type="password" fullWidth name="password" label={Locale.label("profile.profilePage.passNew")} value={password} onChange={handleChange} />
            <TextField type="password" fullWidth name="passwordVerify" label={Locale.label("profile.profilePage.passVer")} value={passwordVerify} onChange={handleChange} />
            <Checkbox name="optedOut" checked={optedOut} onChange={handleChange} />
            <label htmlFor="optedOut">{Locale.label("profile.profilePage.noDirect")}</label>
          </Grid>
        </Grid>
      </InputBox>

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

      <InputBox headerText={Locale.label("profile.profilePage.accDel")} saveFunction={null}>
        <Typography color="GrayText">{Locale.label("profile.profilePage.permWarn")}</Typography>
        <Button variant="outlined" color="error" sx={{ marginTop: 4 }} onClick={handleAccountDelete}>{Locale.label("profile.profilePage.delAcc")}</Button>
      </InputBox>
    </>
  );
}
