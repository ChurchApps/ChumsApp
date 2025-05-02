import React from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useAppTranslation } from "../../../contexts/TranslationContext";
import { ConditionHelper } from "../../components";
import { ConditionInterface } from "@churchapps/apphelper";

interface Props {
  condition: ConditionInterface,
  onChange: (condition: ConditionInterface) => void
}

export const ConditionText = (props: Props) => {
  const { t } = useAppTranslation();

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
      <InputLabel>{t("tasks.conditionText.op")}</InputLabel>
      <Select fullWidth label={t("tasks.conditionText.op")} value={props.condition.operator || ""} name="operator" onChange={handleChange}>
        <MenuItem value="contains">{t("tasks.conditionText.contains")}</MenuItem>
        <MenuItem value="startsWith">{t("tasks.conditionText.startsWith")}</MenuItem>
        <MenuItem value="endsWith">{t("tasks.conditionText.endsWith")}</MenuItem>
        <MenuItem value="equals">{t("tasks.conditionText.equals")}</MenuItem>
        <MenuItem value="notEquals">{t("tasks.conditionText.notEquals")}</MenuItem>
      </Select>
    </FormControl>
    {getTextField()}
  </>
}
