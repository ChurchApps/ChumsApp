import React, { useEffect } from "react";
import { ApiHelper, DateHelper, DisplayBox, InputBox } from "@churchapps/apphelper";
import { SongDetailInterface, SongDetailLinkInterface } from "../../../helpers";
import { Table, TableBody, TableCell, TableRow, TextField } from "@mui/material";
import { SongDetailLinksEdit } from "./SongDetailLinksEdit";

interface Props {
  songDetail: SongDetailInterface;
  onSave: (songDetail: SongDetailInterface) => void;
  onCancel: () => void;
}

export const SongDetailsEdit = (props: Props) => {
  const [songDetail, setSongDetail] = React.useState<SongDetailInterface>(props.songDetail);
  const [pendingLinksSave, setPendingLinksSave] = React.useState<number>(0);

  useEffect(() => { setSongDetail(props.songDetail); }, [props.songDetail]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sd = {...songDetail};
    switch (e.target.name) {
      case "album": sd.album = e.target.value; break;
      case "language": sd.language = e.target.value; break;
      case "releaseDate": sd.releaseDate = new Date(e.target.value); break;
      case "bpm": sd.bpm = parseInt(e.target.value); break;
      case "keySignature": sd.keySignature = e.target.value; break;
      case "seconds": sd.seconds = parseInt(e.target.value); break;
    }
    setSongDetail(sd);
  }

  const handleSave = () => {
    setPendingLinksSave(pendingLinksSave + 1);
  }

  const continueSave = (songDetailLinks: SongDetailLinkInterface[]) => {
    ApiHelper.post("/songDetails", [songDetail], "ContentApi").then(data => {
      props.onSave(data[0]);
    });
  }

  return (<InputBox headerText={props.songDetail?.title} headerIcon="album" saveFunction={handleSave} cancelFunction={props.onCancel}>
    <TextField label="Album" name="album" value={songDetail?.album} onChange={handleChange} fullWidth size="small" />
    <TextField label="Language" name="language" value={songDetail?.language} onChange={handleChange} fullWidth size="small" />
    <TextField type="date" label="Release Date" name="releaseDate" value={songDetail?.releaseDate ? DateHelper.formatHtml5Date(songDetail.releaseDate) : ""} onChange={handleChange} fullWidth size="small" />
    <TextField type="number" label="BPM" name="bpm" value={songDetail?.bpm} onChange={handleChange} fullWidth size="small" />
    <TextField label="Key" name="keySignature" value={songDetail?.keySignature} placeholder="C#" onChange={handleChange} fullWidth size="small" />
    <TextField type="number" label="Seconds" name="seconds" value={songDetail?.seconds} onChange={handleChange} fullWidth size="small" />
    <SongDetailLinksEdit songDetailId={songDetail?.id} pendingSave={pendingLinksSave} onSave={continueSave} />
  </InputBox>);
}
