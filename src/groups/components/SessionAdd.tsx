import React from "react";
import { ApiHelper, GroupInterface, GroupServiceTimeInterface, InputBox, ErrorMessages, SessionInterface, DateHelper, UniqueIdHelper } from "@churchapps/apphelper";
import { TextField, FormControl, Select, InputLabel, SelectChangeEvent, MenuItem } from "@mui/material"

interface Props { group: GroupInterface, updatedFunction: (session: SessionInterface) => void }

export const SessionAdd: React.FC<Props> = (props) => {
  const [errors, setErrors] = React.useState<string[]>([]);
  const [sessionDate, setSessionDate] = React.useState<Date>(new Date());
  const [groupServiceTimes, setGroupServiceTimes] = React.useState<GroupServiceTimeInterface[]>([]);
  const [serviceTimeId, setServiceTimeId] = React.useState("");

  const handleCancel = () => { props.updatedFunction(null); }
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
  const loadData = React.useCallback(() => {
    ApiHelper.get("/groupservicetimes?groupId=" + props.group.id, "AttendanceApi").then(data => {
      setGroupServiceTimes(data);
      if (data.length > 0) setServiceTimeId(data[0].serviceTimeId);
    });
  }, [props.group]);

  const handleSave = () => {
    if (validate()) {
      let s = { groupId: props.group.id, sessionDate: sessionDate } as SessionInterface
      if (!UniqueIdHelper.isMissing(serviceTimeId)) s.serviceTimeId = serviceTimeId;
      ApiHelper.post("/sessions", [s], "AttendanceApi").then(() => {
        props.updatedFunction(s);
        setSessionDate(new Date());
      });
    }
  }

  const validate = () => {
    let errors: string[] = [];
    if (sessionDate === null || sessionDate < new Date(2000, 1, 1)) errors.push("Invalid date");
    setErrors(errors);
    return errors.length === 0;
  }

  const getServiceTimes = () => {
    if (groupServiceTimes.length === 0) return <></>
    else {
      let options = [];
      for (let i = 0; i < groupServiceTimes.length; i++) {
        let gst = groupServiceTimes[i];
        options.push(<MenuItem key={i} value={gst.serviceTimeId}>{gst.serviceTime.name}</MenuItem>);
      }

      return (<FormControl>
        <InputLabel id="service-time">Service Time</InputLabel>
        <Select label="Service Time" labelId="service-time" value={serviceTimeId} onChange={(e: SelectChangeEvent<string>) => { setServiceTimeId(e.target.value) }} onKeyDown={handleKeyDown}>
          {options}
        </Select>
      </FormControl>);
    }
  }

  React.useEffect(() => { if (props.group.id !== undefined) loadData(); }, [props.group, loadData]);

  return (
    <InputBox data-cy="add-session-box" headerIcon="calendar_month" headerText="Add a Session" saveFunction={handleSave} cancelFunction={handleCancel} help="chums/attendance">
      <ErrorMessages errors={errors} />
      {getServiceTimes()}

      <TextField fullWidth type="date" InputLabelProps={{shrink: true}} label="Session Date" value={DateHelper.formatHtml5Date(sessionDate)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSessionDate(new Date(e.currentTarget.value))} onKeyDown={handleKeyDown} />

    </InputBox>

  );
}

