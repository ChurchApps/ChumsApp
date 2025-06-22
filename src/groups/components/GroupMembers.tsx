import React, { useRef, useState } from "react";
import { ApiHelper, GroupInterface, DisplayBox, UserHelper, GroupMemberInterface, PersonHelper, PersonInterface, ExportLink, Permissions, Loading, ArrayHelper, Locale } from "@churchapps/apphelper";
import { Link } from "react-router-dom";
import { Button, FormControl, Icon, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
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
  const [showTemplates, setShowTemplates] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
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
    const members = [...groupMembers];
    const idx = members.indexOf(member);
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
      const gm = { groupId: props.group.id, personId: props.addedPerson.id, person: props.addedPerson } as GroupMemberInterface
      ApiHelper.post("/groupmembers", [gm], "MembershipApi").then((data) => {
        gm.id = data[0].id;
      });
      const members = [...groupMembers];
      members.push(gm);
      setGroupMembers(members);
      props.addedCallback();
    }
  }, [props, getMemberByPersonId, groupMembers]);

  const getRows = () => {
    const canEdit = UserHelper.checkAccess(Permissions.membershipApi.groupMembers.edit);
    const rows: JSX.Element[] = [];

    if (groupMembers.length === 0) {
      rows.push(<TableRow key="0"><TableCell>{Locale.label("groups.groupMembers.noMem")}</TableCell></TableRow>)
      return rows;
    }

    for (let i = 0; i < groupMembers.length; i++) {
      const gm = groupMembers[i];
      //let editLink = (canEdit) ? <a href="about:blank" onClick={handleRemove} data-index={i} data-cy={`remove-member-${i}`} className="text-danger"><Icon>person_remove</Icon> Remove</a> : <></>
      const editLinks = []
      if (canEdit) {
        if (gm.leader) editLinks.push(<SmallButton icon="key_off" toolTip="Remove Leader Access" onClick={() => handleToggleLeader(gm)} color="error" data-testid={`remove-leader-button-${gm.id}`} ariaLabel={`Remove leader access for ${gm.person.name.display}`} />);
        else editLinks.push(<SmallButton icon="key" toolTip="Promote to Leader" onClick={() => handleToggleLeader(gm)} color="success" data-testid={`promote-leader-button-${gm.id}`} ariaLabel={`Promote ${gm.person.name.display} to leader`} />);
        editLinks.push(<SmallButton icon="person_remove" toolTip="Remove" onClick={() => handleRemove(gm)} color="error" data-testid={`remove-member-button-${gm.id}`} ariaLabel={`Remove ${gm.person.name.display} from group`} />);
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

    rows.push(<TableRow key="header" sx={{textAlign: "left"}}><th></th><th>{Locale.label("common.name")}</th><th></th></TableRow>);
    return rows;
  }

  const handleTemplateMessage = (templateType: string) => {
    let newMessage = "";
    if (templateType !== "") {
      switch (templateType) {
        case "welcome_volunteers": newMessage = Locale.label("groups.groupMembers.templates.welcome_volunteers.message"); break;
        default: newMessage = ""; break;
      }
    }
    setMessage(newMessage);
  }

  const getEditContent = () => (<>
    {UserHelper.checkAccess(Permissions.membershipApi.groupMembers.edit) && <SmallButton icon="edit_square" toolTip={Locale.label("groups.groupMembers.sendMemMsg")} onClick={() => { setCount(0); setShow(!show) }} data-testid="send-message-button" ariaLabel="Send message to members"></SmallButton>}
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
    <DisplayBox id="groupMembersBox" data-cy="group-members-tab" headerText={Locale.label("groups.groupMembers.groupMem")} headerIcon="group" editContent={getEditContent()} help="chums/groups">
      {show === true && (
        <div style={{ marginTop: "18px", marginBottom: "18px" }}>
          {(showTemplates === true)
            ? (<FormControl fullWidth>
              <InputLabel id="message_templates">{Locale.label("groups.groupMembers.templates.templates")}</InputLabel>
              <Select name="templates" labelId="message_templates" label={Locale.label("groups.groupMembers.templates.templates")} value={selectedTemplate} onChange={(e) => { setSelectedTemplate(e.target.value); handleTemplateMessage(e.target.value); }}>
                <MenuItem value="">{Locale.label("groups.groupMembers.templates.none")}</MenuItem>
                <MenuItem value="welcome_volunteers">{Locale.label("groups.groupMembers.templates.welcome_volunteers.heading")}</MenuItem>
              </Select>
            </FormControl>)
            : (<a href="about:blank" onClick={(e) => { e.preventDefault(); setShowTemplates(!showTemplates); }} style={{ paddingLeft: "5px" }}>{Locale.label("groups.groupMembers.showTemplates")}</a>)
          }
          <TextField fullWidth multiline helperText={(selectedTemplate) ? "" : (count + "/140")} inputProps={{ maxLength: (selectedTemplate) ? null : 140 }} value={message} onChange={(e) => { setCount(e.target.value.length); setMessage(e.target.value); }} sx={{ margin: 0, marginTop: 1 }} />
          <div style={{ display: "flex", justifyContent: "end", alignItems: "center", marginTop: "15px" }}>
            <Button size="small" variant="contained" endIcon={<Icon fontSize="small">send</Icon>} onClick={() => { handleSend(); setShow(false); setMessage(""); setShowTemplates(false); setSelectedTemplate(""); }}>{Locale.label("groups.groupMembers.send")}</Button>
          </div>
        </div>)
      }
      {getTable()}
    </DisplayBox>
  );
}

