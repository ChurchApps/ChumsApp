import React from "react";
import { ApiHelper, GroupInterface, GroupServiceTimeInterface, ServiceTimeInterface } from ".";
import { Table, InputGroup, Button, FormControl } from "react-bootstrap";

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
      result.push(<tr key={gst.id}><td><i className="far fa-clock"></i> {gst.serviceTime.name}</td><td><a href="about:blank" className="text-danger" data-id={gst.id} onClick={handleRemove}><i className="fas fa-user-times"></i> Remove</a></td></tr>);
    }
    return result;
  }

  const getOptions = () => {
    let result: JSX.Element[] = [];
    for (let i = 0; i < serviceTimes.length; i++) result.push(<option value={serviceTimes[i].id}>{serviceTimes[i].longName}</option>);
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => setAddServiceTimeId(e.currentTarget.value);

  React.useEffect(() => { if (props.group.id !== undefined) loadData(); }, [props.group, loadData]);

  return (
    <div>
      <label>Service Times (optional)</label>
      <Table><tbody>{getRows()}</tbody></Table>
      <InputGroup>
        <FormControl as="select" data-cy="choose-service-time" value={addServiceTimeId} onChange={handleChange}>{getOptions()}</FormControl>
        <InputGroup.Append>
          <Button variant="primary" data-cy="add-service-time" onClick={handleAdd}><i className="fas fa-plus"></i> Add</Button>
        </InputGroup.Append>
      </InputGroup>
    </div>

  );
}

