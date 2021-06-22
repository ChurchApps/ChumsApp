import React, { useRef, useState } from "react";
import { ApiHelper, GroupInterface, DisplayBox, UserHelper, GroupMemberInterface, PersonHelper, PersonInterface, ExportLink, Permissions, Loading } from ".";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";

interface Props {
  group: GroupInterface,
  addedPerson?: PersonInterface,
  addedCallback?: () => void
}

export const GroupMembers: React.FC<Props> = (props) => {
  const [groupMembers, setGroupMembers] = useState<GroupMemberInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isSubscribed = useRef(true);

  const loadData = React.useCallback(() => {
    setIsLoading(true);
    ApiHelper.get("/groupmembers?groupId=" + props.group.id, "MembershipApi").then(data => {
      if (isSubscribed.current) {
        setGroupMembers(data)
      }
    }).finally(() => { setIsLoading(false) });
  }, [props.group.id]);

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    let anchor = e.currentTarget as HTMLAnchorElement;
    let idx = parseInt(anchor.getAttribute("data-index"));
    let members = [...groupMembers];
    let member = members.splice(idx, 1)[0];
    setGroupMembers(members);
    ApiHelper.delete("/groupmembers/" + member.id, "MembershipApi");
  }

  const getMemberByPersonId = React.useCallback((personId: string) => {
    let result = null;
    for (let i = 0; i < groupMembers.length; i++) if (groupMembers[i].personId === personId) result = groupMembers[i];
    return result;
  }, [groupMembers]);

  const handleAdd = React.useCallback(() => {
    if (getMemberByPersonId(props.addedPerson.id) === null) {
      let gm = { groupId: props.group.id, personId: props.addedPerson.id, person: props.addedPerson } as GroupMemberInterface
      ApiHelper.post("/groupmembers", [gm], "MembershipApi");
      let members = [...groupMembers];
      members.push(gm);
      setGroupMembers(members);
      props.addedCallback();
    }
  }, [props, getMemberByPersonId, groupMembers]);

  const getRows = () => {
    let canEdit = UserHelper.checkAccess(Permissions.membershipApi.groupMembers.edit);
    let rows: JSX.Element[] = [];

    if (groupMembers.length === 0) {
      rows.push(<tr key="0"><td>No group members found.</td></tr>)
      return rows;
    }

    for (let i = 0; i < groupMembers.length; i++) {
      let gm = groupMembers[i];
      let editLink = (canEdit) ? <a href="about:blank" onClick={handleRemove} data-index={i} data-cy={`remove-member-${i}`} className="text-danger"><i className="fas fa-user-times"></i> Remove</a> : <></>
      rows.push(
        <tr key={i}>
          <td><img src={PersonHelper.getPhotoUrl(gm.person)} alt="avatar" /></td>
          <td><Link to={"/people/" + gm.personId}>{gm.person.name.display}</Link></td>
          <td>{editLink}</td>
        </tr>
      );
    }
    return rows;
  }

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];
    if (groupMembers.length === 0) {
      return rows;
    }

    rows.push(<tr key="header"><th></th><th>Name</th><th>Action</th></tr>);
    return rows;
  }

  const getEditContent = () => (<ExportLink data={groupMembers} spaceAfter={true} filename="groupmembers.csv" />)

  React.useEffect(() => {
    if (props.group.id !== undefined) { loadData() }; return () => {
      isSubscribed.current = false
    }
  }, [props.group, loadData]);

  React.useEffect(() => {
    if (props.addedPerson?.id !== undefined) { handleAdd() };
  }, [props.addedPerson, handleAdd]);

  const getTable = () => {
    if (isLoading) return <Loading />
    else return (<Table id="groupMemberTable">
      <thead>{getTableHeader()}</thead>
      <tbody>{getRows()}</tbody>
    </Table>);
  }

  return (
    <DisplayBox id="groupMembersBox" data-cy="group-members-tab" headerText="Group Members" headerIcon="fas fa-users" editContent={getEditContent()}>
      {getTable()}
    </DisplayBox>
  );
}

