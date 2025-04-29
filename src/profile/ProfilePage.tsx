import { Grid, Icon, TextField, Checkbox, Typography, Button, InputAdornment, IconButton } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputBox, ApiHelper, ErrorMessages, UserHelper, Locale, Banner } from "@churchapps/apphelper"
import { NotificationPreferences } from "./components/NotificationPreferences";
import { LinkedAccounts } from "./components/LinkedAccounts";

export const ProfilePage = () => {
  const [password, setPassword] = useState<string>("");
  const [passwordVerify, setPasswordVerify] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [optedOut, setOptedOut] = useState<boolean>(false);
  const [errors, setErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const initData = () => {
    const { email, firstName, lastName } = UserHelper.user;
    setFirstName(firstName);
    setLastName(lastName);
    setEmail(email);

    if (UserHelper.person) {
      const { optedOut } = UserHelper.person;
      setOptedOut(optedOut);
    }
  }

  const handleSave = () => {
    if (validate()) {
      const promises: Promise<any>[] = [];

      if (password.length >= 8) {
        promises.push(ApiHelper.post("/users/updatePassword", { newPassword: password }, "MembershipApi"));
      }

      if (areNamesChanged()) {
        promises.push(ApiHelper.post("/users/setDisplayName", { firstName, lastName }, "MembershipApi"));
      }

      if (email !== UserHelper.user.email) {
        promises.push(ApiHelper.post("/users/updateEmail", { email }, "MembershipApi"));
      }

      promises.push(ApiHelper.post("/users/updateOptedOut", {
        personId: UserHelper.person.id,
        optedOut
      }, "MembershipApi"));

      Promise.all(promises).then(() => {
        UserHelper.user.firstName = firstName;
        UserHelper.user.lastName = lastName;
        UserHelper.user.email = email;
        UserHelper.person.optedOut = optedOut;
        alert(Locale.label("profile.profilePage.saveChange"));
      });
    }
  }

  const areNamesChanged = () => {
    const { firstName: first, lastName: last } = UserHelper.user;
    return firstName !== first || lastName !== last;
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
    const validationRules = [
      { condition: !firstName, message: Locale.label("profile.profilePage.firstMsg") },
      { condition: !lastName, message: Locale.label("profile.profilePage.lastMsg") },
      { condition: email === "", message: Locale.label("profile.profilePage.emailMsg") },
      { condition: email !== "" && !validateEmail(email), message: Locale.label("profile.profilePage.valEmail") },
      { condition: password !== passwordVerify, message: Locale.label("profile.profilePage.passMatch") },
      { condition: password !== "" && password.length < 8, message: Locale.label("profile.profilePage.passLong") }
    ];

    const errors = validationRules
      .filter(rule => rule.condition)
      .map(rule => rule.message);

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
      <Banner>
        <h1>{Locale.label("profile.profilePage.profEdit")}</h1>
      </Banner>
      <div id="mainContent">
        <ErrorMessages errors={errors} />
        <InputBox headerText={Locale.label("profile.profilePage.profEdit")} saveFunction={handleSave}>
          <Grid container spacing={3}>
            <Grid item>
              <TextField fullWidth type="email" name="email" label={Locale.label("person.email")} value={email} onChange={handleChange} />
              <TextField type={showPassword ? "text" : "password"} fullWidth name="password" label={Locale.label("profile.profilePage.passNew")} value={password} onChange={handleChange} InputProps={{
                endAdornment: (<InputAdornment position="end"><IconButton aria-label="toggle password visibility" onClick={() => { setShowPassword(!showPassword) }}>{showPassword ? <Icon>visibility</Icon> : <Icon>visibility_off</Icon>}</IconButton></InputAdornment>)
              }} />
            </Grid>
            <Grid item>
              <TextField fullWidth name="firstName" label={Locale.label("person.firstName")} value={firstName} onChange={handleChange} />
              <TextField type={showPassword ? "text" : "password"} fullWidth name="passwordVerify" label={Locale.label("profile.profilePage.passVer")} value={passwordVerify} onChange={handleChange} InputProps={{
                endAdornment: (<InputAdornment position="end"><IconButton aria-label="toggle password visibility" onClick={() => { setShowPassword(!showPassword) }}>{showPassword ? <Icon>visibility</Icon> : <Icon>visibility_off</Icon>}</IconButton></InputAdornment>)
              }} />
            </Grid>
            <Grid item>
              <TextField fullWidth name="lastName" label={Locale.label("person.lastName")} value={lastName} onChange={handleChange} />
              <Checkbox name="optedOut" checked={optedOut} onChange={handleChange} /> <label htmlFor="optedOut">{Locale.label("profile.profilePage.noDirect")}</label>
            </Grid>
          </Grid>
        </InputBox>

        <LinkedAccounts />
        <NotificationPreferences />

        <InputBox headerText={Locale.label("profile.profilePage.accDel")} saveFunction={null}>
          <Typography color="GrayText">{Locale.label("profile.profilePage.permWarn")}</Typography>
          <Button variant="outlined" color="error" sx={{ marginTop: 4 }} onClick={handleAccountDelete}>{Locale.label("profile.profilePage.delAcc")}</Button>
        </InputBox>
      </div>
    </>
  );
}
