import { FormControl, InputLabel, ListSubheader, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";
import { ErrorMessages, InputBox, ApiHelper, ConditionInterface, Locale } from "@churchapps/apphelper";
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
    const conf = window.confirm(Locale.label("tasks.conditionEdit.confirmMsg"));
    if (!conf) return;
    await ApiHelper.delete("/conditions/" + condition.id, "DoingApi")
    props.onSave(null);
  }

  if (!condition) return <></>
  return (
    <InputBox headerIcon="settings_suggest" headerText={Locale.label("tasks.conditionEdit.conEdit")} saveFunction={handleSave} cancelFunction={props.onCancel} deleteFunction={condition?.id ? handleDelete : undefined} help="chums/automations">
      <ErrorMessages errors={errors} />
      <FormControl fullWidth>
        <InputLabel>{Locale.label("tasks.conditionEdit.conType")}</InputLabel>
        <Select fullWidth label={Locale.label("tasks.conditionEdit.conType")} value={condition.field} name="field" onChange={handleChange}>
          <ListSubheader>{Locale.label("tasks.conditionEdit.gen")}</ListSubheader>
          <MenuItem value="today">{Locale.label("tasks.conditionEdit.today")}</MenuItem>

          <ListSubheader>{Locale.label("tasks.conditionEdit.name")}</ListSubheader>
          <MenuItem key="/displayName" value="displayName">{Locale.label("tasks.conditionEdit.disName")}</MenuItem>
          <MenuItem key="/firstName" value="firstName">{Locale.label("tasks.conditionEdit.firstName")}</MenuItem>
          <MenuItem key="/lastName" value="lastName">{Locale.label("tasks.conditionEdit.lastName")}</MenuItem>
          <MenuItem key="/middleName" value="middleName">{Locale.label("tasks.conditionEdit.middleName")}</MenuItem>
          <MenuItem key="/nickName" value="nickName">{Locale.label("tasks.conditionEdit.nickName")}</MenuItem>

          <ListSubheader>{Locale.label("tasks.conditionEdit.persAtt")}</ListSubheader>
          <MenuItem key="/birthDate" value="birthDate">{Locale.label("tasks.conditionEdit.bDate")}</MenuItem>
          <MenuItem key="/gender" value="gender">{Locale.label("tasks.conditionEdit.gender")}</MenuItem>
          <MenuItem key="/maritalStatus" value="maritalStatus">{Locale.label("tasks.conditionEdit.marStat")}</MenuItem>
          <MenuItem key="/anniversary" value="anniversary">{Locale.label("tasks.conditionEdit.anni")}</MenuItem>
          <MenuItem key="/membershipStatus" value="membershipStatus">{Locale.label("tasks.conditionEdit.memShipStat")}</MenuItem>

          <ListSubheader>{Locale.label("tasks.conditionEdit.conInfo")}</ListSubheader>
          <MenuItem key="/phone" value="phone">{Locale.label("tasks.conditionEdit.phone")}</MenuItem>
          <MenuItem key="/email" value="email">{Locale.label("tasks.conditionEdit.email")}</MenuItem>
          <MenuItem key="/address" value="address">{Locale.label("tasks.conditionEdit.address")}</MenuItem>
          <MenuItem key="/city" value="city">{Locale.label("tasks.conditionEdit.city")}</MenuItem>
          <MenuItem key="/state" value="state">{Locale.label("tasks.conditionEdit.state")}</MenuItem>
          <MenuItem key="/zip" value="zip">{Locale.label("tasks.conditionEdit.zip")}</MenuItem>

        </Select>
      </FormControl>
      {getQuestionDetails()}
    </InputBox>
  );
}
/*
<ListSubheader>Coming Soon</ListSubheader>
          <MenuItem value="attended">Attended...</MenuItem>
          <MenuItem value="gave">Gave to...</MenuItem>
*/
