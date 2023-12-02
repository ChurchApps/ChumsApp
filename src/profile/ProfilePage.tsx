import { Grid, Icon, TextField, Checkbox, Typography, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputBox, ApiHelper, ErrorMessages, UserHelper, NotificationPreferenceInterface } from "@churchapps/apphelper"

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
        alert("Changes saved.");
      });
    }
  }

  const handleNotificationSave = () => {
    ApiHelper.post("/notificationPreferences", [pref], "MessagingApi").then(() => {
      alert("Changes saved.");
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
    if (!firstName) errors.push("Please enter firstname");
    if (!lastName) errors.push("Please enter lastname");
    if (email === "") errors.push("Please enter an email address.");
    else if (!validateEmail(email)) errors.push("Please enter a valid email address");
    if (password !== passwordVerify) errors.push("Passwords do not match.");
    if (password !== "" && password.length < 8) errors.push("Please enter a password that is at least 8 characters long.");

    setErrors(errors);
    return errors.length === 0;
  }

  const handleAccountDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete your account?")) {
      ApiHelper.delete("/users", "MembershipApi").then(() => {
        navigate("/logout", { replace: true })
      })
    }
  }

  React.useEffect(initData, []);

  return (
    <>
      <h1><Icon>person</Icon> Edit Profile</h1>
      <ErrorMessages errors={errors} />
      <InputBox headerText="Edit Profile" saveFunction={handleSave}>
        <Grid container spacing={3}>
          <Grid item>
            <TextField fullWidth type="email" name="email" label="Email" value={email} onChange={handleChange} />
            <TextField fullWidth name="firstName" label="First Name" value={firstName} onChange={handleChange} />
            <TextField fullWidth name="lastName" label="Last Name" value={lastName} onChange={handleChange} />
          </Grid>
          <Grid item>
            <TextField type="password" fullWidth name="password" label="New password" value={password} onChange={handleChange} />
            <TextField type="password" fullWidth name="passwordVerify" label="Verify password" value={passwordVerify} onChange={handleChange} />
            <Checkbox name="optedOut" checked={optedOut} onChange={handleChange} />
            <label htmlFor="optedOut">Directory opt-out</label>
          </Grid>
        </Grid>
      </InputBox>

      <InputBox headerText="Notification Preferences" saveFunction={handleNotificationSave}>
        <p>Choose how you would like to receive updates about private messages, conversations, forms and other notifications.</p>
        <Grid container spacing={3}>
          <Grid item sm={6}>
            <FormControl fullWidth>
              <InputLabel id="push">Allow Push Notifications</InputLabel>
              <Select fullWidth name="push" labelId="push" label="Allow Push Notifications" value={pref.allowPush?.toString() || "true"} onChange={handlePrefChange}>
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={6}>
            <FormControl fullWidth>
              <InputLabel id="emailFrequency">Email Frequency</InputLabel>
              <Select fullWidth name="emailFrequency" labelId="emailFrequency" label="Email Frequency" value={pref.emailFrequency || "daily"} onChange={handlePrefChange}>
                <MenuItem value="never">Never</MenuItem>
                <MenuItem value="individual">Individual</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </InputBox>

      <InputBox headerText="Account Deletion" saveFunction={null}>
        <Typography color="GrayText">Careful, these actions are permanent</Typography>
        <Button variant="outlined" color="error" sx={{ marginTop: 4 }} onClick={handleAccountDelete}>Delete my account</Button>
      </InputBox>
    </>
  );
}
