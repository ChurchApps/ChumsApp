import React, { useRef, useState } from "react";
import { ApiHelper, GroupInterface, DisplayBox, UserHelper, GroupMemberInterface, PersonHelper, PersonInterface, ExportLink, Permissions, Loading, ArrayHelper } from "@churchapps/apphelper";
import { Link } from "react-router-dom";
import { Button, Icon, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { SmallButton } from "@churchapps/apphelper";

interface Props {
  group: GroupInterface,
  addedPerson?: PersonInterface,
  addedCallback?: () => void
}

export const GroupMembers: React.FC<Props> = (props) => {
  const [groupMembers, setGroupMembers] = useState<GroupMemberInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  //const isSubscribed = useRef(true);

  const loadData = React.useCallback(() => {
    setIsLoading(true);
    ApiHelper.get("/groupmembers?groupId=" + props.group.id, "MembershipApi").then(data => {
      //if (isSubscribed.current) {
      setGroupMembers(data)
      //}
    }).finally(() => { setIsLoading(false) });
  }, [props.group.id]);

  const handleRemove = (member: GroupMemberInterface) => {
    let members = [...groupMembers];
    let idx = members.indexOf(member);
    members.splice(idx, 1);
    setGroupMembers(members);
    ApiHelper.delete("/groupmembers/" + member.id, "MembershipApi");
  }

  const handleToggleLeader = (member: GroupMemberInterface) => {
    member.leader = !member.leader;
    console.log("Member", member);
    ApiHelper.post("/groupmembers", [member], "MembershipApi").then(() => { loadData() });
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
      rows.push(<TableRow key="0"><TableCell>No group members found.</TableCell></TableRow>)
      return rows;
    }

    for (let i = 0; i < groupMembers.length; i++) {
      const gm = groupMembers[i];
      //let editLink = (canEdit) ? <a href="about:blank" onClick={handleRemove} data-index={i} data-cy={`remove-member-${i}`} className="text-danger"><Icon>person_remove</Icon> Remove</a> : <></>
      let editLinks = []
      if (canEdit) {
        if (gm.leader) editLinks.push(<SmallButton icon="key_off" toolTip="Remove Leader Access" onClick={() => handleToggleLeader(gm)} color="error" />);
        else editLinks.push(<SmallButton icon="key" toolTip="Promote to Leader" onClick={() => handleToggleLeader(gm)} color="success" />);
        editLinks.push(<SmallButton icon="person_remove" toolTip="Remove" onClick={() => handleRemove(gm)} color="error" />);
      }

      rows.push(
        <TableRow key={i}>
          <TableCell><img src={PersonHelper.getPhotoUrl(gm.person)} alt="avatar" /></TableCell>
          <TableCell><Link to={"/people/" + gm.personId}>{gm.person.name.display}</Link></TableCell>
          <TableCell style={{ textAlign: "right" }}>{editLinks}</TableCell>
        </TableRow>
      );
    }
    return rows;
  }

  const getTableHeader = () => {
    const rows: JSX.Element[] = [];
    if (groupMembers.length === 0) {
      return rows;
    }

    rows.push(<TableRow key="header" sx={{textAlign: "left"}}><th></th><th>Name</th><th></th></TableRow>);
    return rows;
  }

  const getEditContent = () => (<>
    {UserHelper.checkAccess(Permissions.membershipApi.groupMembers.edit) && <SmallButton icon="edit_square" toolTip="Send a message to members" onClick={() => { setCount(0); setShow(!show) }}></SmallButton>}
    <ExportLink data={groupMembers} spaceAfter={true} filename="groupmembers.csv" />
  </>);

  const handleSend = async () => {
    const peopleIds = ArrayHelper.getIds(groupMembers, "personId");
    const ids = peopleIds.filter(id => id !== UserHelper.person.id); //remove the one that is sending the message.
    const data: any = { peopleIds: ids, contentType: "groupMessage", contentId: props.group.id, message: `Message from ${UserHelper.person.name.first}: ${message}` };
    await ApiHelper.post("/notifications/create", data, "MessagingApi");
  }

  React.useEffect(() => {
    if (props.group.id !== undefined) { loadData() }; return () => {
      //isSubscribed.current = false
    }
  }, [props.group, loadData]);

  React.useEffect(() => {
    if (props.addedPerson?.id !== undefined) { handleAdd() };
  }, [props.addedPerson, handleAdd]);

  const getTable = () => {
    if (isLoading) return <Loading />
    else return (<Table id="groupMemberTable">
      <TableHead>{getTableHeader()}</TableHead>
      <TableBody>{getRows()}</TableBody>
    </Table>);
  }

  return (
    <DisplayBox id="groupMembersBox" data-cy="group-members-tab" headerText="Group Members" headerIcon="group" editContent={getEditContent()} help="chums/groups">
      {show === true && (
        <div style={{ marginTop: "18px", marginBottom: "18px" }}>
          <TextField fullWidth multiline helperText={count + "/140"} inputProps={{ maxLength: 140 }} onChange={(e) => { setCount(e.target.value.length); setMessage(e.target.value); }} sx={{ margin: 0 }} />
          <div style={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
            <Button size="small" variant="contained" endIcon={<Icon fontSize="small">send</Icon>} onClick={() => { handleSend(); setShow(false); }}>Send</Button>
          </div>
        </div>)
      }
      {getTable()}
    </DisplayBox>
  );
}

