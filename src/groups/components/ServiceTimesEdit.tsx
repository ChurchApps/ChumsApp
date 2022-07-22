import React from "react";
import { ApiHelper, GroupInterface, GroupServiceTimeInterface, ServiceTimeInterface } from ".";
import { Table, TableBody, TableRow, TableCell, Icon, FormControl, InputLabel, Select, Button, SelectChangeEvent, MenuItem } from "@mui/material"

interface Props {
  group: GroupInterface,
  updatedFunction?: (group: GroupInterface) => void
}

export const ServiceTimesEdit: React.FC<Props> = (props) => {

  const [groupServiceTimes, setGroupServiceTimes] = React.useState<GroupServiceTimeInterface[]>([]);
  const [serviceTimes, setServiceTimes] = React.useState<ServiceTimeInterface[]>([]);
  const [addServiceTimeId, setAddServiceTimeId] = React.useState("");

  const loadData = React.useCallback(() => {
    ApiHelper.get("/groupservicetimes?groupId=" + props.group.id, "AttendanceApi").then(data => setGroupServiceTimes(data));
    ApiHelper.get("/servicetimes", "AttendanceApi").then(data => {
      setServiceTimes(data);
      let st = data[0] as ServiceTimeInterface;
      if (data.length > 0) setAddServiceTimeId(st.id);
    });
  }, [props.group]);

  const getRows = () => {
    let result: JSX.Element[] = [];
    for (let i = 0; i < groupServiceTimes.length; i++) {
      let gst = groupServiceTimes[i];
      result.push(<TableRow key={gst.id}><TableCell><Icon>schedule</Icon> {gst.serviceTime.name}</TableCell><TableCell><a href="about:blank" style={{color: "#dc3545"}} data-id={gst.id} onClick={handleRemove}><Icon>person_remove</Icon> Remove</a></TableCell></TableRow>);
    }
    return result;
  }

  const getOptions = () => {
    let result: JSX.Element[] = [];
    for (let i = 0; i < serviceTimes.length; i++) result.push(<MenuItem key={i} value={serviceTimes[i].id}>{serviceTimes[i].longName}</MenuItem>);
    return result;
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    let gst = { groupId: props.group.id, serviceTimeId: addServiceTimeId } as GroupServiceTimeInterface;
    ApiHelper.post("/groupservicetimes", [gst], "AttendanceApi").then(loadData);
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    let anchor = e.currentTarget as HTMLAnchorElement;
    let id = anchor.getAttribute("data-id");
    ApiHelper.delete("/groupservicetimes/" + id.toString(), "AttendanceApi").then(loadData);
  }

  const handleChange = (e: SelectChangeEvent<string>) => setAddServiceTimeId(e.target.value);

  React.useEffect(() => { if (props.group.id !== undefined) loadData(); }, [props.group, loadData]);

  return (
    <div>
      <label>Service Times (optional)</label>
      <Table><TableBody>{getRows()}</TableBody></Table>
      <FormControl fullWidth>
        <InputLabel>Add Service Time</InputLabel>
        <Select fullWidth label="Add Service Time" aria-label="serviceTime" data-cy="choose-service-time" value={addServiceTimeId} onChange={handleChange} endAdornment={
          <Button variant="contained" data-cy="add-service-time" onClick={handleAdd}><Icon>add</Icon> Add</Button>
        }>
          {getOptions()}
        </Select>
      </FormControl>
    </div>
  );
}
