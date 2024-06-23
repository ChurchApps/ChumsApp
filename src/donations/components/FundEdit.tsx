import React, { useState } from "react";
import { ApiHelper, InputBox, FundInterface, ErrorMessages, Locale } from "@churchapps/apphelper";
import { TextField } from "@mui/material";

interface Props { fund: FundInterface, updatedFunction: () => void }
export const FundEdit: React.FC<Props> = (props) => {
  const [fund, setFund] = useState<FundInterface>({ id: "", name: "" });
  const [errors, setErrors] = useState<string[]>([]);

  const handleCancel = () => props.updatedFunction();
  const handleSave = () => {
    let errors: string[] = [];

    if (!fund.name.trim()) errors.push(Locale.label("donations.fundEdit.errBlank"));

    if (errors.length > 0) {
      setErrors(errors);
      setFund({ ...fund, name: "" });
      return;
    }

    setFund({ ...fund, name: fund.name.trim() });
    ApiHelper.post("/funds", [fund], "GivingApi").then(() => props.updatedFunction());
  }
  const handleDelete = () => {
    if (window.confirm(Locale.label("donations.fundEdit.confirmMsg"))) {
      ApiHelper.delete("/funds/" + fund.id, "GivingApi").then(() => props.updatedFunction());
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let f = { ...fund };
    f.name = e.target.value;
    setFund(f);
  }

  React.useEffect(() => { setFund(props.fund); }, [props.fund]);

  return (
    <InputBox id="fundsBox" headerIcon="volunteer_activism" headerText={Locale.label("donations.fundEdit.edit")} cancelFunction={handleCancel} saveFunction={handleSave} deleteFunction={(fund.id === "") ? undefined : handleDelete} help="chums/giving">
      <ErrorMessages errors={errors} />
      <TextField fullWidth name="fundName" label={Locale.label("donations.fundEdit.name")} value={fund.name} onChange={handleChange} onKeyDown={handleKeyDown} />
    </InputBox>

  );
}

