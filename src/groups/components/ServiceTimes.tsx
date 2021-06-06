import React from "react";
import { ApiHelper, GroupInterface, GroupServiceTimeInterface } from ".";

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
    <table>
      <tbody>
        <tr>
          <td><label>Service(s):</label></td>
          <td>{getRows()}</td>
        </tr>
      </tbody>
    </table>

  );
}

