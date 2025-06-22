import { MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import React from "react";
import { ErrorMessages, InputBox, type ConjunctionInterface, ApiHelper, Locale } from "@churchapps/apphelper";

interface Props {
  conjunction: ConjunctionInterface,
  onCancel: () => void,
  onSave: (conjunction: ConjunctionInterface) => void,
}

export const ConjunctionEdit = (props: Props) => {
  const [conjunction, setConjunction] = React.useState<ConjunctionInterface>(null);
  const [errors, setErrors] = React.useState([]);

  const init = () => {
    setConjunction(props.conjunction);
  }

  React.useEffect(init, [props.conjunction]);

  const validate = () => {
    const result: string[] = [];
    setErrors(result);
    return result.length === 0;
  }

  const handleSave = async () => {
    if (validate()) {
      ApiHelper.post("/conjunctions", [conjunction], "DoingApi").then(d => {
        props.onSave(d[0]);
      });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const val = e.target.value;
    const c = { ...conjunction };
    switch (e.target.name) {
      case "groupType":
        c.groupType = val;
        break;
    }
    console.log(c);
    setConjunction(c);
  }

  if (!conjunction) return <></>
  return (
    <InputBox headerIcon="settings_suggest" headerText={Locale.label("tasks.conjunctionEdit.conjEdit")} saveFunction={handleSave} cancelFunction={props.onCancel} help="chums/automations">
      <ErrorMessages errors={errors} />
      <Select fullWidth label={Locale.label("tasks.conjunctionEdit.conjType")} value={conjunction?.groupType} name="groupType" onChange={handleChange} data-testid="conjunction-type-select" aria-label="Conjunction type">
        <MenuItem value="and">{Locale.label("tasks.conjunctionEdit.and")}</MenuItem>
        <MenuItem value="or">{Locale.label("tasks.conjunctionEdit.or")}</MenuItem>
      </Select>
    </InputBox>
  );
}
