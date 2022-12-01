import { Grid, Icon, TextField } from "@mui/material";
import React, { useState } from "react";
import { InputBox, ApiHelper, ErrorMessages, UserHelper } from "./components"

export const ProfilePage = () => {
  const [password, setPassword] = useState<string>("");
  const [passwordVerify, setPasswordVerify] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState([]);

  const initData = () => {
    const { email, firstName, lastName } = UserHelper.user;
    setFirstName(firstName);
    setLastName(lastName);
    setEmail(email);
  }

  const handleSave = () => {
    if (validate()) {
      const promises: Promise<any>[] = [];
      if (password.length >= 8) promises.push(ApiHelper.post("/users/updatePassword", { newPassword: password }, "MembershipApi"));
      if (areNamesChanged()) promises.push(ApiHelper.post("/users/setDisplayName", { firstName, lastName }, "MembershipApi"));
      if (email !== UserHelper.user.email) promises.push(ApiHelper.post("/users/updateEmail", { email: email }, "MembershipApi"));

      Promise.all(promises).then(() => {
        UserHelper.user.firstName = firstName;
        UserHelper.user.lastName = lastName;
        UserHelper.user.email = email;
        alert("Changes saved.");
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
          </Grid>
        </Grid>
      </InputBox>
    </>
  );
}
