import { FormControl, InputLabel, ListSubheader, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import React from "react";
import { ConditionInterface, Locale } from "@churchapps/apphelper";
import { ConditionHelper } from "../../../helpers"

interface Props {
  condition: ConditionInterface,
  onChange: (condition: ConditionInterface) => void
}

export const ConditionDate = (props: Props) => {
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
      <InputLabel>{Locale.label("tasks.conditionDate.dayOf")}</InputLabel>
      <Select fullWidth label={Locale.label("tasks.conditionDate.dayOf")} value={props.condition.value || ""} name="value" onChange={handleChange}>
        <MenuItem value="1">{Locale.label("tasks.conditionDate.sun")}</MenuItem>
        <MenuItem value="2">{Locale.label("tasks.conditionDate.mon")}</MenuItem>
        <MenuItem value="3">{Locale.label("tasks.conditionDate.tues")}</MenuItem>
        <MenuItem value="4">{Locale.label("tasks.conditionDate.wed")}</MenuItem>
        <MenuItem value="5">{Locale.label("tasks.conditionDate.thurs")}</MenuItem>
        <MenuItem value="6">{Locale.label("tasks.conditionDate.fri")}</MenuItem>
        <MenuItem value="7">{Locale.label("tasks.conditionDate.sat")}</MenuItem>
      </Select>
    </FormControl>
  )

  const getMonth = () => (
    <FormControl fullWidth>
      <InputLabel>{Locale.label("tasks.conditionDate.month")}</InputLabel>
      <Select fullWidth label={Locale.label("tasks.conditionDate.month")} value={props.condition.value || ""} name="value" onChange={handleChange}>
        <ListSubheader>Absolute Values</ListSubheader>
        <MenuItem value="1">{Locale.label("tasks.conditionDate.jan")}</MenuItem>
        <MenuItem value="2">{Locale.label("tasks.conditionDate.feb")}</MenuItem>
        <MenuItem value="3">{Locale.label("tasks.conditionDate.mar")}</MenuItem>
        <MenuItem value="4">{Locale.label("tasks.conditionDate.apr")}</MenuItem>
        <MenuItem value="5">{Locale.label("tasks.conditionDate.may")}</MenuItem>
        <MenuItem value="6">{Locale.label("tasks.conditionDate.june")}</MenuItem>
        <MenuItem value="7">{Locale.label("tasks.conditionDate.july")}</MenuItem>
        <MenuItem value="8">{Locale.label("tasks.conditionDate.aug")}</MenuItem>
        <MenuItem value="9">{Locale.label("tasks.conditionDate.sep")}</MenuItem>
        <MenuItem value="10">{Locale.label("tasks.conditionDate.oct")}</MenuItem>
        <MenuItem value="11">{Locale.label("tasks.conditionDate.nov")}</MenuItem>
        <MenuItem value="12">{Locale.label("tasks.conditionDate.dec")}</MenuItem>
        <ListSubheader>Relative Values</ListSubheader>
        <MenuItem value="{previousMonth}">{Locale.label("tasks.conditionDate.prevMonth")}</MenuItem>
        <MenuItem value="{currentMonth}">{Locale.label("tasks.conditionDate.curMonth")}</MenuItem>
        <MenuItem value="{nextMonth}">{Locale.label("tasks.conditionDate.nextMonth")}</MenuItem>
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
      <InputLabel>{Locale.label("tasks.conditionDate.datePart")}</InputLabel>
      <Select fullWidth label={Locale.label("tasks.conditionDate.datePart")} value={fieldData.datePart || ""} name="datePart" onChange={handleChange}>
        <MenuItem key="/full" value="full">{Locale.label("tasks.conditionDate.dateFull")}</MenuItem>
        <MenuItem key="/dayOfWeek" value="dayOfWeek">{Locale.label("tasks.conditionDate.weekDay")}</MenuItem>
        <MenuItem key="/dayOfMonth" value="dayOfMonth">{Locale.label("tasks.conditionDate.monthDay")}</MenuItem>
        <MenuItem key="/month" value="month">{Locale.label("tasks.conditionDate.month")}</MenuItem>
        <MenuItem key="/years" value="years">{Locale.label("tasks.conditionDate.yearsE")}</MenuItem>
      </Select>
    </FormControl>
    <FormControl fullWidth>
      <InputLabel>{Locale.label("tasks.conditionDate.op")}</InputLabel>
      <Select fullWidth label={Locale.label("tasks.conditionDate.op")} value={props.condition.operator || ""} name="operator" onChange={handleChange}>
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
