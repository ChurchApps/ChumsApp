import { Grid, Icon, TextField } from "@mui/material";
import React from "react";
import { ErrorMessages, InputBox, AutomationInterface, ApiHelper } from "../../components";

interface Props {
  onCancel: () => void,
  onSave: (automation: AutomationInterface) => void,
}

export const AutomationEdit = (props: Props) => {
  const [automation, setAutomation] = React.useState<AutomationInterface>(null);
  const [errors, setErrors] = React.useState([]);


  const validate = () => {
    const result: string[] = [];
    setErrors(result);
    return result.length === 0;
  }

  const handleSave = async () => {
    if (validate()) {
      ApiHelper.post("/automations", [automation], "DoingApi").then(d => {
        props.onSave(d[0]);
      });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    switch (e.target.name) {
      case "title":
        const a = { ...automation };
        a.title = val;
        setAutomation(a);
        break;
    }
  }

  return (
    <InputBox headerIcon="settings_suggest" headerText="Edit Automation" saveFunction={handleSave} cancelFunction={props.onCancel}>
      <ErrorMessages errors={errors} />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField fullWidth label="Title" value={automation?.title || ""} name="title" onChange={handleChange} />
        </Grid>
      </Grid>
    </InputBox>
  );
}
