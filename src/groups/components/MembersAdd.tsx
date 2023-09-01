import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ApiHelper, GroupInterface, DisplayBox, GroupMemberInterface, PersonHelper, PersonInterface, Loading } from "@churchapps/apphelper";
import { Table, TableBody, TableRow, TableCell, TableHead } from "@mui/material";
import { SmallButton } from "@churchapps/apphelper";

interface Props { group: GroupInterface, addFunction: (person: PersonInterface) => void }

export const MembersAdd: React.FC<Props> = (props) => {
  const [groupMembers, setGroupMembers] = React.useState<GroupMemberInterface[]>([]);
  const isSubscribed = useRef(true)

  const loadData = React.useCallback(() => { ApiHelper.get("/groupmembers?groupId=" + props.group.id, "MembershipApi").then(data => { if (isSubscribed.current) { setGroupMembers(data) } }); }, [props.group, isSubscribed]);
  const addMember = (gm: GroupMemberInterface) => {
    let members = groupMembers;
    let idx = members.indexOf(gm);
    let person = members.splice(idx, 1)[0].person;
    setGroupMembers(members);
    props.addFunction(person);
  }

  const getRows = () => {
    const rows: JSX.Element[] = [];
    if (groupMembers.length === 0) {
      rows.push(<TableRow key="0"><TableCell>No group members available.</TableCell></TableRow>);
      return rows;
    }
    for (let i = 0; i < groupMembers.length; i++) {
      const gm = groupMembers[i];
      rows.push(
        <TableRow key={i}>
          <TableCell><img src={PersonHelper.getPhotoUrl(gm.person)} alt="avatar" /></TableCell>
          <TableCell><Link to={"/people/" + gm.personId}>{gm.person.name.display}</Link></TableCell>
          <TableCell><SmallButton icon="person_add" text="Add" onClick={() => addMember(gm)} color="success" /></TableCell>
        </TableRow>
      );
    }
    return rows;
  }

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];
    if (groupMembers.length === 0) return rows;
    rows.push(<TableRow key="0"><th></th><th>Name</th><th></th></TableRow>);
    return rows;
  }

  React.useEffect(() => { if (props.group !== null) loadData(); return () => { isSubscribed.current = false } }, [props.group, loadData]);

  let content = <Loading />
  if (groupMembers) {
    content = (<Table className="personSideTable">
      <TableHead>{getTableHeader()}</TableHead>
      <TableBody>{getRows()}</TableBody>
    </Table>);
  }

  return (
    <DisplayBox headerIcon="person" headerText="Available Group Members" data-cy="available-group-members">
      {content}
    </DisplayBox>
  );
}

