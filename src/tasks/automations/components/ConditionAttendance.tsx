import React from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { ConditionInterface } from "@churchapps/apphelper";
import { useAppTranslation } from "../../../contexts/TranslationContext";

interface Props {
  condition: ConditionInterface,
  onChange: (condition: ConditionInterface) => void
}

export const ConditionAttendance = (props: Props) => {
  const { t } = useAppTranslation();

  const fieldData: any = (props.condition.fieldData) ? JSON.parse(props.condition.fieldData) : {}

  const init = () => {
    const c = { ...props.condition };
    c.operator = ">";
    c.value = "0";

    if (!fieldData.eventType) {
      fieldData.eventType = "any";
      c.fieldData = JSON.stringify(fieldData);
    }
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
    props.onChange(c);
  }

  const handleFieldDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const val = e.target.value;
    switch (e.target.name) {
      case "eventType":
        fieldData.eventType = val;
        break;
      case "campusId":
        fieldData.campusId = val;
        break;
    }
    const c = { ...props.condition };
    c.fieldData = JSON.stringify(fieldData);
    props.onChange(c);
  }
  /*
    const getCampus = () => (
      <FormControl fullWidth>
        <InputLabel>Campus</InputLabel>
        <Select fullWidth label="Campus" value={fieldData.campusId || ""} name="campusId" onChange={handleFieldDataChange}>
          <MenuItem value="Member">Member</MenuItem>
          <MenuItem value="Visitor">Visitor</MenuItem>
          <MenuItem value="Staff">Staff</MenuItem>
        </Select>
      </FormControl>
    )
  */
  return <>
    <FormControl fullWidth>
      <InputLabel>{t("tasks.conditionAttendance.op")}</InputLabel>
      <Select fullWidth label={t("tasks.conditionAttendance.op")} value={props.condition.operator || ""} name="operator" onChange={handleChange}>
        <MenuItem value="attendedAny">{t("tasks.conditionAttendance.attendedAny")}</MenuItem>
        <MenuItem value="attendedCampus">{t("tasks.conditionAttendance.attendedCampus")}</MenuItem>
        <MenuItem value="attendedService">{t("tasks.conditionAttendance.attendedService")}</MenuItem>
        <MenuItem value="attendedServiceTime">{t("tasks.conditionAttendance.attendedServiceTime")}</MenuItem>
        <MenuItem value="attendedGroup">{t("tasks.conditionAttendance.attendedGroup")}</MenuItem>
      </Select>
    </FormControl>
    <FormControl fullWidth>
      <InputLabel>{t("tasks.conditionAttendance.eventType")}</InputLabel>
      <Select fullWidth label={t("tasks.conditionAttendance.eventType")} value={fieldData.eventType || ""} name="eventType" onChange={handleFieldDataChange}>
        <MenuItem value="any">{t("tasks.conditionAttendance.anywhere")}</MenuItem>
        <MenuItem value="campus">{t("tasks.conditionAttendance.campus")}</MenuItem>
        <MenuItem value="service">{t("tasks.conditionAttendance.serv")}</MenuItem>
        <MenuItem value="serviceTime">{t("tasks.conditionAttendance.servTime")}</MenuItem>
        <MenuItem value="group">{t("tasks.conditionAttendance.group")}</MenuItem>
      </Select>
    </FormControl>
  </>
}
