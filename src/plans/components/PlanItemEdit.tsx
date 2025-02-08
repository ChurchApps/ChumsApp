import React from "react";
import { Button, FormControl, Grid, InputLabel, OutlinedInput, SelectChangeEvent, TextField} from "@mui/material";
import { PlanItemInterface, SongDetailInterface } from "../../helpers";
import { ApiHelper, DisplayBox, InputBox, Locale } from "@churchapps/apphelper";


interface Props {
  planItem: PlanItemInterface
  onDone: () => void
}

export const PlanItemEdit = (props: Props) => {
  const [planItem, setPlanItem] = React.useState<PlanItemInterface>(null);
  const [searchText, setSearchText] = React.useState("");
  const [songs, setSongs] = React.useState<SongDetailInterface[]>([]);
  const [errors, setErrors] = React.useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    setErrors([]);
    const pi = { ...planItem } as PlanItemInterface;
    let value = e.target.value;
    switch (e.target.name) {
      case "label": pi.label = value; break;
      case "description": pi.description = value; break;
      case "seconds": pi.seconds = parseInt(value); break;
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

  const getHeaderText = () => {
    let result = "Edit";
    if (planItem?.itemType === "header") result += " Header";
    else if (planItem?.itemType === "song") result += " Song";
    return result;
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
  }

  const handleSearch = () => {
    setErrors([]);
    if (searchText === "") {
      setErrors(["Please enter a search term."]);
      return;
    }
    else {
      ApiHelper.get("/songs/search?q=" + encodeURIComponent(searchText), "ContentApi").then(data => setSongs(data));
    }
  }

  const handleDelete = () => {
    ApiHelper.delete("/planItems/" + planItem.id, "DoingApi").then(() => { props.onDone(); });
  }

  const selectSong = (song: SongDetailInterface) => {
    setPlanItem({ ...planItem,
      relatedId: (song as any).songId,
      label: song.title,
      description:song.artist,
      seconds:song.seconds
    });
    setSongs([]);
  }

  const getSongFields = () => {
    let a=1;
    return <>
      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="searchText">{Locale.label("common.search")}</InputLabel>
        <OutlinedInput id="searchText" aria-label="searchBox" name="searchText" type="text" label={Locale.label("common.name")} value={searchText} onChange={handleSearchChange}
          endAdornment={<Button variant="contained" onClick={handleSearch}>{Locale.label("common.search")}</Button>}
        />
      </FormControl>
      {songs?.map((song) => <a href="about:blank" onClick={e => { e.preventDefault(); selectSong(song) }}>{song.title} - {song.artist}</a>)}

    </>
  }

  const showLabel = planItem?.itemType==="header" || planItem?.itemType==="item" || (planItem?.itemType==="song" && planItem?.relatedId);
  const showDesc = planItem?.itemType==="item" || (planItem?.itemType==="song" && planItem?.relatedId);
  const showDuration = planItem?.itemType==="item" || (planItem?.itemType==="song" && planItem?.relatedId);

  return (<InputBox headerText={getHeaderText()} headerIcon="album" saveFunction={handleSave} cancelFunction={props.onDone} deleteFunction={planItem?.id && handleDelete}>
    {planItem?.itemType==="song" && getSongFields()}
    {(showLabel) && <TextField fullWidth label={Locale.label("common.name")} id="label" name="label" type="text" value={planItem?.label} onChange={handleChange} /> }
    {(showDesc) && <TextField multiline fullWidth label="Description" id="description" name="description" type="text" value={planItem?.description} onChange={handleChange} /> }
    {(showDuration) && <TextField fullWidth label="Seconds" name="seconds" type="number" value={planItem?.seconds} onChange={handleChange} /> }
  </InputBox>)
};

