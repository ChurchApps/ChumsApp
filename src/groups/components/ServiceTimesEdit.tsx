import React from "react";
import { ApiHelper, GroupInterface, GroupServiceTimeInterface, Locale, ServiceTimeInterface } from "@churchapps/apphelper";
import { Table, TableBody, TableRow, TableCell, Icon, FormControl, InputLabel, Select, Button, MenuItem, type SelectChangeEvent } from "@mui/material"

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
      const st = data[0] as ServiceTimeInterface;
      if (data.length > 0) setAddServiceTimeId(st.id);
    });
  }, [props.group]);

  const getRows = () => {
    const result: JSX.Element[] = [];
    for (let i = 0; i < groupServiceTimes.length; i++) {
      const gst = groupServiceTimes[i];
      result.push(<TableRow key={gst.id}><TableCell><Icon>schedule</Icon> {gst.serviceTime.name}</TableCell><TableCell><a href="about:blank" style={{color: "#dc3545"}} data-id={gst.id} onClick={handleRemove}><Icon>person_remove</Icon> {Locale.label("common.remove")}</a></TableCell></TableRow>);
    }
    return result;
  }

  const getOptions = () => {
    const result: JSX.Element[] = [];
    for (let i = 0; i < serviceTimes.length; i++) result.push(<MenuItem key={i} value={serviceTimes[i].id}>{serviceTimes[i].longName}</MenuItem>);
    return result;
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const gst = { groupId: props.group.id, serviceTimeId: addServiceTimeId } as GroupServiceTimeInterface;
    ApiHelper.post("/groupservicetimes", [gst], "AttendanceApi").then(loadData);
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    const anchor = e.currentTarget as HTMLAnchorElement;
    const id = anchor.getAttribute("data-id");
    ApiHelper.delete("/groupservicetimes/" + id.toString(), "AttendanceApi").then(loadData);
  }

  const handleChange = (e: SelectChangeEvent) => setAddServiceTimeId(e.target.value as string);

  React.useEffect(() => { if (props.group.id !== undefined) loadData(); }, [props.group, loadData]);

  return (
    <div>
      <label>{Locale.label("groups.serviceTimesEdit.srvTimeOp")}</label>
      <Table><TableBody>{getRows()}</TableBody></Table>
      <FormControl fullWidth>
        <InputLabel>{Locale.label("groups.serviceTimesEdit.srvTimeAdd")}</InputLabel>
        <Select fullWidth label={Locale.label("groups.serviceTimesEdit.srvTimeAdd")} aria-label="serviceTime" data-cy="choose-service-time" value={addServiceTimeId} onChange={handleChange} endAdornment={<>
          <Icon>arrow_drop_down</Icon>
          <Button variant="contained" data-cy="add-service-time" onClick={handleAdd}><Icon>add</Icon> {Locale.label("common.add")}</Button>
        </>
        }>
          {getOptions()}
        </Select>
      </FormControl>
    </div>
  );
}
