import React, { useEffect } from "react";
import { ApiHelper, DateHelper, DisplayBox, InputBox } from "@churchapps/apphelper";
import { ArrangementInterface, ArrangementKeyInterface } from "../../../helpers";
import { TextField } from "@mui/material";

interface Props {
  arrangementKey: ArrangementKeyInterface;
  onSave: (arrangementKey: ArrangementKeyInterface) => void;
  onCancel: () => void;
}

export const KeyEdit = (props: Props) => {
  const [key, setKey] = React.useState<ArrangementKeyInterface>(props.arrangementKey);

  useEffect(() => { setKey(props.arrangementKey); }, [props.arrangementKey]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const k = { ...key };
    switch (e.target.name) {
      case "keySignature": k.keySignature = e.target.value; break;
      case "shortDescription": k.shortDescription = e.target.value; break;
    }
    setKey(k);
  }

  const handleSave = () => {
    ApiHelper.post("/arrangementKeys", [key], "ContentApi").then(data => {
      props.onSave(data[0]);
    });
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this key?")) {
      ApiHelper.delete("/arrangementKeys/" + key?.id, "ContentApi").then(() => {
        props.onSave(null);
      });
    }
  }

  return (<InputBox headerText={props.arrangementKey?.keySignature || "Edit Key"} headerIcon="library_music" saveFunction={handleSave} cancelFunction={props.onCancel} deleteFunction={(key?.id) ? handleDelete : null}>
    <TextField label="Key Signature" name="keySignature" value={key?.keySignature} onChange={handleChange} fullWidth />
    <TextField label="Label" multiline name="shortDescription" value={key?.shortDescription} onChange={handleChange} fullWidth placeholder="John's Key" />
  </InputBox>);
}
