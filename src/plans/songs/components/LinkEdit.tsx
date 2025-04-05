import React, { useEffect } from "react";
import { ApiHelper, DateHelper, DisplayBox, InputBox, LinkInterface } from "@churchapps/apphelper";
import { ArrangementInterface, ArrangementKeyInterface } from "../../../helpers";
import { TextField } from "@mui/material";

interface Props {
  link: LinkInterface;
  onSave: (link: LinkInterface) => void;
  onCancel: () => void;
}

export const LinkEdit = (props: Props) => {
  const [link, setLink] = React.useState<LinkInterface>(props.link);

  useEffect(() => { setLink(props.link); console.log("REceived link") }, [props.link]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const l = { ...link };

    switch (e.target.name) {
      case "url": l.url = e.target.value; break;
      case "text": l.text = e.target.value; break;
    }
    setLink(l);
  }

  const handleSave = () => {
    ApiHelper.post("/links", [link], "ContentApi").then(data => {
      props.onSave(data[0]);
    });
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      ApiHelper.delete("/links/" + link?.id, "ContentApi").then(() => {
        props.onSave(null);
      });
    }
  }

  return (<InputBox headerText={"Edit Link"} headerIcon="link" saveFunction={handleSave} cancelFunction={props.onCancel} deleteFunction={(link?.id) ? handleDelete : null}>
    <TextField label="Url" name="url" value={link?.url} onChange={handleChange} fullWidth />
    <TextField label="Text" name="text" value={link?.text} onChange={handleChange} fullWidth placeholder="Chord Chart" />
  </InputBox>);
}
