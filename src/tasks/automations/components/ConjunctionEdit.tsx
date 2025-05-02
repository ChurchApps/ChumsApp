import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";
import { ErrorMessages, InputBox, ConjunctionInterface, ApiHelper } from "@churchapps/apphelper";
import { useAppTranslation } from "../../../contexts/TranslationContext";

interface Props {
  conjunction: ConjunctionInterface,
  onCancel: () => void,
  onSave: (conjunction: ConjunctionInterface) => void,
}

export const ConjunctionEdit = (props: Props) => {
  const [conjunction, setConjunction] = React.useState<ConjunctionInterface>(null);
  const [errors, setErrors] = React.useState([]);
  const { t } = useAppTranslation();

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
    <InputBox headerIcon="settings_suggest" headerText={t("tasks.conjunctionEdit.conjEdit")} saveFunction={handleSave} cancelFunction={props.onCancel} help="chums/automations">
      <ErrorMessages errors={errors} />
      <Select fullWidth label={t("tasks.conjunctionEdit.conjType")} value={conjunction?.groupType} name="groupType" onChange={handleChange}>
        <MenuItem value="and">{t("tasks.conjunctionEdit.and")}</MenuItem>
        <MenuItem value="or">{t("tasks.conjunctionEdit.or")}</MenuItem>
      </Select>
    </InputBox>
  );
}
