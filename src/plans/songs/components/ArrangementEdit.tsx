import React, { useEffect } from "react";
import { ApiHelper, DateHelper, DisplayBox, InputBox } from "@churchapps/apphelper";
import { ArrangementInterface } from "../../../helpers";
import { TextField } from "@mui/material";

interface Props {
  arrangement: ArrangementInterface;
  onSave: (arrangement: ArrangementInterface) => void;
  onCancel: () => void;
}

export const ArrangementEdit = (props: Props) => {
  const [arrangement, setArrangement] = React.useState<ArrangementInterface>(props.arrangement);

  useEffect(() => { setArrangement(props.arrangement); }, [props.arrangement]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = {...arrangement};
    switch (e.target.name) {
      case "name": a.name = e.target.value; break;
      case "lyrics": a.lyrics = e.target.value; break;
    }
    setArrangement(a);
  }

  const handleSave = () => {
    ApiHelper.post("/arrangements", [arrangement], "ContentApi").then(data => {
      props.onSave(data[0]);
    });
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this arrangement?")) {
      ApiHelper.delete("/arrangements/" + arrangement?.id, "ContentApi").then(() => {
        props.onSave(null);
      });
    }
  }

  return (<InputBox headerText={props.arrangement?.name || "Edit Arrangement"} headerIcon="library_music" saveFunction={handleSave} cancelFunction={props.onCancel} deleteFunction={(arrangement?.id) ? handleDelete : null}>
    <TextField label="Arrangement Name" name="name" value={arrangement?.name} onChange={handleChange} fullWidth />
    <TextField label="Lyrics" multiline name="lyrics" value={arrangement?.lyrics} onChange={handleChange} fullWidth />
  </InputBox>);
}
