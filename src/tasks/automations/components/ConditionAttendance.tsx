import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";
import { ConditionInterface } from "../../components";

interface Props {
  condition: ConditionInterface,
  onChange: (condition: ConditionInterface) => void
}

export const ConditionAttendance = (props: Props) => {

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

  React.useEffect(init, [props.condition.field]);

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

  const getLabel = (c: ConditionInterface) => {
    return "Attendance todo";
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

  return <>
    <FormControl fullWidth>
      <InputLabel>Operator</InputLabel>
      <Select fullWidth label="Operator" value={props.condition.operator || ""} name="operator" onChange={handleChange}>
        <MenuItem value=">">has attended</MenuItem>
        <MenuItem value="=">has not attended</MenuItem>
      </Select>
    </FormControl>
    <FormControl fullWidth>
      <InputLabel>Event Type</InputLabel>
      <Select fullWidth label="Event Type" value={fieldData.eventType || ""} name="eventType" onChange={handleFieldDataChange}>
        <MenuItem value="any">Anywhere</MenuItem>
        <MenuItem value="campus">Campus</MenuItem>
        <MenuItem value="service">Service</MenuItem>
        <MenuItem value="serviceTime">Service Time</MenuItem>
        <MenuItem value="group">Group</MenuItem>
      </Select>
    </FormControl>
  </>
}
