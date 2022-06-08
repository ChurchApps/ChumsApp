import React from "react";
import { DisplayBox, ApiHelper, UniqueIdHelper, Loading } from "."
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";
import { Icon } from "@mui/material";

interface Props { personId: string }

export const Groups: React.FC<Props> = (props) => {
  const [groupMembers, setGroupMembers] = React.useState(null);

  React.useEffect(() => {
    if (!UniqueIdHelper.isMissing(props.personId)) ApiHelper.get("/groupmembers?personId=" + props.personId, "MembershipApi").then(data => setGroupMembers(data))
  }, [props.personId]);

  const getRecords = () => {
    if (!groupMembers) return <Loading size="sm" />
    else if (groupMembers.length === 0) return (<p>Not part of any group yet.</p>)
    else {
      const items = [];
      for (let i = 0; i < groupMembers.length; i++) {
        let gm = groupMembers[i];
        items.push(<tr key={gm.id}><td><Icon>group</Icon> <Link to={"/groups/" + gm.groupId}>{gm.group.name}</Link></td></tr>);
      }
      return (<Table size="sm"><tbody>{items}</tbody></Table>)
    }
  }

  return <DisplayBox headerIcon="fas fa-list" headerText="Groups">{getRecords()}</DisplayBox>
}
