import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ApiHelper, GroupInterface, DisplayBox, GroupMemberInterface, PersonHelper, PersonInterface, Loading } from ".";
import { Table } from "react-bootstrap";

interface Props { group: GroupInterface, addFunction: (person: PersonInterface) => void }

export const MembersAdd: React.FC<Props> = (props) => {
  const [groupMembers, setGroupMembers] = React.useState<GroupMemberInterface[]>([]);
  const isSubscribed = useRef(true)

  const loadData = React.useCallback(() => { ApiHelper.get("/groupmembers?groupId=" + props.group.id, "MembershipApi").then(data => { if (isSubscribed.current) { setGroupMembers(data) } }); }, [props.group, isSubscribed]);
  const addMember = (e: React.MouseEvent) => {

    e.preventDefault();
    let anchor = e.currentTarget as HTMLAnchorElement;
    let idx = parseInt(anchor.getAttribute("data-index"));
    let gm = groupMembers;
    let person = gm.splice(idx, 1)[0].person;
    setGroupMembers(gm);
    props.addFunction(person);

  }

  const getRows = () => {
    const rows: JSX.Element[] = [];
    if (groupMembers.length === 0) {
      rows.push(<tr>No group members available.</tr>);
      return rows;
    }
    for (let i = 0; i < groupMembers.length; i++) {
      let gm = groupMembers[i];
      rows.push(
        <tr key={i}>
          <td><img src={PersonHelper.getPhotoUrl(gm.person)} alt="avatar" /></td>
          <td><Link to={"/people/" + gm.personId}>{gm.person.name.display}</Link></td>
          <td><a href="about:blank" className="text-success" data-cy="add-member-to-session" onClick={addMember} data-index={i}><i className="fas fa-user"></i> Add</a></td>
        </tr>
      );
    }
    return rows;
  }

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];
    if (groupMembers.length === 0) return rows;
    rows.push(<tr><th></th><th>Name</th><th>Action</th></tr>);
    return rows;
  }

  React.useEffect(() => { if (props.group !== null) loadData(); return () => { isSubscribed.current = false } }, [props.group, loadData]);

  let content = <Loading />
  if (groupMembers) {
    content = (<Table className="personSideTable">
      <thead>{getTableHeader()}</thead>
      <tbody>{getRows()}</tbody>
    </Table>);
  }

  return (
    <DisplayBox headerIcon="fas fa-user" headerText="Available Group Members" data-cy="available-group-members">
      {content}
    </DisplayBox>
  );
}

