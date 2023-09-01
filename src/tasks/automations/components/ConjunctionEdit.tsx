import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";
import { ErrorMessages, InputBox, ConjunctionInterface, ApiHelper } from "@churchapps/apphelper";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
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
    <InputBox headerIcon="settings_suggest" headerText="Edit Conjunction" saveFunction={handleSave} cancelFunction={props.onCancel}>
      <ErrorMessages errors={errors} />
      <Select fullWidth label="Conjunction Type" value={conjunction?.groupType} name="groupType" onChange={handleChange}>
        <MenuItem value="and">AND - All of the conditions are true</MenuItem>
        <MenuItem value="or">OR - Any of the conditions are true</MenuItem>
      </Select>
    </InputBox>
  );
}
