import React from "react";
import { Checkbox, SelectChangeEvent, TextField } from "@mui/material";
import { ApiHelper, DateHelper, ErrorMessages, InputBox, TimeInterface } from "@churchapps/apphelper";

interface Props { time: TimeInterface, categories:string[], onUpdate: () => void }

export const TimeEdit = (props:Props) => {

  const [time, setTime] = React.useState<TimeInterface>(props.time);
  const [errors, setErrors] = React.useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent ) => {
    setErrors([]);
    const t = { ...time } as TimeInterface;
    let value = e.target.value;
    switch (e.target.name) {
      case "displayName": t.displayName = value; break;
      case "startTime": t.startTime = new Date(value); break;
      case "endTime": t.endTime = new Date(value); break;
    }
    setTime(t);
  }

  const handleSave = () => {
    const errors:string[] = [];
    if (!time.displayName) errors.push("Display name is required");
    if (!time.startTime) errors.push("Start time is required");
    if (!time.endTime) errors.push("End time is required");
    setErrors(errors);
    if (errors.length === 0) ApiHelper.post("/times", [time], "DoingApi").then(props.onUpdate);
  }

  const handleDelete = () => {
    ApiHelper.delete("/times/" + time.id, "DoingApi").then(props.onUpdate);
  }

  const handleTeamCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const teamList = time.teams?.split(",") || [];
    if (teamList.length===1 && teamList[0]==="") teamList.pop();
    if (e.target.checked) teamList.push(e.target.value);
    else teamList.splice(teamList.indexOf(e.target.value), 1);
    const t = { ...time } as TimeInterface;
    t.teams = teamList.join(",");
    setTime(t);
  }


  const getTeams = () => {
    const result:JSX.Element[] = [];
    const teamList = time.teams?.split(",") || [];
    props.categories.forEach(c => {
      const checked = teamList.includes(c);
      result.push(<div><Checkbox key={c} name="team" checked={checked} onChange={handleTeamCheck} value={c} /><label>{c}</label></div>);
    });

    return result;
  }




  return (<>
    <ErrorMessages errors={errors} />
    <InputBox headerText={(props.time?.id) ? "Edit Time" : "Add a Time"} headerIcon="assignment" saveFunction={handleSave} cancelFunction={props.onUpdate} deleteFunction={(time.id) ? handleDelete : null }>
      <TextField fullWidth label="Display Name" id="displayName" name="displayName" type="text" value={time.displayName} onChange={handleChange} />
      <TextField fullWidth label="Start Time" id="startTime" name="startTime" type="datetime-local" value={DateHelper.formatHtml5DateTime(time.startTime)} onChange={handleChange} />
      <TextField fullWidth label="End Time" id="endTime" name="endTime" type="datetime-local" value={DateHelper.formatHtml5DateTime(time.endTime)} onChange={handleChange} />
      <div style={{marginTop:10}}><b>Needed Teams</b></div>
      {getTeams()}
    </InputBox>
  </>);
}
