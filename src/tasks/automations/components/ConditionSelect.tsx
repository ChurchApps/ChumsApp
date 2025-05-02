import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";
import { ConditionHelper } from "../../components";
import { ConditionInterface, Locale } from "@churchapps/apphelper";
import { useAppTranslation } from "../../../contexts/TranslationContext";

interface Props {
  condition: ConditionInterface,
  onChange: (condition: ConditionInterface) => void
}

export const ConditionSelect = (props: Props) => {
  const { t } = useAppTranslation();

  const init = () => {
    const c = { ...props.condition };
    if (!c.value) {
      c.value = "";
      if (c.field === "gender") c.value = "Unknown";
      if (c.field === "maritalStatus") c.value = "Unknown";
      if (c.field === "membershipStatus") c.value = "Visitor";
      c.operator = "=";
    }
    c.label = ConditionHelper.getLabel(c);
    props.onChange(c);
  }

  React.useEffect(init, [props.condition.field]); //eslint-disable-line

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const c = { ...props.condition };
    const val = e.target.value;
    switch (e.target.name) {
      case "value":
        c.value = val;
        break;
      case "operator":
        c.operator = val;
        break;
    }
    c.label = ConditionHelper.getLabel(c);
    props.onChange(c);
  }

  const getGender = () => (
    <FormControl fullWidth>
      <InputLabel>{Locale.label("person.gender")}</InputLabel>
      <Select fullWidth label={Locale.label("person.gender")} value={props.condition.value || ""} name="value" onChange={handleChange}>
        <MenuItem value="Unknown">{Locale.label("person.unknown")}</MenuItem>
        <MenuItem value="Male">{Locale.label("person.male")}</MenuItem>
        <MenuItem value="Female">{Locale.label("person.female")}</MenuItem>
      </Select>
    </FormControl>
  )

  const getMaritalStatus = () => (
    <FormControl fullWidth>
      <InputLabel>{t("tasks.conditionSelect.marital")}</InputLabel>
      <Select fullWidth label={t("tasks.conditionSelect.marital")} value={props.condition.value || ""} name="value" onChange={handleChange}>
        <MenuItem value="Single">{t("tasks.conditionSelect.single")}</MenuItem>
        <MenuItem value="Married">{t("tasks.conditionSelect.married")}</MenuItem>
        <MenuItem value="Divorced">{t("tasks.conditionSelect.divorced")}</MenuItem>
        <MenuItem value="Widowed">{t("tasks.conditionSelect.widowed")}</MenuItem>
      </Select>
    </FormControl>
  )

  const getMembershipStatus = () => (
    <FormControl fullWidth>
      <InputLabel>{t("tasks.conditionSelect.member")}</InputLabel>
      <Select fullWidth label={t("tasks.conditionSelect.member")} value={props.condition.value || ""} name="value" onChange={handleChange}>
        <MenuItem value="Member">{t("tasks.conditionSelect.member")}</MenuItem>
        <MenuItem value="Staff">{t("tasks.conditionSelect.staff")}</MenuItem>
        <MenuItem value="Visitor">{t("tasks.conditionSelect.visitor")}</MenuItem>
        <MenuItem value="Guest">{t("tasks.conditionSelect.guest")}</MenuItem>
      </Select>
    </FormControl>
  )

  const getValueField = () => {
    let result = <></>;
    switch (props.condition.field) {
      case "gender": result = getGender(); break;
      case "maritalStatus": result = getMaritalStatus(); break;
      case "membershipStatus": result = getMembershipStatus(); break;
    }
    return result;
  }

  console.log(props.condition.operator)
  return <>
    <FormControl fullWidth>
      <InputLabel>{t("tasks.conditionSelect.op")}</InputLabel>
      <Select fullWidth label={t("tasks.conditionSelect.op")} value={props.condition.operator || ""} name="operator" onChange={handleChange}>
        <MenuItem key="/equals" value="=">=</MenuItem>
        <MenuItem key="/notEquals" value="!=">!=</MenuItem>
      </Select>
    </FormControl>
    {getValueField()}
  </>
}
