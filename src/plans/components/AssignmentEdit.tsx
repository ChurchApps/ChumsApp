import React, { useEffect } from "react";
import { Table, TableCell, TableRow } from "@mui/material";
import { ApiHelper, GroupMemberInterface, InputBox, PersonHelper } from "@churchapps/apphelper";
import { AssignmentInterface, PositionInterface } from "../../helpers";

interface Props { assignment: AssignmentInterface, position:PositionInterface, updatedFunction: (done:boolean) => void }

export const AssignmentEdit = (props:Props) => {
  const [groupMembers, setGroupMembers] = React.useState<GroupMemberInterface[]>([]);

  const handleSave = () => {
    props.updatedFunction(true);
  }

  const handleDelete = () => {
    ApiHelper.delete("/assignments/" + props.assignment.id, "DoingApi").then(() => props.updatedFunction(true));
  }

  const loadData = () => {
    ApiHelper.get("/groupmembers?groupId=" + props.position.groupId, "MembershipApi").then(data => { setGroupMembers(data) });
  }

  const selectPerson = (gm:GroupMemberInterface) => {
    const a = { ...props.assignment } as AssignmentInterface;
    a.personId = gm.personId;
    ApiHelper.post("/assignments", [a], "DoingApi").then(() => { props.updatedFunction(props.position.count===1) });
  }

  const getMembers = () => {
    let rows: JSX.Element[] = [];
    if (groupMembers.length === 0) {
      rows.push(<TableRow key="0"><TableCell>No group members found.</TableCell></TableRow>)
      return rows;
    }

    for (let i = 0; i < groupMembers.length; i++) {
      const gm = groupMembers[i];
      rows.push(
        <TableRow key={i}>
          <TableCell><img src={PersonHelper.getPhotoUrl(gm.person)} alt="avatar" style={{height:30}} /></TableCell>
          <TableCell style={{width:"80%"}}><a href="about:blank" onClick={(e) => { e.preventDefault(); selectPerson(gm); }}>{gm.person.name.display}</a></TableCell>
        </TableRow>
      );
    }
    return rows;
  }

  useEffect(() => { loadData(); }, [props.position?.groupId]);

  return (<>
    <InputBox headerText={(props.assignment?.id) ? "Edit Assignment" : "Assign Position"} headerIcon="assignment" saveFunction={handleSave} cancelFunction={() => props.updatedFunction(true)} deleteFunction={(props.assignment.id) ? handleDelete : null } saveText={"Done"}>
      <Table size="small">
        {getMembers()}
      </Table>
    </InputBox>
  </>);
}

