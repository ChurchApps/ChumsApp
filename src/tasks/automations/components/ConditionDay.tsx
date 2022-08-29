import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";
import { ConditionInterface } from "../../components";

interface Props {
  condition: ConditionInterface,
  onChange: (condition: ConditionInterface) => void
}

export const ConditionDay = (props: Props) => {

  const init = () => {
    const c = { ...props.condition };
    c.value = (c.field === "dayOfWeek") ? "0" : "1"
    c.operator = "=";
    props.onChange(c);
  }

  React.useEffect(init, [props.condition.field]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const c = { ...props.condition };
    c.value = e.target.value;
    props.onChange(c);
  }

  const getDayOfWeek = () => (
    <FormControl fullWidth>
      <InputLabel>Day of Week</InputLabel>
      <Select fullWidth label="Day of Week" value={props.condition.value || ""} name="value" onChange={handleChange}>
        <MenuItem value="0">Sunday</MenuItem>
        <MenuItem value="1">Monday</MenuItem>
        <MenuItem value="2">Tuesday</MenuItem>
        <MenuItem value="3">Wednesday</MenuItem>
        <MenuItem value="4">Thursday</MenuItem>
        <MenuItem value="5">Friday</MenuItem>
        <MenuItem value="6">Saturday</MenuItem>
      </Select>
    </FormControl>
  )

  const getDayOfMonth = () => {
    const days = []
    for (let day = 1; day < 32; day++) days.push(<MenuItem value={day}>{day}</MenuItem>)
    return (<FormControl fullWidth>
      <InputLabel>Day of Month</InputLabel>
      <Select fullWidth label="Day of Month" value={props.condition.value || ""} name="value" onChange={handleChange}>
        {days}
      </Select>
    </FormControl>)
  }

  if (props.condition.field === "dayOfWeek") return getDayOfWeek();
  else return getDayOfMonth();
}
