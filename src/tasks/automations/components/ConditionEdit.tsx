import { FormControl, InputLabel, ListSubheader, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";
import { ErrorMessages, InputBox, ApiHelper, ConditionInterface } from "../../components";
import { ConditionAttendance } from "./ConditionAttendance";
import { ConditionDate } from "./ConditionDate";
import { ConditionSelect } from "./ConditionSelect";
import { ConditionText } from "./ConditionText";

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
    let result = <ConditionText condition={condition} onChange={(c) => setCondition(c)} />
    switch (condition?.field) {
      case "today":
      case "birthDate":
      case "anniversary":
        result = <ConditionDate condition={condition} onChange={(c) => setCondition(c)} />
        break;
      case "attended":
        result = <ConditionAttendance condition={condition} onChange={(c) => setCondition(c)} />
        break;
      case "membershipStatus":
      case "maritalStatus":
      case "gender":
        result = <ConditionSelect condition={condition} onChange={(c) => setCondition(c)} />
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
          <MenuItem value="today">Todays Date</MenuItem>

          <ListSubheader>Name</ListSubheader>
          <MenuItem key="/displayName" value="displayName">Display Name</MenuItem>
          <MenuItem key="/firstName" value="firstName">First Name</MenuItem>
          <MenuItem key="/lastName" value="lastName">Last Name</MenuItem>
          <MenuItem key="/middleName" value="middleName">Middle Name</MenuItem>
          <MenuItem key="/nickName" value="nickName">Nick Name</MenuItem>

          <ListSubheader>Personal Attributes</ListSubheader>
          <MenuItem key="/birthDate" value="birthDate">Birth Date</MenuItem>
          <MenuItem key="/gender" value="gender">Gender</MenuItem>
          <MenuItem key="/maritalStatus" value="maritalStatus">Marital Status</MenuItem>
          <MenuItem key="/anniversary" value="anniversary">Anniversary</MenuItem>
          <MenuItem key="/membershipStatus" value="membershipStatus">Membership Status</MenuItem>

          <ListSubheader>Contact Info</ListSubheader>
          <MenuItem key="/phone" value="phone">Phone</MenuItem>
          <MenuItem key="/email" value="email">Email</MenuItem>
          <MenuItem key="/address" value="address">Address</MenuItem>
          <MenuItem key="/city" value="city">City</MenuItem>
          <MenuItem key="/state" value="state">State/Province</MenuItem>
          <MenuItem key="/zip" value="zip">Zip/Postal</MenuItem>

          <ListSubheader>Coming Soon</ListSubheader>
          <MenuItem value="attended">Attended...</MenuItem>
          <MenuItem value="gave">Gave to...</MenuItem>
        </Select>
      </FormControl>
      {getQuestionDetails()}
    </InputBox>
  );
}
