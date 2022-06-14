import React from "react";
import { ApiHelper, GroupInterface, GroupServiceTimeInterface } from ".";
import { Table, TableBody, TableRow, TableCell } from "@mui/material";
interface Props { group: GroupInterface }

export const ServiceTimes: React.FC<Props> = (props) => {

  const [groupServiceTimes, setGroupServiceTimes] = React.useState<GroupServiceTimeInterface[]>([]);

  const loadData = React.useCallback(() => ApiHelper.get("/groupservicetimes?groupId=" + props.group.id, "AttendanceApi").then(data => setGroupServiceTimes(data)), [props.group.id]);

  const getRows = () => {
    let result: JSX.Element[] = [];
    for (let i = 0; i < groupServiceTimes.length; i++) {
      let gst = groupServiceTimes[i];
      result.push(<div key={gst.id}> {gst.serviceTime.name}</div>);
    }
    return result;
  }

  React.useEffect(() => { if (props.group.id !== undefined) loadData() }, [props.group, loadData]);

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell><label>Service(s):</label></TableCell>
          <TableCell>{getRows()}</TableCell>
        </TableRow>
      </TableBody>
    </Table>

  );
}

