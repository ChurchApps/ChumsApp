import { FormControl, Grid, InputLabel, MenuItem, Select, TextField, type SelectChangeEvent } from "@mui/material";
import React from "react";
import { ErrorMessages, InputBox, type AutomationInterface, ApiHelper, Locale } from "@churchapps/apphelper";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
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
    <InputBox headerIcon="settings_suggest" headerText={Locale.label("tasks.automationEdit.autoEdit")} saveFunction={handleSave} cancelFunction={props.onCancel} deleteFunction={checkDelete} help="chums/automations">
      <ErrorMessages errors={errors} />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth label={Locale.label("common.title")} value={automation?.title || ""} name="title" onChange={handleChange} data-testid="automation-title-input" aria-label="Automation title" />
          <FormControl fullWidth>
            <InputLabel>{Locale.label("tasks.automationEdit.rep")}</InputLabel>
            <Select fullWidth label={Locale.label("tasks.automationEdit.rep")} value={automation?.recurs || ""} name="recurs" onChange={handleChange} data-testid="recurs-select" aria-label="Recurrence">
              <MenuItem value="never">{Locale.label("tasks.automationEdit.never")}</MenuItem>
              <MenuItem value="yearly">{Locale.label("tasks.automationEdit.yearly")}</MenuItem>
              <MenuItem value="monthly">{Locale.label("tasks.automationEdit.monthly")}</MenuItem>
            </Select>
          </FormControl>

        </Grid>
      </Grid>
    </InputBox>
  );
}
