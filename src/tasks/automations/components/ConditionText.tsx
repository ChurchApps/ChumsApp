import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import React from "react";
import { ConditionHelper } from "../../components";
import { ConditionInterface } from "@churchapps/apphelper";

interface Props {
  condition: ConditionInterface,
  onChange: (condition: ConditionInterface) => void
}

export const ConditionText = (props: Props) => {
  const init = () => {
    const c = { ...props.condition };
    if (!c.value) {
      c.value = "";
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

  const getTextField = () => {
    let label = ConditionHelper.getTitleCase(props.condition.field);
    return <TextField fullWidth type="text" label={label} value={props.condition.value || ""} name="value" onChange={handleChange} />
  }

  return <>
    <FormControl fullWidth>
      <InputLabel>Operator</InputLabel>
      <Select fullWidth label="Operator" value={props.condition.operator || ""} name="operator" onChange={handleChange}>
        <MenuItem key="/equals" value="=">=</MenuItem>
        <MenuItem key="/contains" value="contains">contains</MenuItem>
        <MenuItem key="/startsWith" value="startsWith">starts with</MenuItem>
        <MenuItem key="/endsWith" value="endsWith">ends with</MenuItem>
        <MenuItem key="/greaterThan" value=">">&gt;</MenuItem>
        <MenuItem key="/greaterThanEqual" value=">=">&gt;=</MenuItem>
        <MenuItem key="/lessThan" value="<">&lt;</MenuItem>
        <MenuItem key="/lessThanEqual" value="<=">&lt;=</MenuItem>
        <MenuItem key="/notEquals" value="!=">!=</MenuItem>
      </Select>
    </FormControl>
    {getTextField()}
  </>
}
