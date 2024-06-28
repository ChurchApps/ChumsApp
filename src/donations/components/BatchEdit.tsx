import React from "react";
import { ApiHelper, InputBox, DateHelper, DonationBatchInterface, UniqueIdHelper, Locale } from "@churchapps/apphelper";
import { TextField } from "@mui/material";

interface Props { batchId: string, updatedFunction: () => void }

export const BatchEdit: React.FC<Props> = (props) => {
  const [batch, setBatch] = React.useState<DonationBatchInterface>({ batchDate: new Date(), name: "" });

  const handleCancel = () => { props.updatedFunction(); }
  const handleSave = () => ApiHelper.post("/donationbatches", [batch], "GivingApi").then(() => props.updatedFunction());
  const getDeleteFunction = () => (!UniqueIdHelper.isMissing(props.batchId)) ? handleDelete : undefined
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }

  const handleDelete = () => {
    if (window.confirm(Locale.label("donations.batchEdit.confirmMsg"))) {
      ApiHelper.delete("/donationbatches/" + batch.id, "GivingApi").then(() => props.updatedFunction());
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let b = { ...batch } as DonationBatchInterface;
    switch (e.currentTarget.name) {
      case "name": b.name = e.currentTarget.value; break;
      case "date":
        b.batchDate = new Date(e.currentTarget.value);
        if (isNaN(b.batchDate.getTime())) b.batchDate = null;
        break;
    }
    setBatch(b);
  }

  const loadData = () => {
    if (UniqueIdHelper.isMissing(props.batchId)) setBatch({ batchDate: new Date(), name: "" });
    else ApiHelper.get("/donationbatches/" + props.batchId, "GivingApi").then(data => setBatch(data));
  }

  React.useEffect(loadData, [props.batchId]);

  return (
    <InputBox id="batchBox" headerIcon="volunteer_activism" headerText={Locale.label("common.edit")} cancelFunction={handleCancel} deleteFunction={getDeleteFunction()} saveFunction={handleSave} help="chums/manual-input">
      <TextField fullWidth name="name" data-cy="batch-name" label={Locale.label("donations.batchEdit.opName")} value={batch.name} onChange={handleChange} onKeyDown={handleKeyDown} />
      <TextField fullWidth type="date" data-cy="batch-date" name="date" InputLabelProps={{shrink: true}} label={Locale.label("donations.batchEdit.date")} value={DateHelper.formatHtml5Date(batch.batchDate)} onChange={handleChange} onKeyDown={handleKeyDown} />
    </InputBox>
  );
}

