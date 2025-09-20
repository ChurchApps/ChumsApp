import React from "react";
import { TextField } from "@mui/material";
import { ApiHelper, ErrorMessages, InputBox } from "@churchapps/apphelper";

interface Props {
  updatedFunction: () => void;
}

export const PairScreen = (props: Props) => {
  const [code, setCode] = React.useState<string>("");
  const [errors, setErrors] = React.useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setErrors([]);
    const value = e.target.value;
    switch (e.target.name) {
      case "code":
        setCode(value);
        break;
    }
  };

  const validate = () => {
    const result = [];
    if (!code) result.push("Please enter a pairing code.");
    setErrors(result);
    return result.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      ApiHelper.get("/devices/pair/" + code, "MessagingApi").then((data) => {
        if (data.success) props.updatedFunction();
        else setErrors(["Invalid pairing code."]);
      });
    }
  };

  return (
    <>
      <ErrorMessages errors={errors} />
      <InputBox headerText="Add Screen" headerIcon="tv" saveFunction={handleSave} cancelFunction={props.updatedFunction}>
        <TextField fullWidth label="Pairing Code" id="code" name="code" type="text" value={code} onChange={handleChange} />
      </InputBox>
    </>
  );
};
