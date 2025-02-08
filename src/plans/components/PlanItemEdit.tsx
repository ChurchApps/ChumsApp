import React from "react";
import { Grid, SelectChangeEvent, TextField} from "@mui/material";
import { PlanItemInterface } from "../../helpers";
import { ApiHelper, DisplayBox, InputBox, Locale } from "@churchapps/apphelper";


interface Props {
  planItem: PlanItemInterface
  onDone: () => void
}

export const PlanItemEdit = (props: Props) => {
  const [planItem, setPlanItem] = React.useState<PlanItemInterface>(null);
  const [errors, setErrors] = React.useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    setErrors([]);
    const pi = { ...planItem } as PlanItemInterface;
    let value = e.target.value;
    switch (e.target.name) {
      case "label": pi.label = value; break;
    }
    setPlanItem(pi);
  }

  const loadData = async () => {
    setPlanItem(props.planItem);
  }

  const handleSave = () => {
    ApiHelper.post("/planItems", [planItem], "DoingApi").then(() => { props.onDone(); });
  }

  React.useEffect(() => { loadData(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (<InputBox headerText="Edit Header" headerIcon="album" saveFunction={handleSave} cancelFunction={props.onDone}>
    <TextField fullWidth label={Locale.label("common.name")} id="label" name="label" type="text" value={planItem?.label} onChange={handleChange} />
  </InputBox>)
};

