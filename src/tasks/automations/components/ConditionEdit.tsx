import { FormControl, InputLabel, ListSubheader, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";
import { ErrorMessages, InputBox, ApiHelper, ConditionInterface } from "@churchapps/apphelper";
import { ConditionAttendance } from "./ConditionAttendance";
import { ConditionDate } from "./ConditionDate";
import { ConditionSelect } from "./ConditionSelect";
import { ConditionText } from "./ConditionText";
import { useAppTranslation } from "../../../contexts/TranslationContext";

interface Props {
  condition: ConditionInterface,
  onCancel: () => void,
  onSave: (condition: ConditionInterface) => void,
}

export const ConditionEdit = (props: Props) => {
  const { t } = useAppTranslation();
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
    const conf = window.confirm(t("tasks.conditionEdit.confirmMsg"));
    if (!conf) return;
    await ApiHelper.delete("/conditions/" + condition.id, "DoingApi")
    props.onSave(null);
  }

  if (!condition) return <></>
  return (
    <InputBox headerIcon="settings_suggest" headerText={t("tasks.conditionEdit.conEdit")} saveFunction={handleSave} cancelFunction={props.onCancel} deleteFunction={condition?.id ? handleDelete : undefined} help="chums/automations">
      <ErrorMessages errors={errors} />
      <FormControl fullWidth>
        <InputLabel>{t("tasks.conditionEdit.conType")}</InputLabel>
        <Select fullWidth label={t("tasks.conditionEdit.conType")} value={condition.field} name="field" onChange={handleChange}>
          <ListSubheader>{t("tasks.conditionEdit.gen")}</ListSubheader>
          <MenuItem value="today">{t("tasks.conditionEdit.today")}</MenuItem>

          <ListSubheader>{t("common.name")}</ListSubheader>
          <MenuItem key="/displayName" value="displayName">{t("person.displayName")}</MenuItem>
          <MenuItem key="/firstName" value="firstName">{t("person.firstName")}</MenuItem>
          <MenuItem key="/lastName" value="lastName">{t("person.lastName")}</MenuItem>
          <MenuItem key="/middleName" value="middleName">{t("person.middleName")}</MenuItem>
          <MenuItem key="/nickName" value="nickName">{t("person.nickName")}</MenuItem>

          <ListSubheader>{t("tasks.conditionEdit.persAtt")}</ListSubheader>
          <MenuItem key="/birthDate" value="birthDate">{t("person.birthDate")}</MenuItem>
          <MenuItem key="/gender" value="gender">{t("person.gender")}</MenuItem>
          <MenuItem key="/maritalStatus" value="maritalStatus">{t("person.maritalStatus")}</MenuItem>
          <MenuItem key="/anniversary" value="anniversary">{t("person.anniversary")}</MenuItem>
          <MenuItem key="/membershipStatus" value="membershipStatus">{t("person.membershipStatus")}</MenuItem>

          <ListSubheader>{t("tasks.conditionEdit.conInfo")}</ListSubheader>
          <MenuItem key="/phone" value="phone">{t("person.phone")}</MenuItem>
          <MenuItem key="/email" value="email">{t("person.email")}</MenuItem>
          <MenuItem key="/address" value="address">{t("person.address")}</MenuItem>
          <MenuItem key="/city" value="city">{t("person.city")}</MenuItem>
          <MenuItem key="/state" value="state">{t("person.state")}</MenuItem>
          <MenuItem key="/zip" value="zip">{t("person.zip")}</MenuItem>

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
