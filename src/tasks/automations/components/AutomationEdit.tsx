import { FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import React from "react";
import { ErrorMessages, InputBox, AutomationInterface, ApiHelper, Locale } from "@churchapps/apphelper";

interface Props {
  automation: AutomationInterface,
  onCancel: () => void,
  onSave: (automation: AutomationInterface) => void,
  onDelete?: () => void,
}

export const AutomationEdit = (props: Props) => {
  const [automation, setAutomation] = React.useState<AutomationInterface>(null);
  const [errors, setErrors] = React.useState([]);

  const init = () => {
    setAutomation(props.automation);
  }

  React.useEffect(init, [props.automation]);

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
  const handleDelete = () => { ApiHelper.delete("/automations/" + automation.id, "DoingApi").then(() => { props.onDelete(); }); }
  const checkDelete = automation?.id ? handleDelete : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const val = e.target.value;
    const a = { ...automation };
    switch (e.target.name) {
      case "title":
        a.title = val;
        break;
      case "recurs":
        a.recurs = val;
        break;
    }
    setAutomation(a);
  }

  return (
    <InputBox headerIcon="settings_suggest" headerText={Locale.label("settings.automationEdit.autoEdit")} saveFunction={handleSave} cancelFunction={props.onCancel} deleteFunction={checkDelete} help="chums/automations">
      <ErrorMessages errors={errors} />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField fullWidth label={Locale.label("settings.automationEdit.title")} value={automation?.title || ""} name="title" onChange={handleChange} />
          <FormControl fullWidth>
            <InputLabel>{Locale.label("settings.automationEdit.rep")}</InputLabel>
            <Select fullWidth label={Locale.label("settings.automationEdit.rep")} value={automation?.recurs || ""} name="recurs" onChange={handleChange}>
              <MenuItem value="never">{Locale.label("settings.automationEdit.never")}</MenuItem>
              <MenuItem value="yearly">{Locale.label("settings.automationEdit.yearly")}</MenuItem>
              <MenuItem value="monthly">{Locale.label("settings.automationEdit.monthly")}</MenuItem>
            </Select>
          </FormControl>

        </Grid>
      </Grid>
    </InputBox>
  );
}
