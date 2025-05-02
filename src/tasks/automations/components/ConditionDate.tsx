import React from "react";
import { FormControl, InputLabel, ListSubheader, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useAppTranslation } from "../../../contexts/TranslationContext";
import { ConditionInterface } from "@churchapps/apphelper";
import { ConditionHelper } from "../../../helpers"

interface Props {
  condition: ConditionInterface,
  onChange: (condition: ConditionInterface) => void
}

export const ConditionDate = (props: Props) => {
  const { t } = useAppTranslation();

  const init = () => {
    const c = { ...props.condition };
    if (!c.value) {
      c.value = "";
      c.operator = "=";
      c.fieldData = JSON.stringify({ datePart: "full" });
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
      case "datePart":
        c.fieldData = JSON.stringify({ datePart: val });
        if (val === "dayOfWeek" || val === "month" || val === "dayOfMonth" || val === "years") c.value = "1";
        break;
    }
    c.label = ConditionHelper.getLabel(c);
    props.onChange(c);
  }

  const getDateField = () => {
    let label = ConditionHelper.getTitleCase(props.condition.field);
    return <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <TextField fullWidth type="date" value={props.condition.value || ""} name="value" onChange={handleChange} />
    </FormControl>
  }

  const getNumberField = () => {
    let label = ConditionHelper.getTitleCase(props.condition.field);
    return <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <TextField fullWidth type="number" value={props.condition.value || ""} name="value" onChange={handleChange} />
    </FormControl>
  }

  const getDayOfWeek = () => (
    <FormControl fullWidth>
      <InputLabel>{t("tasks.conditionDate.dayOf")}</InputLabel>
      <Select fullWidth label={t("tasks.conditionDate.dayOf")} value={props.condition.value || ""} name="value" onChange={handleChange}>
        <MenuItem value="1">{t("tasks.conditionDate.sun")}</MenuItem>
        <MenuItem value="2">{t("tasks.conditionDate.mon")}</MenuItem>
        <MenuItem value="3">{t("tasks.conditionDate.tues")}</MenuItem>
        <MenuItem value="4">{t("tasks.conditionDate.wed")}</MenuItem>
        <MenuItem value="5">{t("tasks.conditionDate.thurs")}</MenuItem>
        <MenuItem value="6">{t("tasks.conditionDate.fri")}</MenuItem>
        <MenuItem value="7">{t("tasks.conditionDate.sat")}</MenuItem>
      </Select>
    </FormControl>
  )

  const getMonth = () => (
    <FormControl fullWidth>
      <InputLabel>{t("tasks.conditionDate.month")}</InputLabel>
      <Select fullWidth label={t("tasks.conditionDate.month")} value={props.condition.value || ""} name="value" onChange={handleChange}>
        <ListSubheader>{t("tasks.conditionDate.absolute")}</ListSubheader>
        <MenuItem value="1">{t("month.jan")}</MenuItem>
        <MenuItem value="2">{t("month.feb")}</MenuItem>
        <MenuItem value="3">{t("month.mar")}</MenuItem>
        <MenuItem value="4">{t("month.apr")}</MenuItem>
        <MenuItem value="5">{t("month.may")}</MenuItem>
        <MenuItem value="6">{t("month.june")}</MenuItem>
        <MenuItem value="7">{t("month.july")}</MenuItem>
        <MenuItem value="8">{t("month.aug")}</MenuItem>
        <MenuItem value="9">{t("month.sep")}</MenuItem>
        <MenuItem value="10">{t("month.oct")}</MenuItem>
        <MenuItem value="11">{t("month.nov")}</MenuItem>
        <MenuItem value="12">{t("month.dec")}</MenuItem>
        <ListSubheader>{t("tasks.conditionDate.relative")}</ListSubheader>
        <MenuItem value="{previousMonth}">{t("tasks.conditionDate.prevMonth")}</MenuItem>
        <MenuItem value="{currentMonth}">{t("tasks.conditionDate.curMonth")}</MenuItem>
        <MenuItem value="{nextMonth}">{t("tasks.conditionDate.nextMonth")}</MenuItem>
      </Select>
    </FormControl>
  )

  const getField = () => {
    let result = getDateField();
    switch (fieldData?.datePart) {
      case "dayOfWeek": result = getDayOfWeek(); break;
      case "month": result = getMonth(); break;
      case "dayOfMonth":
      case "years":
        result = getNumberField();
        break;
    }

    return result;
  }

  const fieldData = (props.condition.fieldData) ? JSON.parse(props.condition.fieldData) : {}

  return <>
    <FormControl fullWidth>
      <InputLabel>{t("tasks.conditionDate.datePart")}</InputLabel>
      <Select fullWidth label={t("tasks.conditionDate.datePart")} value={fieldData.datePart || ""} name="datePart" onChange={handleChange}>
        <MenuItem key="/full" value="full">{t("tasks.conditionDate.dateFull")}</MenuItem>
        <MenuItem key="/dayOfWeek" value="dayOfWeek">{t("tasks.conditionDate.weekDay")}</MenuItem>
        <MenuItem key="/dayOfMonth" value="dayOfMonth">{t("tasks.conditionDate.monthDay")}</MenuItem>
        <MenuItem key="/month" value="month">{t("tasks.conditionDate.month")}</MenuItem>
        <MenuItem key="/years" value="years">{t("tasks.conditionDate.yearsE")}</MenuItem>
      </Select>
    </FormControl>
    <FormControl fullWidth>
      <InputLabel>{t("tasks.conditionDate.op")}</InputLabel>
      <Select fullWidth label={t("tasks.conditionDate.op")} value={props.condition.operator || ""} name="operator" onChange={handleChange}>
        <MenuItem key="/equals" value="=">=</MenuItem>
        <MenuItem key="/greaterThan" value=">">&gt;</MenuItem>
        <MenuItem key="/greaterThanEqual" value=">=">&gt;=</MenuItem>
        <MenuItem key="/lessThan" value="<">&lt;</MenuItem>
        <MenuItem key="/lessThanEqual" value="<=">&lt;=</MenuItem>
        <MenuItem key="/notEquals" value="!=">!=</MenuItem>
      </Select>
    </FormControl>
    {getField()}
  </>
}
