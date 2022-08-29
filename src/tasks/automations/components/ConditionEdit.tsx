import { ResetTvOutlined } from "@mui/icons-material";
import { FormControl, InputLabel, ListSubheader, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";
import { ErrorMessages, InputBox, ApiHelper, ConditionInterface } from "../../components";
import { ConditionAttendance } from "./ConditionAttendance";
import { ConditionDay } from "./ConditionDay";
import { ConditionPerson } from "./ConditionPerson";

interface Props {
  condition: ConditionInterface,
  onCancel: () => void,
  onSave: (condition: ConditionInterface) => void,
}

export const ConditionEdit = (props: Props) => {
  const [condition, setCondition] = React.useState<ConditionInterface>(null);
  const [errors, setErrors] = React.useState([]);

  const init = () => {
    setCondition(props.condition);
  }

  React.useEffect(init, [props.condition]);

  const validate = () => {
    const result: string[] = [];
    setErrors(result);
    return result.length === 0;
  }

  const handleSave = async () => {
    if (validate()) {
      ApiHelper.post("/conditions", [condition], "DoingApi").then(d => {
        props.onSave(d[0]);
      });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const val = e.target.value;
    const c = { ...condition };
    switch (e.target.name) {
      case "field":
        c.field = val;
        c.value = "";
        c.fieldData = "";
        break;
    }
    setCondition(c);
  }

  const getQuestionDetails = () => {
    let result = <></>
    switch (condition?.field) {
      case "dayOfWeek":
      case "dayOfMonth":
        result = <ConditionDay condition={condition} onChange={(c) => setCondition(c)} />
        break;
      case "membershipStatus":
      case "maritalStatus":
        result = <ConditionPerson condition={condition} onChange={(c) => setCondition(c)} />
        break;
      case "attended":
        result = <ConditionAttendance condition={condition} onChange={(c) => setCondition(c)} />
        break;
    }
    return result;
  }


  const handleDelete = async () => {
    const conf = window.confirm("Are you sure you want to delete this condition?");
    if (!conf) return;
    await ApiHelper.delete("/conditions/" + condition.id, "DoingApi")
    props.onSave(null);
  }

  if (!condition) return <></>
  return (
    <InputBox headerIcon="settings_suggest" headerText="Edit Condition" saveFunction={handleSave} cancelFunction={props.onCancel} deleteFunction={condition?.id ? handleDelete : undefined}>
      <ErrorMessages errors={errors} />
      <FormControl fullWidth>
        <InputLabel>Condition Type</InputLabel>
        <Select fullWidth label="Condition Type" value={condition.field} name="field" onChange={handleChange}>
          <ListSubheader>General</ListSubheader>
          <MenuItem value="dayOfWeek">Day of Week</MenuItem>
          <MenuItem value="dayOfMonth">Day of Month</MenuItem>
          <ListSubheader>Person</ListSubheader>
          <MenuItem value="membershipStatus">Membership Status</MenuItem>
          <MenuItem value="maritalStatus">Marital Status</MenuItem>

          <MenuItem value="attended">Attended...</MenuItem>
          <MenuItem value="gave">Gave to...</MenuItem>
        </Select>
      </FormControl>
      {getQuestionDetails()}
    </InputBox>
  );
}
